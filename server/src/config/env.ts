import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    APP_ORIGIN: z.string().url(),
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    ADMIN_SIGNUP_SECRET: z.string().trim().optional().transform((value) => value || undefined),
    COOKIE_DOMAIN: z.string().trim().optional().transform((value) => value || undefined),
    COOKIE_SECURE: z.string().default("false").transform((value) => value === "true"),
    COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid server environment configuration", parsedEnv.error.flatten().fieldErrors);
    throw new Error("Invalid server environment configuration.");
}

export const env = parsedEnv.data;
