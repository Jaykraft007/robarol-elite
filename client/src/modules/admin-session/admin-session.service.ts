import type { AdminSession } from "@robarol/shared";

import { ApiError } from "../core/api-client";
import { supabase } from "../core/supabase";

interface AdminUserRow {
    role: "admin";
    is_active: boolean;
}

async function loadAdminUser(userId: string) {
    const { data, error } = await supabase
        .from("admin_users")
        .select("role, is_active")
        .eq("id", userId)
        .maybeSingle<AdminUserRow>();

    if (error) {
        throw new ApiError(500, "Unable to verify admin access.", error.message);
    }

    if (!data || !data.is_active || data.role !== "admin") {
        throw new ApiError(403, "Admin access required.");
    }

    return data;
}

async function buildAdminSession(userId: string, email: string) {
    const adminUser = await loadAdminUser(userId);

    return {
        userId,
        email,
        role: adminUser.role
    } satisfies AdminSession;
}

export async function fetchAdminSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        throw new ApiError(500, "Unable to load admin session.", error.message);
    }

    const user = data.session?.user;

    if (!user) {
        throw new ApiError(401, "Authentication required.");
    }

    return buildAdminSession(user.id, user.email ?? "");
}

export async function loginAdmin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error || !data.user) {
        throw new ApiError(401, "Invalid email or password.", error?.message);
    }

    try {
        return await buildAdminSession(data.user.id, data.user.email ?? email);
    } catch (loginError) {
        await supabase.auth.signOut().catch(() => undefined);
        throw loginError;
    }
}

export async function signupAdmin(): Promise<AdminSession> {
    throw new ApiError(403, "Admin accounts are created manually in Supabase.");
}

export async function logoutAdmin() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new ApiError(500, "Unable to sign out right now.", error.message);
    }
}

export function subscribeToAdminAuthChanges(callback: () => void | Promise<void>) {
    const { data } = supabase.auth.onAuthStateChange(() => {
        void callback();
    });

    return () => {
        data.subscription.unsubscribe();
    };
}
