import type { ComponentType } from "react";

import type { Listing, ListingCategory } from "../../modules/site-data/site-data.types";
import { CarIcon, PropertyIcon, YachtIcon } from "../ui/site-icon";

interface ListingCategoryMeta {
    label: string;
    Icon: ComponentType<{ className?: string }>;
}

export const listingCategoryMeta: Record<ListingCategory, ListingCategoryMeta> = {
    automobiles: {
        label: "Automobiles",
        Icon: CarIcon
    },
    yachts: {
        label: "Yachts",
        Icon: YachtIcon
    },
    properties: {
        label: "Properties",
        Icon: PropertyIcon
    }
};

export function getListingStatusClassName(status: Listing["status"]) {
    switch (status) {
        case "Available":
            return "border-emerald-200/90 bg-white/90 text-emerald-700 shadow-[0_8px_22px_rgba(16,185,129,0.12)]";
        case "Sold":
            return "border-stone-300 bg-white/90 text-stone-700 shadow-[0_8px_22px_rgba(15,23,42,0.08)]";
        case "Coming Soon":
            return "border-amber-200/90 bg-white/90 text-amber-700 shadow-[0_8px_22px_rgba(245,158,11,0.12)]";
        default:
            return "border-stone-200 bg-stone-100 text-stone-600";
    }
}

export function getListingInquiryLabel(status: Listing["status"]) {
    switch (status) {
        case "Coming Soon":
            return "Register Interest";
        case "Sold":
            return "Similar Inquiry";
        default:
            return "Send Inquiry";
    }
}

export function getListingInquiryDefaultMessage(listing: Listing) {
    switch (listing.status) {
        case "Coming Soon":
            return `Hello, I would like to register interest in ${listing.name}. Please send me more details.`;
        case "Sold":
            return `Hello, I am interested in similar listings to ${listing.name}. Please send me more details.`;
        default:
            return "Hello, I am interested in this listing. Please send me more details.";
    }
}
