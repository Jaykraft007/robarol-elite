import type {
    Listing,
    ListingCategory,
    ListingCurrency,
    ListingInquiryLabel,
    ListingSpecs,
    ListingStatus
} from "./site-data.types";

export const listingCategoryOptions: Array<{ label: string; value: ListingCategory }> = [
    { label: "Automobiles", value: "automobiles" },
    { label: "Yachts", value: "yachts" },
    { label: "Properties", value: "properties" }
];

export const listingStatusOptions: Array<{ label: string; value: ListingStatus }> = [
    { label: "Available", value: "available" },
    { label: "Coming Soon", value: "coming_soon" },
    { label: "Sold", value: "sold" },
    { label: "Hidden", value: "hidden" }
];

export const listingCurrencyOptions: Array<{ label: string; value: ListingCurrency }> = [
    { label: "USD", value: "USD" },
    { label: "SGD", value: "SGD" },
    { label: "GBP", value: "GBP" },
    { label: "NGN", value: "NGN" }
];

export const inquiryLabelOptions: Array<{ label: string; value: ListingInquiryLabel }> = [
    { label: "Send Inquiry", value: "Send Inquiry" },
    { label: "Register Interest", value: "Register Interest" },
    { label: "Similar Inquiry", value: "Similar Inquiry" }
];

export const listingStatusMeta: Record<ListingStatus, { label: string; badgeClassName: string }> = {
    available: {
        label: "Available",
        badgeClassName: "border-emerald-200/90 bg-emerald-50 text-emerald-700"
    },
    coming_soon: {
        label: "Coming Soon",
        badgeClassName: "border-amber-200/90 bg-amber-50 text-amber-700"
    },
    sold: {
        label: "Sold",
        badgeClassName: "border-stone-300 bg-stone-100 text-stone-700"
    },
    hidden: {
        label: "Hidden",
        badgeClassName: "border-stone-200 bg-stone-50 text-stone-500"
    }
};

const currencyFormatters: Record<ListingCurrency, Intl.NumberFormat> = {
    USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
    SGD: new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD", maximumFractionDigits: 0 }),
    GBP: new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }),
    NGN: new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 })
};

const specOrder: Record<ListingCategory, Array<{ key: keyof ListingSpecs; label: string }>> = {
    automobiles: [
        { key: "year", label: "Year" },
        { key: "mileage", label: "Mileage" },
        { key: "transmission", label: "Transmission" },
        { key: "fuelType", label: "Fuel" },
        { key: "condition", label: "Condition" },
        { key: "bodyType", label: "Body Type" }
    ],
    yachts: [
        { key: "year", label: "Year" },
        { key: "length", label: "Length" },
        { key: "engineHours", label: "Engine Hours" },
        { key: "fuelType", label: "Fuel" },
        { key: "cabins", label: "Cabins" },
        { key: "marina", label: "Marina" }
    ],
    properties: [
        { key: "bedrooms", label: "Bedrooms" },
        { key: "bathrooms", label: "Bathrooms" },
        { key: "interiorSize", label: "Interior Size" },
        { key: "parking", label: "Parking" },
        { key: "view", label: "View" },
        { key: "propertyType", label: "Property Type" }
    ]
};

export function getListingStatusLabel(status: ListingStatus) {
    return listingStatusMeta[status].label;
}

export function getDefaultInquiryLabel(status: ListingStatus): ListingInquiryLabel {
    switch (status) {
        case "coming_soon":
            return "Register Interest";
        case "sold":
            return "Similar Inquiry";
        default:
            return "Send Inquiry";
    }
}

export function formatListingPrice(listing: Pick<Listing, "price" | "currency">) {
    return currencyFormatters[listing.currency].format(listing.price);
}

export function getListingDisplayDetails(listing: Pick<Listing, "category" | "specs">) {
    return specOrder[listing.category]
        .map((item) => {
            const value = listing.specs[item.key];

            if (!value) {
                return null;
            }

            return {
                label: item.label,
                value
            };
        })
        .filter((item): item is { label: string; value: string } => item !== null);
}

export function getListingInquiryLabel(listing: Pick<Listing, "inquiryLabel" | "status">) {
    return listing.inquiryLabel || getDefaultInquiryLabel(listing.status);
}

export function getListingInquiryDefaultMessage(listing: Pick<Listing, "title" | "price" | "currency" | "location" | "status" | "inquiryLabel">) {
    const intentLine = (() => {
        switch (listing.inquiryLabel || getDefaultInquiryLabel(listing.status)) {
            case "Register Interest":
                return `I would like to register interest in the ${listing.title}.`;
            case "Similar Inquiry":
                return `I am interested in listings similar to the ${listing.title}.`;
            default:
                return `I am interested in the ${listing.title}.`;
        }
    })();

    return [
        "Hello Robarol,",
        `${intentLine} It is listed at ${formatListingPrice(listing)} in ${listing.location}.`,
        "",
        "Please send me more details."
    ].join("\n");
}

export function buildInquiryTemplatePreview(listing: Pick<Listing, "title" | "price" | "currency" | "location" | "status" | "inquiryLabel">) {
    return [
        "Hello Robarol,",
        `${getTemplateIntentLine(listing)} It is listed at ${formatListingPrice(listing)} in ${listing.location}.`,
        "",
        "Name: [Customer Name]",
        "Phone: [Customer Phone]",
        "",
        "Please send me more details."
    ].join("\n");
}

function getTemplateIntentLine(listing: Pick<Listing, "title" | "status" | "inquiryLabel">) {
    switch (listing.inquiryLabel || getDefaultInquiryLabel(listing.status)) {
        case "Register Interest":
            return `I would like to register interest in the ${listing.title}.`;
        case "Similar Inquiry":
            return `I am interested in listings similar to the ${listing.title}.`;
        default:
            return `I am interested in the ${listing.title}.`;
    }
}

export function isPublicListing(listing: Pick<Listing, "showOnWebsite" | "status">) {
    return listing.showOnWebsite && listing.status !== "hidden";
}

export function sortListingsForPublic(listings: Listing[]) {
    return [...listings].sort((left, right) => {
        if (left.featured !== right.featured) {
            return left.featured ? -1 : 1;
        }

        return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    });
}

export function formatAdminUpdatedAt(value: string) {
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(new Date(value));
}
