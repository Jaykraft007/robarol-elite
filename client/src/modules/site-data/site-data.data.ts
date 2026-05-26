import type { CompanyProfile, NavigationLink } from "./site-data.types";

export const companyProfile: CompanyProfile = {
    name: "Robarol",
    shortName: "Robarol",
    tagline: "Yachts & Automobiles",
    description: "Yachts & automobiles, business development, finance & loans, and visa support for foreigners.",
    contactName: "Lats",
    email: "robarolsg@gmail.com",
    phone: "+65 8086 8730",
    whatsappNumber: "6580868730",
    websiteUrl: "https://www.robarol.com",
    websiteLabel: "www.robarol.com",
    instagramHandle: "@robarol.yachts.automobiles",
    instagramUrl: "https://www.instagram.com/robarol.yachts.automobiles?utm_source=qr&igsh=MTd5enpvNnR4NzZ2bg==",
    facebookUrl: "https://www.facebook.com/share/1GwiYxJVsW/"
};

export const navigationLinks: NavigationLink[] = [
    { label: "Home", to: "/" },
    { label: "Listings", to: "/inventory" },
    { label: "Services", to: "/services" },
    { label: "Finance", to: "/finance" },
    { label: "Contact", to: "/contact" }
];

export const assetLibraryImages = [
    "/assets/catalog-bmw-front.jpg",
    "/assets/catalog-bmw-side.jpg",
    "/assets/catalog-gtr-angle.jpg",
    "/assets/catalog-maserati-front.jpg",
    "/assets/catalog-mercedes-front.jpg",
    "/assets/catalog-mustang-front.jpg",
    "/assets/catalog-mustang-side.jpg",
    "/assets/hero-convertible.jpg"
] as const;
