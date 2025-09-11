// Admin-only endpoint to force-assign a specific design to a specific user.
// POST /api/ab/admin/assign
// Body: { "programId": "designs_v1", "userId": "<design:uid>", "variant": "compact" }
// Header: x-admin-token: <DESIGN_ADMIN_TOKEN>

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import ABTestManager from "@/lib/ab/ABTestManager";
import { experiments, ADMIN_TOKEN } from "@/lib/ab/config";
import { redis as redisClient } from "@/session/redis"; // <-- adjust if default export

const abAdmin = new ABTestManager({ experiments });

export async function POST(request) {
  if (!ADMIN_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_TOKEN not set on server" },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { programId, userId, variant } = body || {};
  if (!programId || !userId || !variant) {
    return NextResponse.json(
      { ok: false, error: "Missing programId, userId, or variant" },
      { status: 400 }
    );
  }

  try {
    // This method verifies the token, writes Redis, and (if same user) updates the cookie
    const res = await abAdmin.adminForceAssign({
      headers: headers(),
      redisClient,
      cookiesStore: cookies(),
      programId,
      userId,
      variant,
    });
    return res; // already a NextResponse from the class on success
  } catch (err) {
    const msg = String(err?.message || err);
    const status = /unauthorized/i.test(msg) ? 401 : 400;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
