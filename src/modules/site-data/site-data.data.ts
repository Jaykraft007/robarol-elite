import { getDefaultInquiryLabel } from "./listing-helpers";
import type { CompanyProfile, Listing, NavigationLink } from "./site-data.types";

export const companyProfile: CompanyProfile = {
    name: "Robarol",
    shortName: "Robarol",
    tagline: "Yachts, Automobiles, Finance & Foreigner Support",
    description: "Robarol supports yacht and automobile clients with direct sourcing, loan guidance, visa support, PR applications and business setup help for foreigners.",
    contactName: "Lats",
    email: "robarolsg@gmail.com",
    phone: "+65 8086 8730",
    whatsappNumber: "6580868730",
    websiteUrl: "https://www.robarol.com",
    websiteLabel: "www.robarol.com",
    instagramHandle: "@robarol.yachts.automobiles",
    instagramUrl: "https://www.instagram.com/robarol.yachts.automobiles/",
    facebookUrl: "https://www.facebook.com/share/1GwiYxJVsW/"
};

export const navigationLinks: NavigationLink[] = [
    { label: "Home", to: "/" },
    { label: "Inventory", to: "/inventory" },
    { label: "Services", to: "/services" },
    { label: "Finance", to: "/finance" },
    { label: "About", to: "/about" }
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

export const defaultListingCatalog: Listing[] = [
    {
        id: "maybach-s680",
        title: "Mercedes-Maybach S680",
        category: "automobiles",
        status: "available",
        price: 238000,
        currency: "USD",
        location: "Lagos, Nigeria",
        shortDescription: "Executive luxury sedan with premium comfort.",
        mainImage: "/assets/catalog-mercedes-front.jpg",
        galleryImages: [
            "/assets/catalog-mercedes-front.jpg",
            "/assets/hero-convertible.jpg"
        ],
        featured: true,
        showOnWebsite: true,
        inquiryLabel: getDefaultInquiryLabel("available"),
        specs: {
            year: "2024",
            mileage: "3,300 km",
            transmission: "Automatic",
            fuelType: "Petrol Hybrid",
            condition: "Foreign used",
            bodyType: "Luxury Sedan"
        },
        createdAt: "2026-05-10T09:30:00.000Z",
        updatedAt: "2026-05-20T08:15:00.000Z"
    },
    {
        id: "range-rover-sv",
        title: "Range Rover SV LWB",
        category: "automobiles",
        status: "available",
        price: 186000,
        currency: "USD",
        location: "Abuja, Nigeria",
        shortDescription: "High-luxury performance SUV.",
        mainImage: "/assets/catalog-maserati-front.jpg",
        galleryImages: [
            "/assets/catalog-maserati-front.jpg",
            "/assets/catalog-mustang-side.jpg"
        ],
        featured: true,
        showOnWebsite: true,
        inquiryLabel: getDefaultInquiryLabel("available"),
        specs: {
            year: "2024",
            mileage: "7,800 km",
            transmission: "Automatic",
            fuelType: "Petrol",
            condition: "Foreign used",
            bodyType: "SUV"
        },
        createdAt: "2026-05-10T10:10:00.000Z",
        updatedAt: "2026-05-18T14:05:00.000Z"
    },
    {
        id: "sunseeker-predator-60",
        title: "Sunseeker Predator 60",
        category: "yachts",
        status: "available",
        price: 1420000,
        currency: "USD",
        location: "Lagos, Nigeria",
        shortDescription: "Sport yacht with open-deck appeal.",
        mainImage: "/assets/catalog-gtr-angle.jpg",
        galleryImages: [
            "/assets/catalog-gtr-angle.jpg",
            "/assets/catalog-mustang-front.jpg"
        ],
        featured: false,
        showOnWebsite: true,
        inquiryLabel: getDefaultInquiryLabel("available"),
        specs: {
            year: "2023",
            length: "60 ft",
            engineHours: "220 hrs",
            fuelType: "Twin Diesel",
            cabins: "3",
            marina: "Marina Collection"
        },
        createdAt: "2026-05-11T08:45:00.000Z",
        updatedAt: "2026-05-19T11:40:00.000Z"
    },
    {
        id: "princess-f55",
        title: "Princess F55 Flybridge",
        category: "yachts",
        status: "coming_soon",
        price: 1080000,
        currency: "USD",
        location: "Lekki, Nigeria",
        shortDescription: "Modern flybridge yacht with refined leisure space.",
        mainImage: "/assets/catalog-mustang-front.jpg",
        galleryImages: [
            "/assets/catalog-mustang-front.jpg",
            "/assets/catalog-gtr-angle.jpg"
        ],
        featured: false,
        showOnWebsite: true,
        inquiryLabel: getDefaultInquiryLabel("coming_soon"),
        specs: {
            year: "2022",
            length: "55 ft",
            engineHours: "340 hrs",
            fuelType: "Twin Diesel",
            cabins: "3",
            marina: "Private Marina"
        },
        createdAt: "2026-05-12T12:20:00.000Z",
        updatedAt: "2026-05-17T13:30:00.000Z"
    },
    {
        id: "banana-island-villa",
        title: "Banana Island Waterfront Villa",
        category: "properties",
        status: "available",
        price: 3900000,
        currency: "USD",
        location: "Banana Island, Lagos",
        shortDescription: "Contemporary waterfront residence.",
        mainImage: "/assets/catalog-bmw-front.jpg",
        galleryImages: [
            "/assets/catalog-bmw-front.jpg",
            "/assets/catalog-bmw-side.jpg"
        ],
        featured: true,
        showOnWebsite: true,
        inquiryLabel: getDefaultInquiryLabel("available"),
        specs: {
            bedrooms: "6",
            bathrooms: "7",
            interiorSize: "940 sqm",
            parking: "5 cars",
            view: "Waterfront",
            propertyType: "Detached Villa"
        },
        createdAt: "2026-05-13T09:55:00.000Z",
        updatedAt: "2026-05-20T07:50:00.000Z"
    },
    {
        id: "eko-atlantic-penthouse",
        title: "Eko Atlantic Sky Penthouse",
        category: "properties",
        status: "sold",
        price: 2250000,
        currency: "USD",
        location: "Eko Atlantic, Lagos",
        shortDescription: "Ocean-facing penthouse listing.",
        mainImage: "/assets/catalog-bmw-side.jpg",
        galleryImages: [
            "/assets/catalog-bmw-side.jpg",
            "/assets/catalog-bmw-front.jpg"
        ],
        featured: false,
        showOnWebsite: true,
        inquiryLabel: getDefaultInquiryLabel("sold"),
        specs: {
            bedrooms: "4",
            bathrooms: "5",
            interiorSize: "520 sqm",
            parking: "3 cars",
            view: "Oceanfront",
            propertyType: "Penthouse"
        },
        createdAt: "2026-05-14T15:05:00.000Z",
        updatedAt: "2026-05-16T17:25:00.000Z"
    }
];
