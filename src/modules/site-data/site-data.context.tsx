import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";

import { fetchSiteData } from "./site-data.service";
import type { Listing, ListingCategory, SiteDataSnapshot } from "./site-data.types";

type ListingFilter = "all" | ListingCategory;

interface SiteDataContextValue {
    company: SiteDataSnapshot["company"] | null;
    navigation: SiteDataSnapshot["navigation"];
    listings: Listing[];
    featuredListings: Listing[];
    isLoading: boolean;
    categories: Array<{ label: string; value: ListingFilter }>;
    getListingsByCategory: (category: ListingFilter) => Listing[];
}

const categories: Array<{ label: string; value: ListingFilter }> = [
    { label: "All", value: "all" },
    { label: "Automobiles", value: "automobiles" },
    { label: "Yachts", value: "yachts" },
    { label: "Properties", value: "properties" }
];

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function SiteDataProvider({ children }: PropsWithChildren) {
    const [siteData, setSiteData] = useState<SiteDataSnapshot | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isActive = true;

        fetchSiteData()
            .then((data) => {
                if (isActive) {
                    setSiteData(data);
                    setIsLoading(false);
                }
            })
            .catch(() => {
                if (isActive) {
                    setIsLoading(false);
                }
            });

        return () => {
            isActive = false;
        };
    }, []);

    const listings = siteData?.listings ?? [];
    const featuredListings = listings.filter((listing) => listing.featured);

    const value: SiteDataContextValue = {
        company: siteData?.company ?? null,
        navigation: siteData?.navigation ?? [],
        listings,
        featuredListings,
        isLoading,
        categories,
        getListingsByCategory: (category) => {
            if (category === "all") {
                return listings;
            }

            return listings.filter((listing) => listing.category === category);
        }
    };

    return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
    const context = useContext(SiteDataContext);

    if (!context) {
        throw new Error("useSiteData must be used within SiteDataProvider.");
    }

    return context;
}
