import type { AdminSession } from "@robarol/shared";

import { apiFetch } from "../core/api-client";

export function fetchAdminSession() {
    return apiFetch<AdminSession>("/api/auth/me");
}

export function loginAdmin(email: string, password: string) {
    return apiFetch<AdminSession>("/api/auth/login", {
        method: "POST",
        body: {
            email,
            password
        }
    });
}

export function signupAdmin(email: string, password: string, signupSecret?: string) {
    return apiFetch<AdminSession>("/api/auth/admin-signup", {
        method: "POST",
        body: {
            email,
            password,
            signupSecret: signupSecret?.trim() || undefined
        }
    });
}

export function logoutAdmin() {
    return apiFetch<void>("/api/auth/logout", {
        method: "POST"
    });
}
