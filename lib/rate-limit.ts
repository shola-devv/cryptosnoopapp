import { Ratelimit } from "@upstash/ratelimit";
import * as redisClient from "./redis";

// If Upstash isn't configured at build time (e.g., missing env vars), we export
// a safe no-op limiter that always allows requests. This prevents importing
// this module from throwing during static builds.
const UPSTASH_CONFIGURED = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

function makeRatelimit(limiterConfig?: { size: number; window: string }) {
  if (!UPSTASH_CONFIGURED) {
    return {
      async limit(_id: string) {
        return { success: true, remaining: 9999 };
      },
    } as const;
  }

  const size = limiterConfig?.size ?? 10;
  const window = limiterConfig?.window ?? "10 s";

  return new Ratelimit({
    redis: redisClient.redis as any,
    limiter: Ratelimit.slidingWindow(size, window as any),
    analytics: true,
  });
}

export const ratelimit = makeRatelimit({ size: 20, window: "30 s" }); // default medium
export const strictRatelimit = makeRatelimit({ size: 5, window: "60 s" });
export const mediumRatelimit = makeRatelimit({ size: 20, window: "30 s" });
export const burstRatelimit = makeRatelimit({ size: 50, window: "300 s" });
