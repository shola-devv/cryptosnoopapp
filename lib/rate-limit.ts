import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// Default rate limit: 10 req / 10s
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});

// Strict rate limit: 5 req / 60s
export const strictRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
});

// 🔵 Medium rate limit: 20 req / 30s
export const mediumRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(20, "30 s"),
  analytics: true,
});

// 🔥 Burst rate limit: 50 req / 5 minutes
export const burstRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(50, "300 s"),
  analytics: true,
});
