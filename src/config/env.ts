import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .positive()
    .default(3000),

  OPENAI_API_KEY: z
    .string()
    .min(1, "OPENAI_API_KEY is required"),

  GITHUB_TOKEN: z
  .string()
  .min(1, "GITHUB_TOKEN is required"),

  MONGODB_URI: z
  .string()
  .min(
    1,
    "MONGODB_URI is required",
  ),

  MONGODB_LOCAL_FALLBACK_URI: z
  .string()
  .min(1)
  .default(
    "mongodb://127.0.0.1:27017",
  ),
  
  MONGODB_DB_NAME: z
  .string()
  .min(1)
  .default(
    "gitarchitect",
  ),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment configuration");

  console.error(
    parsedEnv.error.flatten().fieldErrors,
  );

  process.exit(1);
}

export const env = parsedEnv.data;
