import { Router } from "express";

import { env } from "../../config/env.js";
import { AppError } from "../../lib/app-error.js";
import { asyncHandler } from "../../lib/async-handler.js";
import { clearSessionCookies, setSessionCookies } from "../../lib/cookies.js";
import { getRequestContext, logInfo, logWarn } from "../../lib/logger.js";
import { createSupabaseAuthClient, supabaseServiceClient } from "../../lib/supabase.js";
import { resolveAdminSession } from "../../middleware/auth.js";
import { authAdminSignupSchema, authLoginSchema } from "./auth-schemas.js";

export const authRouter = Router();

interface AdminUserRecord {
    role: "admin";
    is_active: boolean;
}

async function loadAdminUser(userId: string) {
    const { data, error } = await supabaseServiceClient
        .from("admin_users")
        .select("role, is_active")
        .eq("id", userId)
        .maybeSingle<AdminUserRecord>();

    if (error) {
        throw new AppError(500, "Unable to verify admin access.", error.message);
    }

    if (!data || !data.is_active || data.role !== "admin") {
        throw new AppError(403, "Admin access required.");
    }

    return data;
}

async function buildAdminSession(userId: string, email: string) {
    const adminUser = await loadAdminUser(userId);

    return {
        userId,
        email,
        role: adminUser.role
    };
}

function assertAdminSignupAllowed(signupSecret?: string) {
    if (env.ADMIN_SIGNUP_SECRET) {
        if (signupSecret !== env.ADMIN_SIGNUP_SECRET) {
            throw new AppError(403, "Invalid admin signup secret.");
        }

        return;
    }

    if (env.NODE_ENV === "production") {
        throw new AppError(403, "Admin signup is disabled.");
    }
}

authRouter.post("/login", asyncHandler(async (request, response) => {
    const credentials = authLoginSchema.parse(request.body);
    const context = getRequestContext(request, response);
    const authClient = createSupabaseAuthClient();
    const { data, error } = await authClient.auth.signInWithPassword(credentials);

    if (error || !data.user || !data.session) {
        logWarn("Admin login failed", {
            ...context,
            email: credentials.email,
            authError: error?.message ?? null
        });
        throw new AppError(401, "Invalid email or password.");
    }

    try {
        const session = await buildAdminSession(data.user.id, data.user.email ?? "");
        setSessionCookies(response, data.session);
        logInfo("Admin login succeeded", {
            ...context,
            userId: session.userId,
            email: session.email
        });

        response.json(session);
    } catch (error) {
        clearSessionCookies(response);
        throw error;
    }
}));

authRouter.post("/admin-signup", asyncHandler(async (request, response) => {
    const payload = authAdminSignupSchema.parse(request.body);
    const context = getRequestContext(request, response);

    assertAdminSignupAllowed(payload.signupSecret);

    const { data: createUserData, error: createUserError } = await supabaseServiceClient.auth.admin.createUser({
        email: payload.email,
        password: payload.password,
        email_confirm: true
    });

    if (createUserError || !createUserData.user) {
        const accountExists = createUserError?.message.toLowerCase().includes("already");
        logWarn("Admin signup failed", {
            ...context,
            email: payload.email,
            createUserError: createUserError?.message ?? null,
            accountExists
        });
        throw new AppError(
            accountExists ? 409 : 400,
            accountExists ? "Admin account already exists for this email." : "Unable to create admin account.",
            createUserError?.message
        );
    }

    const { error: adminUserError } = await supabaseServiceClient
        .from("admin_users")
        .upsert({
            id: createUserData.user.id,
            role: "admin",
            is_active: true
        }, {
            onConflict: "id"
        });

    if (adminUserError) {
        await supabaseServiceClient.auth.admin.deleteUser(createUserData.user.id).catch(() => undefined);
        throw new AppError(500, "Unable to create admin access.", adminUserError.message);
    }

    const authClient = createSupabaseAuthClient();
    const { data: signInData, error: signInError } = await authClient.auth.signInWithPassword({
        email: payload.email,
        password: payload.password
    });

    if (signInError || !signInData.user || !signInData.session) {
        throw new AppError(500, "Admin account created, but sign-in failed.", signInError?.message);
    }

    setSessionCookies(response, signInData.session);
    logInfo("Admin signup succeeded", {
        ...context,
        userId: signInData.user.id,
        email: signInData.user.email ?? payload.email
    });

    response.status(201).json(await buildAdminSession(
        signInData.user.id,
        signInData.user.email ?? payload.email
    ));
}));

authRouter.post("/logout", asyncHandler(async (_request, response) => {
    clearSessionCookies(response);
    response.status(204).send();
}));

authRouter.get("/me", asyncHandler(async (request, response) => {
    const session = await resolveAdminSession(request, response);

    if (!session) {
        throw new AppError(401, "Authentication required.");
    }

    logInfo("Admin session check succeeded", {
        ...getRequestContext(request, response),
        userId: session.userId,
        email: session.email
    });

    response.json(session);
}));
