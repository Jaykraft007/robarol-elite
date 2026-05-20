export type ListingCategory = "automobiles" | "yachts" | "properties";

export type ListingStatus = "Available" | "Sold" | "Coming Soon";

export interface CompanyProfile {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    email: string;
    phone: string;
    whatsappNumber: string;
}

export interface NavigationLink {
    label: string;
    to: string;
}

export interface ListingDetail {
    label: string;
    value: string;
}

export interface Listing {
    id: string;
    name: string;
    category: ListingCategory;
    price: string;
    image: string;
    imagePosition?: string;
    location: string;
    status: ListingStatus;
    summary: string;
    description: string;
    details: ListingDetail[];
    features: string[];
    featured?: boolean;
}

export interface SiteDataSnapshot {
    company: CompanyProfile;
    navigation: NavigationLink[];
    listings: Listing[];
}
