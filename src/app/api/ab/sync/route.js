// Persists the user's current design assignment to Redis.
// Called once per tab by AbClientBootstrap (POST /api/ab/sync)

export const runtime = "nodejs";       // ensure Node (TCP) runtime
export const dynamic = "force-dynamic"; // avoid any caching

import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import ABTestManager from "@/lib/ab/ABTestManager";
import { experiments } from "@/lib/ab/config";
import { redis as redisClient } from "@/session/redis"; // <-- adjust if default export

const ab = new ABTestManager({ experiments });

export async function POST() {
  try {
    await ab.persistAssignmentsFromCookies({
      cookiesStore: cookies(),
      headers: headers(),
      redisClient,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
