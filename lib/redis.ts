import { Redis } from "@upstash/redis";

// Provide a resilient redis client that won't throw at import time when
// UPSTASH env vars are missing or malformed (e.g., during static build or
// if env vars were set with surrounding quotes in the hosting provider).
const _rawUrl = process.env.UPSTASH_REDIS_REST_URL;
const _rawToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const sanitize = (v?: string) => (v ? v.trim().replace(/^['"]+|['"]+$/g, "") : undefined);
const UPSTASH_URL = sanitize(_rawUrl);
const UPSTASH_TOKEN = sanitize(_rawToken);

let _redisClient: any;

// Helper to create minimal in-memory fallback.
function createInMemoryFallback() {
  const _store = new Map<string, string>();
  return {
    get: async (key: string) => (_store.has(key) ? (_store.get(key) as string) : null),
    setex: async (_key: string, _ttlSeconds: number, value: string) => {
      _store.set(_key, value);
      return;
    },
    set: async (key: string, value: string) => {
      _store.set(key, value);
      return;
    },
  };
}

if (UPSTASH_URL && UPSTASH_TOKEN && UPSTASH_URL.startsWith("https://")) {
  try {
    _redisClient = new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN });
  } catch (err) {
    // Construction failed (e.g., malformed url). Fall back to in-memory store and warn.
    // Use console function guarded in case logging is restricted during build.
    try { console.warn('⚠️ Upstash Redis init failed, falling back to in-memory store:', err); } catch {}
    _redisClient = createInMemoryFallback();
  }
} else {
  // Missing or invalid UPSTASH config — use in-memory fallback to avoid runtime crashes.
  try { console.warn('⚠️ UPSTASH_REDIS env vars missing or invalid; using in-memory fallback for redis.'); } catch {}
  _redisClient = createInMemoryFallback();
}

export const redis = _redisClient as Redis;



