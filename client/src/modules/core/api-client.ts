import { apiBaseUrl } from "./env";

interface ApiFetchInit extends Omit<RequestInit, "body"> {
    body?: RequestInit["body"] | object;
}

export class ApiError extends Error {
    readonly statusCode: number;
    readonly details?: unknown;
    readonly requestId?: string;

    constructor(statusCode: number, message: string, details?: unknown, requestId?: string) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.details = details;
        this.requestId = requestId;
    }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !(value instanceof FormData) && !(value instanceof Blob);
}

export async function apiFetch<T>(path: string, init: ApiFetchInit = {}) {
    const headers = new Headers(init.headers);
    const rawBody = init.body;
    let body: BodyInit | null | undefined;

    if (isPlainObject(rawBody)) {
        headers.set("Content-Type", "application/json");
        body = JSON.stringify(rawBody);
    } else {
        body = rawBody as BodyInit | null | undefined;
    }

    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...init,
        body,
        headers,
        credentials: "include"
    });

    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok) {
        throw new ApiError(
            response.status,
            payload?.message ?? "Request failed.",
            payload?.details,
            payload?.requestId ?? response.headers.get("x-request-id") ?? undefined
        );
    }

    return payload as T;
}
