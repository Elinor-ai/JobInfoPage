import {cookies} from 'next/headers';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '@/lib/redis';
import decider from '@/lib/decider';

export async function GET(request) {
  const url = new URL(request.url);
  const flow = url.searchParams.get("flow") || "default";
  const metadata = Object.fromEntries(url.searchParams.entries());

  // --- Get or set userId cookie ---
  const cookieStore = cookies();
  let userId = cookieStore.get("userId")?.value;
  if (!userId) {
    userId = uuidv4();
  }

  const cacheKey = `variant:${userId}:${flow}`;
  let variant;

  try {
    if (redisClient?.isOpen) {
      variant = await redisClient.get(cacheKey);
    }
  } catch (err) {
    console.error("Redis get error", err);
  }

  if (!variant) {
    variant = await decider.getVariant(userId, flow, metadata);
    try {
      if (redisClient?.isOpen) {
        await redisClient.set(cacheKey, variant);
      }
    } catch (err) {
      console.error("Redis set error", err);
    }
  }

  const res = NextResponse.json({ userId, flow, variant });

  res.cookies.set("userId", userId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, 
  });

  return res;
}