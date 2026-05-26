import { randomUUID } from "node:crypto";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { logInfo } from "./lib/logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { authRouter } from "./modules/auth/auth-routes.js";
import { adminInquiryRouter, inquiryRouter } from "./modules/inquiries/inquiry-routes.js";
import { adminListingRouter, listingRouter } from "./modules/listings/listing-routes.js";
import { uploadRouter } from "./modules/uploads/upload-routes.js";

export function createApp() {
    const app = express();

    app.use((request, response, next) => {
        const requestId = randomUUID().slice(0, 8);
        const startedAt = Date.now();

        response.locals.requestId = requestId;
        response.setHeader("x-request-id", requestId);

        response.on("finish", () => {
            logInfo("HTTP request completed", {
                requestId,
                method: request.method,
                path: request.originalUrl,
                statusCode: response.statusCode,
                durationMs: Date.now() - startedAt,
                host: request.get("host") ?? null,
                origin: request.get("origin") ?? null,
                referer: request.get("referer") ?? null,
                cookieHeaderPresent: Boolean(request.headers.cookie)
            });
        });

        next();
    });

    app.use(cors({
        origin: env.APP_ORIGIN,
        credentials: true
    }));
    app.use(cookieParser());
    app.use(express.json({ limit: "1mb" }));

    app.get("/health", (_request, response) => {
        response.json({ ok: true });
    });

    app.use("/api/auth", authRouter);
    app.use("/api/listings", listingRouter);
    app.use("/api/inquiries", inquiryRouter);
    app.use("/api/admin/listings", adminListingRouter);
    app.use("/api/admin/inquiries", adminInquiryRouter);
    app.use("/api/admin/uploads", uploadRouter);

    app.use(errorHandler);

    return app;
}
