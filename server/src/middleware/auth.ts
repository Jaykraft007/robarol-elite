import type { Request, Response } from "express";
import type { AdminSession } from "@robarol/shared";

import { AppError } from "../lib/app-error.js";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, clearSessionCookies, setSessionCookies } from "../lib/cookies.js";
import { getRequestContext, logInfo, logWarn } from "../lib/logger.js";
import { createSupabaseAuthClient, supabaseServiceClient } from "../lib/supabase.js";

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

export async function resolveAdminSession(request: Request, response: Response): Promise<AdminSession | null> {
    const accessToken = request.cookies[ACCESS_TOKEN_COOKIE];
    const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE];
    const context = getRequestContext(request, response);

    if (!accessToken || !refreshToken) {
        logWarn("Admin session missing cookies", {
            ...context,
            accessTokenPresent: Boolean(accessToken),
            refreshTokenPresent: Boolean(refreshToken)
        });
        return null;
    }

    const authClient = createSupabaseAuthClient();
    const { data, error } = await authClient.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    if (error || !data.user || !data.session) {
        clearSessionCookies(response);
        logWarn("Admin session refresh failed", {
            ...context,
            authError: error?.message ?? null
        });
        return null;
    }

    setSessionCookies(response, data.session);
    const adminUser = await loadAdminUser(data.user.id);
    logInfo("Admin session resolved", {
        ...context,
        userId: data.user.id,
        email: data.user.email ?? null
    });

    return {
        userId: data.user.id,
        email: data.user.email ?? "",
        role: adminUser.role
    };
}

export async function requireAdmin(request: Request, response: Response) {
    const session = await resolveAdminSession(request, response);

    if (!session) {
        logWarn("Admin request rejected", getRequestContext(request, response));
        throw new AppError(401, "Authentication required.");
    }

    request.adminSession = session;
}
