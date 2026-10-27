import "server-only";
import { parseEnv } from "./env-schema";
export const { hasDb, hasRedis, hasAI } = parseEnv(process.env);
