import type { ComponentType } from "react";

import {
    getListingDisplayDetails,
    getListingInquiryDefaultMessage,
    getListingInquiryLabel,
    getListingStatusLabel,
    listingStatusMeta
} from "../../modules/site-data/listing-helpers";
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
    return listingStatusMeta[status].badgeClassName;
}

export function getListingDisplayStatusLabel(status: Listing["status"]) {
    return getListingStatusLabel(status);
}

export { getListingDisplayDetails, getListingInquiryDefaultMessage, getListingInquiryLabel };
