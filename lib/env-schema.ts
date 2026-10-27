import { z } from "zod";
const nonempty = (value: string | undefined) => value?.trim() || undefined;
const db = z
  .string()
  .url()
  .refine((value) => /^postgres(ql)?:\/\//.test(value));
const http = z
  .string()
  .url()
  .refine((value) => /^https?:\/\//.test(value));
/** Pure validator, separated from the server-only environment reader for testing. */
export function parseEnv(source: Record<string, string | undefined>) {
  const database = db.safeParse(
    nonempty(source.DATABASE_URL) ?? nonempty(source.POSTGRES_URL),
  );
  const redisUrl = http.safeParse(
    nonempty(source.KV_REST_API_URL) ?? nonempty(source.UPSTASH_REDIS_REST_URL),
  );
  const redisToken = z
    .string()
    .min(1)
    .safeParse(
      nonempty(source.KV_REST_API_TOKEN) ??
        nonempty(source.UPSTASH_REDIS_REST_TOKEN),
    );
  const ai = z.string().min(1).safeParse(nonempty(source.OPENAI_API_KEY));
  return {
    hasDb: database.success,
    hasRedis: redisUrl.success && redisToken.success,
    hasAI: ai.success,
  };
}
