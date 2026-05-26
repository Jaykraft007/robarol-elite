export type ListingCategory = "automobiles" | "yachts" | "properties";

export type ListingStatus = "available" | "coming_soon" | "sold" | "hidden";

export type ListingInquiryLabel = "Send Inquiry" | "Register Interest" | "Similar Inquiry";

export interface CompanyProfile {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    contactName: string;
    email: string;
    phone: string;
    whatsappNumber: string;
    websiteUrl: string;
    websiteLabel: string;
    instagramHandle: string;
    instagramUrl: string;
    facebookUrl: string;
}

export interface NavigationLink {
    label: string;
    to: string;
}

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

export interface SiteDataSnapshot {
    company: CompanyProfile;
    navigation: NavigationLink[];
    listings: Listing[];
}
