import type { CookieOptions, Response } from "express";
import type { Session } from "@supabase/supabase-js";

import { env } from "../config/env.js";

export const ACCESS_TOKEN_COOKIE = "robarol-access-token";
export const REFRESH_TOKEN_COOKIE = "robarol-refresh-token";

function normalizeCookieDomain(domain: string | undefined) {
    if (!domain) {
        return undefined;
    }

    const trimmedDomain = domain.trim();

    if (!trimmedDomain) {
        return undefined;
    }

    const candidate = trimmedDomain
        .replace(/^[a-z]+:\/\//i, "")
        .replace(/\/.*$/, "")
        .replace(/:\d+$/, "")
        .replace(/^\.+/, "");

    const normalized = candidate.toLowerCase();

    if (
        !normalized
        || normalized === "localhost"
        || normalized === "127.0.0.1"
        || normalized === "::1"
        || normalized === "[::1]"
        || !normalized.includes(".")
    ) {
        return undefined;
    }

    return candidate;
}

function getBaseCookieOptions(): CookieOptions {
    return {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: env.COOKIE_SAME_SITE,
        domain: normalizeCookieDomain(env.COOKIE_DOMAIN),
        path: "/"
    };
}

export function setSessionCookies(response: Response, session: Session) {
    const baseOptions = getBaseCookieOptions();

    response.cookie(ACCESS_TOKEN_COOKIE, session.access_token, {
        ...baseOptions,
        maxAge: session.expires_in * 1000
    });
    response.cookie(REFRESH_TOKEN_COOKIE, session.refresh_token, {
        ...baseOptions,
        maxAge: 1000 * 60 * 60 * 24 * 30
    });
}

export function clearSessionCookies(response: Response) {
    const baseOptions = getBaseCookieOptions();

    response.clearCookie(ACCESS_TOKEN_COOKIE, baseOptions);
    response.clearCookie(REFRESH_TOKEN_COOKIE, baseOptions);
}
