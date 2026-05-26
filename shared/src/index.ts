export type ListingCategory = "automobiles" | "yachts" | "properties";

export type ListingStatus = "available" | "coming_soon" | "sold" | "hidden";

export type ListingInquiryLabel = "Send Inquiry" | "Register Interest" | "Similar Inquiry";

export interface ListingSpecs {
    year?: string;
    mileage?: string;
    coeExpiryDate?: string;
    length?: string;
    engineHours?: string;
    cabins?: string;
    marina?: string;
    bedrooms?: string;
    bathrooms?: string;
    interiorSize?: string;
    parking?: string;
    view?: string;
    propertyType?: string;
}

export interface Listing {
    id: string;
    title: string;
    category: ListingCategory;
    status: ListingStatus;
    price: number;
    shortDescription: string;
    mainImage: string;
    galleryImages: string[];
    featured: boolean;
    showOnWebsite: boolean;
    inquiryLabel: ListingInquiryLabel;
    specs: ListingSpecs;
    createdAt: string;
    updatedAt: string;
}

export interface ListingDraft {
    title: string;
    category: ListingCategory;
    status: ListingStatus;
    price: number;
    shortDescription: string;
    mainImage: string;
    galleryImages: string[];
    featured: boolean;
    showOnWebsite: boolean;
    inquiryLabel: ListingInquiryLabel;
    specs: ListingSpecs;
}

export interface ListingUploadResponse {
    path: string;
    url: string;
}

export type InquiryStatus = "new" | "contacted" | "closed";

export interface Inquiry {
    id: string;
    listingId: string | null;
    listingTitle: string | null;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    message: string;
    source: "contact_page" | "listing_modal";
    status: InquiryStatus;
    createdAt: string;
    updatedAt: string;
}

export interface InquiryCreatePayload {
    listingId?: string | null;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    message: string;
    source: "contact_page" | "listing_modal";
}

export interface AdminSession {
    userId: string;
    email: string;
    role: "admin";
}
