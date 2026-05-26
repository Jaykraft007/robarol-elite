import type { NextFunction, Request, Response } from "express";

import { AppError } from "../lib/app-error.js";
import { getRequestContext, logError, logWarn } from "../lib/logger.js";

export function errorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
    const context = getRequestContext(_request, response);
    const requestId = response.locals.requestId as string | undefined;

    if (error instanceof AppError) {
        logWarn("Handled application error", {
            ...context,
            statusCode: error.statusCode,
            message: error.message,
            details: error.details ?? null
        });

        response.status(error.statusCode).json({
            message: error.message,
            details: error.details ?? null,
            requestId: requestId ?? null
        });
        return;
    }

    logError("Unhandled server error", {
        ...context,
        error
    });

    response.status(500).json({
        message: "Internal server error.",
        requestId: requestId ?? null
    });
}
