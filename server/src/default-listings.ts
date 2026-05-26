import type { ListingDraft } from "@robarol/shared";

export const defaultListingCatalog: ListingDraft[] = [
    {
        title: "Mercedes-Maybach S680",
        category: "automobiles",
        status: "available",
        price: 238000,
        shortDescription: "Executive luxury sedan with premium comfort.",
        mainImage: "/assets/catalog-mercedes-front.jpg",
        galleryImages: [
            "/assets/catalog-mercedes-front.jpg",
            "/assets/hero-convertible.jpg"
        ],
        featured: true,
        showOnWebsite: true,
        inquiryLabel: "Send Inquiry",
        specs: {
            year: "2024",
            mileage: "3,300 km",
            coeExpiryDate: "2034-06-12"
        }
    },
    {
        title: "Range Rover SV LWB",
        category: "automobiles",
        status: "available",
        price: 186000,
        shortDescription: "High-luxury performance SUV.",
        mainImage: "/assets/catalog-maserati-front.jpg",
        galleryImages: [
            "/assets/catalog-maserati-front.jpg",
            "/assets/catalog-mustang-side.jpg"
        ],
        featured: true,
        showOnWebsite: true,
        inquiryLabel: "Send Inquiry",
        specs: {
            year: "2024",
            mileage: "7,800 km",
            coeExpiryDate: "2035-02-28"
        }
    },
    {
        title: "Sunseeker Predator 60",
        category: "yachts",
        status: "available",
        price: 1420000,
        shortDescription: "Sport yacht with open-deck appeal.",
        mainImage: "/assets/catalog-gtr-angle.jpg",
        galleryImages: [
            "/assets/catalog-gtr-angle.jpg",
            "/assets/catalog-mustang-front.jpg"
        ],
        featured: false,
        showOnWebsite: true,
        inquiryLabel: "Send Inquiry",
        specs: {
            year: "2023",
            length: "60 ft",
            engineHours: "220 hrs",
            cabins: "3",
            marina: "Marina Collection"
        }
    },
    {
        title: "Princess F55 Flybridge",
        category: "yachts",
        status: "coming_soon",
        price: 1080000,
        shortDescription: "Modern flybridge yacht with refined leisure space.",
        mainImage: "/assets/catalog-mustang-front.jpg",
        galleryImages: [
            "/assets/catalog-mustang-front.jpg",
            "/assets/catalog-gtr-angle.jpg"
        ],
        featured: false,
        showOnWebsite: true,
        inquiryLabel: "Register Interest",
        specs: {
            year: "2022",
            length: "55 ft",
            engineHours: "340 hrs",
            cabins: "3",
            marina: "Private Marina"
        }
    },
    {
        title: "Banana Island Waterfront Villa",
        category: "properties",
        status: "available",
        price: 3900000,
        shortDescription: "Contemporary waterfront residence.",
        mainImage: "/assets/catalog-bmw-front.jpg",
        galleryImages: [
            "/assets/catalog-bmw-front.jpg",
            "/assets/catalog-bmw-side.jpg"
        ],
        featured: true,
        showOnWebsite: true,
        inquiryLabel: "Send Inquiry",
        specs: {
            bedrooms: "6",
            bathrooms: "7",
            interiorSize: "940 sqm",
            parking: "5 cars",
            view: "Waterfront",
            propertyType: "Detached Villa"
        }
    },
    {
        title: "Eko Atlantic Sky Penthouse",
        category: "properties",
        status: "sold",
        price: 2250000,
        shortDescription: "Ocean-facing penthouse listing.",
        mainImage: "/assets/catalog-bmw-side.jpg",
        galleryImages: [
            "/assets/catalog-bmw-side.jpg",
            "/assets/catalog-bmw-front.jpg"
        ],
        featured: false,
        showOnWebsite: true,
        inquiryLabel: "Similar Inquiry",
        specs: {
            bedrooms: "4",
            bathrooms: "5",
            interiorSize: "520 sqm",
            parking: "3 cars",
            view: "Oceanfront",
            propertyType: "Penthouse"
        }
    }
];
