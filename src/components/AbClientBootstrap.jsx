"use client";

/**
 * Mirrors the current design variant(s) from cookies into sessionStorage
 * and triggers a single POST to /api/ab/sync so the server can persist
 * the assignment(s) to Redis. Safe to include once anywhere in your tree.
 *
 * - Reads variants for all configured programs from `experiments` config
 * - sessionStorage key shape: `${cookieName}:sessionVariant`
 * - One POST per tab (flagged via sessionStorage)
 */

import { useEffect } from "react";
import { experiments } from "@/lib/ab/config";

function readCookieValue(name) {
  const all = typeof document !== "undefined" ? document.cookie : "";
  if (!all) return null;
  // cookie string: "a=1; b=2; c=3"
  const parts = all.split("; ");
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const k = part.slice(0, eq);
    const v = part.slice(eq + 1);
    if (k === name) return decodeURIComponent(v);
  }
  return null;
}

export default function AbClientBootstrap() {
  useEffect(() => {
    // Mirror cookie -> sessionStorage (per program)
    try {
      for (const def of experiments) {
        const variantCookie = def?.cookieNames?.variant;
        if (!variantCookie) continue;

        const variant = readCookieValue(variantCookie);
        if (!variant) continue;

        const sessionKey = `${variantCookie}:sessionVariant`;
        if (sessionStorage.getItem(sessionKey) !== variant) {
          sessionStorage.setItem(sessionKey, variant);
        }
      }
    } catch {
      // sessionStorage may be blocked in some contexts; ignore gracefully
    }

    // Persist assignment(s) once per tab
    try {
      const SYNC_FLAG = "design:synced"; // one call persists all programs
      if (sessionStorage.getItem(SYNC_FLAG) !== "true") {
        fetch("/api/ab/sync", { method: "POST", keepalive: true })
          .then(() => {
            try {
              sessionStorage.setItem(SYNC_FLAG, "true");
            } catch {}
          })
          .catch(() => {
            // Ignore network errors; next navigation/refresh will retry
          });
      }
    } catch {
      // sessionStorage unavailable; skip flagging but no functional harm
      fetch("/api/ab/sync", { method: "POST", keepalive: true }).catch(() => {});
    }
  }, []);

  return null;
}
