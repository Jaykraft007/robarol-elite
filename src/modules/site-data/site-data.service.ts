import { defaultListingCatalog, companyProfile, navigationLinks } from "./site-data.data";
import { sortListingsForPublic } from "./listing-helpers";
import type { Listing, ListingCategory, ListingDraft, ListingSpecs, ListingStatus, SiteDataSnapshot } from "./site-data.types";

const LISTING_STORAGE_KEY = "robarol:listings";

function cloneListing(listing: Listing): Listing {
    return {
        ...listing,
        galleryImages: [...listing.galleryImages],
        specs: { ...listing.specs }
    };
}

function cloneListings(listings: Listing[]) {
    return listings.map(cloneListing);
}

function canUseStorage() {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function seedDefaultListings() {
    return cloneListings(defaultListingCatalog);
}

function persistListings(listings: Listing[]) {
    if (!canUseStorage()) {
        return;
    }

    window.localStorage.setItem(LISTING_STORAGE_KEY, JSON.stringify(listings));
}

function parseStoredListings(rawValue: string | null) {
    if (!rawValue) {
        return null;
    }

    try {
        const parsed = JSON.parse(rawValue);

        if (!Array.isArray(parsed)) {
            return null;
        }

        const validListings = parsed
            .map((item) => normalizeStoredListing(item))
            .filter((item): item is Listing => item !== null);

        return validListings.length === parsed.length ? validListings.map(cloneListing) : null;
    } catch {
        return null;
    }
}

function generateListingId(title: string) {
    const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 48);
    const suffix = Math.random().toString(36).slice(2, 7);

    return `${slug || "listing"}-${suffix}`;
}

export function loadListingCatalog() {
    if (!canUseStorage()) {
        return seedDefaultListings();
    }

    const existing = parseStoredListings(window.localStorage.getItem(LISTING_STORAGE_KEY));

    if (existing) {
        return existing;
    }

    const seededListings = seedDefaultListings();
    persistListings(seededListings);

    return seededListings;
}

export function fetchSiteData(): Promise<SiteDataSnapshot> {
    return Promise.resolve({
        company: companyProfile,
        navigation: navigationLinks,
        listings: loadListingCatalog()
    });
}

export function createListingRecord(draft: ListingDraft) {
    const now = new Date().toISOString();
    const listing: Listing = {
        ...draft,
        id: generateListingId(draft.title),
        galleryImages: [...draft.galleryImages],
        specs: { ...draft.specs },
        createdAt: now,
        updatedAt: now
    };
    const nextListings = [listing, ...loadListingCatalog()];

    persistListings(nextListings);

    return cloneListing(listing);
}

export function updateListingRecord(listingId: string, draft: ListingDraft) {
    let updatedListing: Listing | null = null;
    const nextListings = loadListingCatalog().map((listing) => {
        if (listing.id !== listingId) {
            return listing;
        }

        updatedListing = {
            ...listing,
            ...draft,
            galleryImages: [...draft.galleryImages],
            specs: { ...draft.specs },
            updatedAt: new Date().toISOString()
        };

        return updatedListing;
    });

    persistListings(nextListings);

    return updatedListing ? cloneListing(updatedListing) : null;
}

export function deleteListingRecord(listingId: string) {
    const nextListings = loadListingCatalog().filter((listing) => listing.id !== listingId);

    persistListings(nextListings);

    return nextListings.length;
}

export function updateListingRecordStatus(listingId: string, status: ListingStatus) {
    let updatedListing: Listing | null = null;
    const nextListings = loadListingCatalog().map((listing) => {
        if (listing.id !== listingId) {
            return listing;
        }

        updatedListing = {
            ...listing,
            status,
            updatedAt: new Date().toISOString()
        };

        return updatedListing;
    });

    persistListings(nextListings);

    return updatedListing ? cloneListing(updatedListing) : null;
}

export function getListingRecordById(listingId: string) {
    const listing = loadListingCatalog().find((item) => item.id === listingId);

    return listing ? cloneListing(listing) : null;
}

export function getPublicListingCatalog() {
    return sortListingsForPublic(loadListingCatalog().filter((listing) => listing.showOnWebsite && listing.status !== "hidden"));
}

function normalizeStoredListing(item: unknown): Listing | null {
    if (!item || typeof item !== "object") {
        return null;
    }

    const record = item as Record<string, unknown>;

    if (
        typeof record.id !== "string"
        || typeof record.title !== "string"
        || typeof record.category !== "string"
        || typeof record.status !== "string"
        || typeof record.price !== "number"
        || typeof record.shortDescription !== "string"
        || typeof record.mainImage !== "string"
        || !Array.isArray(record.galleryImages)
        || typeof record.featured !== "boolean"
        || typeof record.showOnWebsite !== "boolean"
        || typeof record.inquiryLabel !== "string"
        || !record.specs
        || typeof record.specs !== "object"
        || typeof record.createdAt !== "string"
        || typeof record.updatedAt !== "string"
    ) {
        return null;
    }

    const category = record.category as ListingCategory;

    return {
        id: record.id,
        title: record.title,
        category,
        status: record.status as ListingStatus,
        price: record.price,
        shortDescription: record.shortDescription,
        mainImage: record.mainImage,
        galleryImages: record.galleryImages.filter((image): image is string => typeof image === "string"),
        featured: record.featured,
        showOnWebsite: record.showOnWebsite,
        inquiryLabel: record.inquiryLabel as Listing["inquiryLabel"],
        specs: sanitizeListingSpecs(category, record.specs as ListingSpecs),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
    };
}

function sanitizeListingSpecs(category: ListingCategory, specs: ListingSpecs) {
    const allowedKeysByCategory: Record<ListingCategory, Array<keyof ListingSpecs>> = {
        automobiles: ["year", "mileage", "coeExpiryDate"],
        yachts: ["year", "length", "engineHours", "cabins", "marina"],
        properties: ["bedrooms", "bathrooms", "interiorSize", "parking", "view", "propertyType"]
    };

    return Object.fromEntries(
        allowedKeysByCategory[category]
            .map((key) => [key, specs[key]])
            .filter(([, value]) => typeof value === "string" && value.trim().length > 0)
    ) as ListingSpecs;
}
