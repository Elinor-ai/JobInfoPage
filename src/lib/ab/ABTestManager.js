// src/lib/ab/ABTestManager.js
// Multi-version design delivery manager:
// - Creates/reads a sticky user id cookie
// - Assigns a design (supports 3–4+ variants, weighted & stable)
// - Honors optional URL override (?design=...)
// - Exposes helpers for SSR reads, Redis persistence, and admin force-assign

import { NextResponse } from "next/server";
import { GLOBAL_USER_ID_COOKIE, ADMIN_TOKEN } from "./config";

export default class ABTestManager {
  constructor({ experiments, randomSource } = {}) {
    this.experiments = experiments || [];
    this.randomSource = typeof randomSource === "function" ? randomSource : Math.random;
  }

  // Runs in middleware: ensure uid + design cookie(s), allow URL override
  applyMiddleware(request) {
    const response = NextResponse.next();

    // Global sticky user id
    let globalUserId = request.cookies.get(GLOBAL_USER_ID_COOKIE)?.value;
    if (!globalUserId) {
      globalUserId = this.generateUserId();
      response.cookies.set({
        name: GLOBAL_USER_ID_COOKIE,
        value: globalUserId,
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    // Per-program design cookie
    for (const def of this.experiments) {
      const userIdCookieName = def.cookieNames?.userId || GLOBAL_USER_ID_COOKIE;
      const userId = request.cookies.get(userIdCookieName)?.value || globalUserId || this.generateUserId();
      const variantCookieName = def.cookieNames?.variant;

      // 1) Optional URL override (?design=compact)
      if (def.urlOverride?.enabled && variantCookieName) {
        const param = def.urlOverride.param || "design";
        const variantFromUrl = request.nextUrl.searchParams.get(param);
        if (variantFromUrl && def.variants.includes(variantFromUrl)) {
          this._setVariantCookie(response, variantCookieName, variantFromUrl, def.cookieMaxAgeDays);
          continue; // respect explicit override
        }
      }

      // 2) Ensure a valid sticky variant cookie
      let variant = variantCookieName ? request.cookies.get(variantCookieName)?.value : null;
      const isValid = variant && def.variants.includes(variant);
      if (!isValid) {
        variant = this.chooseVariant(def, userId);
        this._setVariantCookie(response, variantCookieName, variant, def.cookieMaxAgeDays);
      }
    }

    return response;
  }

  // Server helper: read chosen design for a program (SSR, no flicker)
  getServerVariantForProgram(cookiesStore, programId) {
    const def = this.experiments.find((e) => e.id === programId);
    if (!def) return null;
    const name = def.cookieNames?.variant;
    return name ? cookiesStore.get(name)?.value || null : null;
  }

  // Persist all program assignments (from cookies) to Redis
  async persistAssignmentsFromCookies({ cookiesStore, headers, redisClient }) {
    if (!cookiesStore || !redisClient) return;

    const userAgent = headers?.get?.("user-agent") || "";
    const referer = headers?.get?.("referer") || "";
    const assignedAtIso = new Date().toISOString();
    const globalUserId = cookiesStore.get(GLOBAL_USER_ID_COOKIE)?.value || null;

    const tasks = this.experiments.map(async (def) => {
      const userIdCookieName = def.cookieNames?.userId || GLOBAL_USER_ID_COOKIE;
      const userId = cookiesStore.get(userIdCookieName)?.value || globalUserId;
      const variant = cookiesStore.get(def.cookieNames?.variant)?.value;
      if (!userId || !variant || !def.variants.includes(variant)) return;

      const key = `design:assignment:${def.id}:${userId}`;
      await redisClient.hset(key, {
        userId,
        programId: def.id,
        variant,
        assignedAtIso,
        userAgent,
        referer,
      });
      await redisClient.expire(key, Math.max(1, (def.redisTtlDays || 365) * 24 * 60 * 60));
    });

    await Promise.all(tasks);
  }

  // Admin-only: force-assign a user to a specific variant
  async adminForceAssign({ headers, redisClient, cookiesStore, programId, userId, variant }) {
    if (!ADMIN_TOKEN) throw new Error("ADMIN_TOKEN not set");
    const token = headers?.get?.("x-admin-token");
    if (token !== ADMIN_TOKEN) throw new Error("Unauthorized");

    const def = this.experiments.find((e) => e.id === programId);
    if (!def) throw new Error("Unknown programId");
    if (!def.variants.includes(variant)) throw new Error("Invalid variant for this program");

    const key = `design:assignment:${programId}:${userId}`;
    await redisClient.hset(key, {
      userId,
      programId,
      variant,
      assignedAtIso: new Date().toISOString(),
      userAgent: headers?.get?.("user-agent") || "",
      referer: headers?.get?.("referer") || "",
    });
    await redisClient.expire(key, Math.max(1, (def.redisTtlDays || 365) * 24 * 60 * 60));

    // If this request belongs to that same user, refresh their cookie immediately
    const userIdCookieName = def.cookieNames?.userId || GLOBAL_USER_ID_COOKIE;
    const currentUserId = cookiesStore?.get(userIdCookieName)?.value || null;
    if (currentUserId && currentUserId === userId) {
      const res = NextResponse.json({ ok: true });
      this._setVariantCookie(res, def.cookieNames?.variant, variant, def.cookieMaxAgeDays);
      return res;
    }
    return NextResponse.json({ ok: true });
  }

  // --- Assignment logic (supports many versions + weights)

  chooseVariant(def, userId) {
    const list = Array.isArray(def.variants) && def.variants.length > 0 ? def.variants : ["control"];
    const strategy = def.assignmentStrategy || "weightedHash";
    const weights = this._normalizeWeights(def.allocation, list);

    if (strategy === "hashUserId") {
      const idx = this._hashIndex(String(userId || ""), list.length);
      return list[idx];
    }

    if (strategy === "randomWeighted") {
      return this._pickRandomWeighted(weights);
    }

    // Default: stable + weighted by userId
    return this._pickWeightedByHash(String(userId || ""), weights);
  }

  // --- Internals

  _setVariantCookie(response, name, value, maxAgeDays = 180) {
    response.cookies.set({
      name,
      value,
      httpOnly: false,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(maxAgeDays * 24 * 60 * 60),
    });
  }

  _normalizeWeights(allocation, variants) {
    const out = [];
    let total = 0;
    for (const id of variants) {
      const w = Math.max(0, Number(allocation?.[id] ?? 0));
      out.push({ id, weight: w });
      total += w;
    }
    // If all zero/missing, fallback to equal weights
    if (total === 0) {
      return variants.map((id) => ({ id, weight: 1 }));
    }
    return out;
  }

  _pickRandomWeighted(weights) {
    const total = weights.reduce((s, w) => s + w.weight, 0);
    let r = this.randomSource() * total;
    for (const w of weights) {
      if ((r -= w.weight) <= 0) return w.id;
    }
    return weights[weights.length - 1].id;
  }

  _pickWeightedByHash(userId, weights) {
    const total = weights.reduce((s, w) => s + w.weight, 0);
    const h = this.fnv1aHash(userId);
    let bucket = h % total; // stable bucket 0..total-1
    for (const w of weights) {
      if (bucket < w.weight) return w.id;
      bucket -= w.weight;
    }
    return weights[weights.length - 1].id;
  }

  _hashIndex(userId, n) {
    const h = this.fnv1aHash(userId);
    return h % n;
  }

  generateUserId() {
    const g = globalThis || {};
    const cryptoObj = g.crypto;
    if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
      return cryptoObj.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  // FNV-1a 32-bit
  fnv1aHash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h >>> 0) * 0x01000193;
    }
    return h >>> 0;
  }
}
