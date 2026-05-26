import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { AppError } from "../../lib/app-error.js";
import { getRequestContext, logInfo } from "../../lib/logger.js";
import { requireAdmin } from "../../middleware/auth.js";
import { createListing, deleteListing, getAdminListings, getPublicListingById, getPublicListings, updateListing } from "./listing-service.js";
import { listingDraftSchema, listingPatchSchema } from "./listing-schemas.js";

export const listingRouter = Router();
export const adminListingRouter = Router();

listingRouter.get("/", asyncHandler(async (_request, response) => {
    response.json(await getPublicListings());
}));

listingRouter.get("/:listingId", asyncHandler(async (request, response) => {
    const listingId = request.params.listingId;

    if (!listingId || Array.isArray(listingId)) {
        throw new AppError(400, "Listing id is required.");
    }

    const listing = await getPublicListingById(listingId);

    if (!listing) {
        throw new AppError(404, "Listing not found.");
    }

    response.json(listing);
}));

adminListingRouter.use(asyncHandler(async (request, response, next) => {
    await requireAdmin(request, response);
    next();
}));

adminListingRouter.get("/", asyncHandler(async (request, response) => {
    const listings = await getAdminListings();

    logInfo("Admin listings fetched", {
        ...getRequestContext(request, response),
        count: listings.length,
        userId: request.adminSession?.userId ?? null
    });

    response.json(listings);
}));

adminListingRouter.post("/", asyncHandler(async (request, response) => {
    const payload = listingDraftSchema.parse(request.body);
    const listing = await createListing(payload);

    logInfo("Listing created", {
        ...getRequestContext(request, response),
        listingId: listing.id,
        title: listing.title,
        category: listing.category,
        userId: request.adminSession?.userId ?? null
    });

    response.status(201).json(listing);
}));

adminListingRouter.patch("/:listingId", asyncHandler(async (request, response) => {
    const listingId = request.params.listingId;

    if (!listingId || Array.isArray(listingId)) {
        throw new AppError(400, "Listing id is required.");
    }

    const payload = listingPatchSchema.parse(request.body);
    const listing = await updateListing(listingId, payload);

    logInfo("Listing updated", {
        ...getRequestContext(request, response),
        listingId: listing.id,
        title: listing.title,
        userId: request.adminSession?.userId ?? null
    });

    response.json(listing);
}));

adminListingRouter.delete("/:listingId", asyncHandler(async (request, response) => {
    const listingId = request.params.listingId;

    if (!listingId || Array.isArray(listingId)) {
        throw new AppError(400, "Listing id is required.");
    }

    await deleteListing(listingId);

    logInfo("Listing deleted", {
        ...getRequestContext(request, response),
        listingId,
        userId: request.adminSession?.userId ?? null
    });

    response.status(204).send();
}));
