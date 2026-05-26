import type { Request, Response } from "express";
import { appendFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

type LogContext = Record<string, unknown>;
const logDirectory = resolve(process.cwd(), "logs");
const logFilePath = resolve(logDirectory, "server.log");

mkdirSync(logDirectory, { recursive: true });

function serializeContext(context: LogContext) {
    return Object.entries(context)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${formatValue(value)}`)
        .join(" ");
}

function formatValue(value: unknown): string {
    if (value instanceof Error) {
        return JSON.stringify({
            name: value.name,
            message: value.message,
            stack: value.stack
        });
    }

    if (typeof value === "string") {
        return JSON.stringify(value);
    }

    return JSON.stringify(value);
}

function log(level: "INFO" | "WARN" | "ERROR", message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const serializedContext = context ? serializeContext(context) : "";
    const line = `[${timestamp}] ${level} ${message}${serializedContext ? ` ${serializedContext}` : ""}`;
    const lineWithNewline = `${line}\n`;

    try {
        appendFileSync(logFilePath, lineWithNewline, "utf8");
    } catch (error) {
        console.error("Failed to write server log file", error);
    }

    if (level === "ERROR") {
        console.error(line);
        return;
    }

    console.log(line);
}

export function logInfo(message: string, context?: LogContext) {
    log("INFO", message, context);
}

export function logWarn(message: string, context?: LogContext) {
    log("WARN", message, context);
}

export function logError(message: string, context?: LogContext) {
    log("ERROR", message, context);
}

export function getRequestContext(request: Request, response: Response): LogContext {
    return {
        requestId: response.locals.requestId as string | undefined,
        method: request.method,
        path: request.originalUrl,
        host: request.get("host") ?? null,
        origin: request.get("origin") ?? null,
        referer: request.get("referer") ?? null
    };
}
