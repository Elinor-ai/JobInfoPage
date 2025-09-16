import Redis from "ioredis";

export const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) {
  throw new Error("REDIS_URL env var is required");
}

export const redisClient = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 2,
  enableAutoPipelining: true,
});
