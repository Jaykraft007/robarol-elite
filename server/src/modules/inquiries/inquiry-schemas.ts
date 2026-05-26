import { z } from "zod";

export const inquiryCreateSchema = z.object({
    listingId: z.string().uuid().nullable().optional(),
    fullName: z.string().trim().min(1),
    email: z.string().trim().email(),
    phone: z.string().trim().min(1),
    location: z.string().trim().min(1),
    message: z.string().trim().min(1),
    source: z.enum(["contact_page", "listing_modal"])
});

export const inquiryStatusSchema = z.object({
    status: z.enum(["new", "contacted", "closed"])
});
