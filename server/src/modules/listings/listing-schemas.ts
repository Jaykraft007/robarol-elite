import { z } from "zod";

const listingCategories = ["automobiles", "yachts", "properties"] as const;
const listingStatuses = ["available", "coming_soon", "sold", "hidden"] as const;
const inquiryLabels = ["Send Inquiry", "Register Interest", "Similar Inquiry"] as const;

export const listingSpecsSchema = z.object({
    year: z.string().trim().optional(),
    mileage: z.string().trim().optional(),
    coeExpiryDate: z.string().trim().optional(),
    length: z.string().trim().optional(),
    engineHours: z.string().trim().optional(),
    cabins: z.string().trim().optional(),
    marina: z.string().trim().optional(),
    bedrooms: z.string().trim().optional(),
    bathrooms: z.string().trim().optional(),
    interiorSize: z.string().trim().optional(),
    parking: z.string().trim().optional(),
    view: z.string().trim().optional(),
    propertyType: z.string().trim().optional()
});

export const listingDraftSchema = z.object({
    title: z.string().trim().min(1),
    category: z.enum(listingCategories),
    status: z.enum(listingStatuses),
    price: z.number().finite().nonnegative(),
    shortDescription: z.string().trim().min(1),
    mainImage: z.string().trim().min(1),
    galleryImages: z.array(z.string().trim().min(1)),
    featured: z.boolean(),
    showOnWebsite: z.boolean(),
    inquiryLabel: z.enum(inquiryLabels),
    specs: listingSpecsSchema
});

export const listingPatchSchema = listingDraftSchema.partial().refine(
    (value) => Object.keys(value).length > 0,
    "At least one field is required."
);
