import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { assetLibraryImages } from "./site-data.data";
import { isPublicListing, sortListingsForPublic } from "./listing-helpers";
import {
    createListingRecord,
    deleteListingRecord,
    fetchSiteData,
    getListingRecordById,
    loadListingCatalog,
    updateListingRecord,
    updateListingRecordStatus
} from "./site-data.service";
import type { Listing, ListingCategory, ListingDraft, SiteDataSnapshot } from "./site-data.types";

type ListingFilter = "all" | ListingCategory;

interface SiteDataContextValue {
    company: SiteDataSnapshot["company"] | null;
    navigation: SiteDataSnapshot["navigation"];
    listings: Listing[];
    allListings: Listing[];
    featuredListings: Listing[];
    isLoading: boolean;
    categories: Array<{ label: string; value: ListingFilter }>;
    getListingsByCategory: (category: ListingFilter) => Listing[];
    getAllListingsByCategory: (category: ListingFilter) => Listing[];
    getListingById: (listingId: string) => Listing | null;
    createListing: (draft: ListingDraft) => Listing;
    updateListing: (listingId: string, draft: ListingDraft) => Listing | null;
    deleteListing: (listingId: string) => void;
    updateListingStatus: (listingId: string, status: Listing["status"]) => Listing | null;
    assetImages: string[];
}

const categories: Array<{ label: string; value: ListingFilter }> = [
    { label: "All", value: "all" },
    { label: "Automobiles", value: "automobiles" },
    { label: "Yachts", value: "yachts" }
];

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function SiteDataProvider({ children }: PropsWithChildren) {
    const [company, setCompany] = useState<SiteDataSnapshot["company"] | null>(null);
    const [navigation, setNavigation] = useState<SiteDataSnapshot["navigation"]>([]);
    const [allListings, setAllListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isActive = true;

        fetchSiteData()
            .then((data) => {
                if (isActive) {
                    setCompany(data.company);
                    setNavigation(data.navigation);
                    setAllListings(data.listings);
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

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key && event.key !== "robarol:listings") {
                return;
            }

            setAllListings(loadListingCatalog());
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const listings = useMemo(
        () => sortListingsForPublic(allListings.filter((listing) => isPublicListing(listing))),
        [allListings]
    );
    const featuredListings = useMemo(
        () => listings.filter((listing) => listing.featured),
        [listings]
    );

    const value: SiteDataContextValue = {
        company,
        navigation,
        listings,
        allListings,
        featuredListings,
        isLoading,
        categories,
        getListingsByCategory: (category) => {
            if (category === "all") {
                return listings;
            }

            return listings.filter((listing) => listing.category === category);
        },
        getAllListingsByCategory: (category) => {
            if (category === "all") {
                return allListings;
            }

            return allListings.filter((listing) => listing.category === category);
        },
        getListingById: (listingId) => getListingRecordById(listingId),
        createListing: (draft) => {
            const listing = createListingRecord(draft);

            setAllListings(loadListingCatalog());

            return listing;
        },
        updateListing: (listingId, draft) => {
            const listing = updateListingRecord(listingId, draft);

            setAllListings(loadListingCatalog());

            return listing;
        },
        deleteListing: (listingId) => {
            deleteListingRecord(listingId);
            setAllListings(loadListingCatalog());
        },
        updateListingStatus: (listingId, status) => {
            const listing = updateListingRecordStatus(listingId, status);

            setAllListings(loadListingCatalog());

            return listing;
        },
        assetImages: [...assetLibraryImages]
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
