import type { Listing } from "@robarol/shared";

export type {
    AdminSession,
    Inquiry,
    InquiryCreatePayload,
    InquiryStatus,
    Listing,
    ListingCategory,
    ListingDraft,
    ListingInquiryLabel,
    ListingSpecs,
    ListingStatus,
    ListingUploadResponse
} from "@robarol/shared";

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

export interface SiteDataSnapshot {
    company: CompanyProfile;
    navigation: NavigationLink[];
    listings: Listing[];
}
