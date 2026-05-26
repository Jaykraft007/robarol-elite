import { randomUUID } from "node:crypto";
import { extname } from "node:path";

import { Router } from "express";
import multer from "multer";

import { asyncHandler } from "../../lib/async-handler.js";
import { AppError } from "../../lib/app-error.js";
import { getRequestContext, logInfo } from "../../lib/logger.js";
import { requireAdmin } from "../../middleware/auth.js";
import { supabaseServiceClient } from "../../lib/supabase.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 8 * 1024 * 1024
    }
});

function getFileExtension(mimeType: string, originalName: string) {
    if (mimeType === "image/webp") {
        return ".webp";
    }

    const extension = extname(originalName).toLowerCase();

    return extension || ".jpg";
}

export const uploadRouter = Router();

uploadRouter.use(asyncHandler(async (request, response, next) => {
    await requireAdmin(request, response);
    next();
}));

uploadRouter.post(
    "/",
    upload.single("file"),
    asyncHandler(async (request, response) => {
        if (!request.file) {
            throw new AppError(400, "Image file is required.");
        }

        if (!request.file.mimetype.startsWith("image/")) {
            throw new AppError(400, "Only image uploads are allowed.");
        }

        const extension = getFileExtension(request.file.mimetype, request.file.originalname);
        const filePath = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}${extension}`;

        const { error } = await supabaseServiceClient.storage
            .from("listing-images")
            .upload(filePath, request.file.buffer, {
                contentType: request.file.mimetype,
                upsert: false
            });

        if (error) {
            throw new AppError(500, "Unable to upload image.", error.message);
        }

        const { data } = supabaseServiceClient.storage.from("listing-images").getPublicUrl(filePath);

        logInfo("Listing image uploaded", {
            ...getRequestContext(request, response),
            userId: request.adminSession?.userId ?? null,
            filePath,
            mimeType: request.file.mimetype,
            fileSize: request.file.size
        });

        response.status(201).json({
            path: filePath,
            url: data.publicUrl
        });
    })
);
