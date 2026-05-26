import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren
} from "react";

import { assetLibraryImages, companyProfile, navigationLinks } from "./site-data.data";
import { isPublicListing, listingCategoryOptions, sortListingsForPublic } from "./listing-helpers";
import {
    createInquiryRecord,
    createListingRecord,
    deleteListingRecord,
    fetchAdminListings,
    fetchInquiryRecords,
    fetchPublicSiteData,
    updateInquiryRecordStatus,
    updateListingRecord,
    updateListingRecordStatus
} from "./site-data.service";
import { ApiError } from "../core/api-client";
import type {
    CompanyProfile,
    Inquiry,
    InquiryCreatePayload,
    InquiryStatus,
    Listing,
    ListingCategory,
    ListingDraft,
    NavigationLink
} from "./site-data.types";

type ListingFilter = "all" | ListingCategory;
type SiteDataScope = "public" | "admin";

interface SiteDataContextValue {
    company: CompanyProfile | null;
    navigation: NavigationLink[];
    listings: Listing[];
    allListings: Listing[];
    featuredListings: Listing[];
    inquiries: Inquiry[];
    isLoading: boolean;
    isInquiriesLoading: boolean;
    loadError: string | null;
    categories: Array<{ label: string; value: ListingFilter }>;
    getListingsByCategory: (category: ListingFilter) => Listing[];
    getAllListingsByCategory: (category: ListingFilter) => Listing[];
    getListingById: (listingId: string) => Listing | null;
    createListing: (draft: ListingDraft) => Promise<Listing>;
    updateListing: (listingId: string, draft: Partial<ListingDraft>) => Promise<Listing | null>;
    deleteListing: (listingId: string) => Promise<void>;
    updateListingStatus: (listingId: string, status: Listing["status"]) => Promise<Listing | null>;
    createInquiry: (payload: InquiryCreatePayload) => Promise<Inquiry>;
    loadAdminInquiries: () => Promise<void>;
    updateInquiryStatus: (inquiryId: string, status: InquiryStatus) => Promise<Inquiry | null>;
    assetImages: string[];
}

const categories: Array<{ label: string; value: ListingFilter }> = [
    { label: "All", value: "all" },
    ...listingCategoryOptions
];

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

function replaceListing(listings: Listing[], nextListing: Listing) {
    return listings.map((listing) => (listing.id === nextListing.id ? nextListing : listing));
}

export function SiteDataProvider({
    children,
    scope = "public"
}: PropsWithChildren<{ scope?: SiteDataScope }>) {
    const [company, setCompany] = useState<CompanyProfile | null>(companyProfile);
    const [navigation, setNavigation] = useState<NavigationLink[]>(navigationLinks);
    const [allListings, setAllListings] = useState<Listing[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInquiriesLoading, setIsInquiriesLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        const load = async () => {
            if (isActive) {
                setIsLoading(true);
                setLoadError(null);
            }

            try {
                if (scope === "admin") {
                    setCompany(companyProfile);
                    setNavigation(navigationLinks);
                    const listings = await fetchAdminListings();

                    if (isActive) {
                        setAllListings(listings);
                    }
                } else {
                    const data = await fetchPublicSiteData();

                    if (isActive) {
                        setCompany(data.company);
                        setNavigation(data.navigation);
                        setAllListings(data.listings);
                    }
                }
            } catch (error) {
                console.error(error);

                if (isActive) {
                    if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 403)) {
                        setLoadError("Admin session could not be verified. Sign in again with an active admin account.");
                    } else if (error instanceof ApiError) {
                        setLoadError(error.message);
                    } else {
                        setLoadError("Unable to load data right now.");
                    }
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        void load();

        return () => {
            isActive = false;
        };
    }, [scope]);

    const listings = useMemo(
        () => sortListingsForPublic(allListings.filter((listing) => isPublicListing(listing))),
        [allListings]
    );
    const featuredListings = useMemo(
        () => listings.filter((listing) => listing.featured),
        [listings]
    );

    const loadAdminInquiries = useCallback(async () => {
        setIsInquiriesLoading(true);

        try {
            const nextInquiries = await fetchInquiryRecords();

            setInquiries(nextInquiries);
        } finally {
            setIsInquiriesLoading(false);
        }
    }, []);

    const value: SiteDataContextValue = {
        company,
        navigation: navigation.length > 0 ? navigation : navigationLinks,
        listings,
        allListings,
        inquiries,
        featuredListings,
        isLoading,
        isInquiriesLoading,
        loadError,
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
        getListingById: (listingId) => allListings.find((item) => item.id === listingId) ?? null,
        createListing: async (draft) => {
            const listing = await createListingRecord(draft);

            setAllListings((current) => [listing, ...current]);

            return listing;
        },
        updateListing: async (listingId, draft) => {
            const listing = await updateListingRecord(listingId, draft);

            setAllListings((current) => replaceListing(current, listing));

            return listing;
        },
        deleteListing: async (listingId) => {
            await deleteListingRecord(listingId);
            setAllListings((current) => current.filter((listing) => listing.id !== listingId));
        },
        updateListingStatus: async (listingId, status) => {
            const listing = await updateListingRecordStatus(listingId, status);

            setAllListings((current) => replaceListing(current, listing));

            return listing;
        },
        createInquiry: async (payload) => createInquiryRecord(payload),
        loadAdminInquiries,
        updateInquiryStatus: async (inquiryId, status) => {
            const inquiry = await updateInquiryRecordStatus(inquiryId, status);

            setInquiries((current) => current.map((item) => (item.id === inquiry.id ? inquiry : item)));

            return inquiry;
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
