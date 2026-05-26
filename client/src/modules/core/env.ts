const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

function isLoopbackHost(hostname: string) {
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]";
}

function normalizeApiBaseUrl(rawUrl: string) {
    const trimmedUrl = rawUrl.replace(/\/+$/, "");

    if (typeof window === "undefined") {
        return trimmedUrl;
    }

    try {
        const url = new URL(trimmedUrl);
        const currentHostname = window.location.hostname;

        if (isLoopbackHost(url.hostname) && isLoopbackHost(currentHostname) && url.hostname !== currentHostname) {
            url.hostname = currentHostname;
        }

        return url.toString().replace(/\/+$/, "");
    } catch {
        return trimmedUrl;
    }
}

function getDefaultApiBaseUrl() {
    if (typeof window === "undefined") {
        return "http://localhost:4000";
    }

    return `${window.location.protocol}//${window.location.hostname}:4000`;
}

export const apiBaseUrl = configuredApiUrl && configuredApiUrl.length > 0
    ? normalizeApiBaseUrl(configuredApiUrl)
    : getDefaultApiBaseUrl();
