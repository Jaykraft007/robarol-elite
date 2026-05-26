import { z } from "zod";

export const authLoginSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(8)
});

export const authAdminSignupSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(8),
    signupSecret: z.string().trim().optional()
});
