import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { AppError } from "../../lib/app-error.js";
import { requireAdmin } from "../../middleware/auth.js";
import { createInquiry, getAdminInquiries, updateInquiryStatus } from "./inquiry-service.js";
import { inquiryCreateSchema, inquiryStatusSchema } from "./inquiry-schemas.js";

export const inquiryRouter = Router();
export const adminInquiryRouter = Router();

inquiryRouter.post("/", asyncHandler(async (request, response) => {
    const payload = inquiryCreateSchema.parse(request.body);
    const inquiry = await createInquiry(payload);

    response.status(201).json(inquiry);
}));

adminInquiryRouter.use(asyncHandler(async (request, response, next) => {
    await requireAdmin(request, response);
    next();
}));

adminInquiryRouter.get("/", asyncHandler(async (_request, response) => {
    response.json(await getAdminInquiries());
}));

adminInquiryRouter.patch("/:inquiryId", asyncHandler(async (request, response) => {
    const inquiryId = request.params.inquiryId;

    if (!inquiryId || Array.isArray(inquiryId)) {
        throw new AppError(400, "Inquiry id is required.");
    }

    const payload = inquiryStatusSchema.parse(request.body);
    const inquiry = await updateInquiryStatus(inquiryId, payload.status);

    response.json(inquiry);
}));
