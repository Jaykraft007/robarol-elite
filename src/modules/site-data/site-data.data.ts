import type { CompanyProfile, Listing, NavigationLink } from "./site-data.types";

export const companyProfile: CompanyProfile = {
    name: "Robarol Elite",
    shortName: "Robarol Elite",
    tagline: "Automobiles, Yachts, Properties",
    description: "Robarol Elite presents selected automobiles, yachts and properties for direct private inquiry.",
    email: "info@robarol.com",
    phone: "+00 123 456 789",
    whatsappNumber: "00123456789"
};

export const navigationLinks: NavigationLink[] = [
    { label: "Home", to: "/" },
    { label: "Listings", to: "/inventory" },
    { label: "About", to: "/about" }
];

export const listingCatalog: Listing[] = [
    {
        id: "maybach-s680",
        name: "Mercedes-Maybach S680",
        category: "automobiles",
        price: "$238,000",
        image: "/assets/hero-marina.png",
        imagePosition: "28% center",
        location: "Lagos",
        status: "Available",
        summary: "Executive luxury sedan with premium comfort.",
        description: "Long-wheelbase presence, refined cabin detailing and quiet performance built for premium arrival.",
        details: [
            { label: "Year", value: "2024" },
            { label: "Mileage", value: "3,300 km" },
            { label: "Transmission", value: "Automatic" },
            { label: "Fuel", value: "Petrol Hybrid" }
        ],
        features: [
            "Rear executive seating",
            "Premium cabin finish",
            "Verified availability"
        ],
        featured: true
    },
    {
        id: "range-rover-sv",
        name: "Range Rover SV LWB",
        category: "automobiles",
        price: "$186,000",
        image: "/assets/luxury-auto.png",
        imagePosition: "center",
        location: "Abuja",
        status: "Available",
        summary: "High-luxury performance SUV.",
        description: "A statement SUV with strong road presence, premium cabin comfort and versatile executive appeal.",
        details: [
            { label: "Year", value: "2024" },
            { label: "Mileage", value: "7,800 km" },
            { label: "Transmission", value: "Automatic" },
            { label: "Fuel", value: "Petrol" }
        ],
        features: [
            "Extended wheelbase",
            "Panoramic roof",
            "Black exterior package"
        ],
        featured: true
    },
    {
        id: "sunseeker-predator-60",
        name: "Sunseeker Predator 60",
        category: "yachts",
        price: "$1,420,000",
        image: "/assets/luxury-yacht.png",
        imagePosition: "center",
        location: "Marina Collection",
        status: "Available",
        summary: "Sport yacht with open-deck appeal.",
        description: "A sleek private yacht with refined lounges, marina presence and clean entertaining spaces.",
        details: [
            { label: "Year", value: "2023" },
            { label: "Length", value: "60 ft" },
            { label: "Engine Hours", value: "220 hrs" },
            { label: "Fuel", value: "Twin Diesel" }
        ],
        features: [
            "Open aft deck",
            "Three-cabin layout",
            "Available for direct viewing"
        ]
    },
    {
        id: "princess-f55",
        name: "Princess F55 Flybridge",
        category: "yachts",
        price: "$1,080,000",
        image: "/assets/hero-marina.png",
        imagePosition: "76% center",
        location: "Private Marina",
        status: "Coming Soon",
        summary: "Modern flybridge yacht with refined leisure space.",
        description: "Spacious exterior decks, premium finishes and an elegant profile for buyers registering early interest.",
        details: [
            { label: "Year", value: "2022" },
            { label: "Length", value: "55 ft" },
            { label: "Engine Hours", value: "340 hrs" },
            { label: "Fuel", value: "Twin Diesel" }
        ],
        features: [
            "Flybridge lounge",
            "Full-beam owner cabin",
            "Pre-arrival reservation open"
        ]
    },
    {
        id: "banana-island-villa",
        name: "Banana Island Waterfront Villa",
        category: "properties",
        price: "$3,900,000",
        image: "/assets/luxury-property.png",
        imagePosition: "center",
        location: "Banana Island",
        status: "Available",
        summary: "Contemporary waterfront residence.",
        description: "A contemporary private residence with waterfront appeal, generous interiors and a premium address.",
        details: [
            { label: "Bedrooms", value: "6" },
            { label: "Bathrooms", value: "7" },
            { label: "Interior", value: "940 sqm" },
            { label: "Parking", value: "5 cars" }
        ],
        features: [
            "Waterfront setting",
            "Double-height living area",
            "Private inquiry only"
        ],
        featured: true
    },
    {
        id: "eko-atlantic-penthouse",
        name: "Eko Atlantic Sky Penthouse",
        category: "properties",
        price: "$2,250,000",
        image: "/assets/luxury-property.png",
        imagePosition: "76% center",
        location: "Eko Atlantic",
        status: "Sold",
        summary: "Ocean-facing penthouse listing.",
        description: "Oceanfront penthouse with skyline exposure, private terrace and strong city presence.",
        details: [
            { label: "Bedrooms", value: "4" },
            { label: "Bathrooms", value: "5" },
            { label: "Interior", value: "520 sqm" },
            { label: "View", value: "Oceanfront" }
        ],
        features: [
            "Private lift access",
            "Wraparound terrace",
            "Recently closed listing"
        ]
    }
];
