import { useEffect, useMemo, useState } from "react";
import { NavLink, useSearchParams } from "react-router";

import { InquiryForm } from "../components/listings/inquiry-form";
import { ListingCard } from "../components/listings/listing-card";
import { ListingDetailsModal } from "../components/listings/listing-details-modal";
import { PageHero } from "../components/ui/page-hero";
import { SearchIcon } from "../components/ui/site-icon";
import { useSiteData } from "../modules/site-data/site-data.context";
import { formatListingPrice, getListingStatusLabel } from "../modules/site-data/listing-helpers";
import type { Listing, ListingCategory, ListingStatus } from "../modules/site-data/site-data.types";

export function InventoryPage() {
    const { categories, company, getListingsByCategory } = useSiteData();
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get("category");
    const defaultCategory = categories.some((item) => item.value === categoryParam)
        ? (categoryParam as "all" | ListingCategory)
        : "all";
    const [selectedCategory, setSelectedCategory] = useState<"all" | ListingCategory>(defaultCategory);
    const [selectedStatus, setSelectedStatus] = useState<"all" | ListingStatus>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeListing, setActiveListing] = useState<Listing | null>(null);
    const [inquiryListing, setInquiryListing] = useState<Listing | null>(null);

    useEffect(() => {
        const nextCategory = categories.some((item) => item.value === categoryParam)
            ? (categoryParam as "all" | ListingCategory)
            : "all";

        setSelectedCategory(nextCategory);
    }, [categories, categoryParam]);

    const categoryListings = useMemo(() => getListingsByCategory(selectedCategory), [getListingsByCategory, selectedCategory]);

    const listings = useMemo(() => {
        const categoryItems = categoryListings;
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const statusItems = selectedStatus === "all"
            ? categoryItems
            : categoryItems.filter((listing) => listing.status === selectedStatus);

        if (!normalizedSearch) {
            return statusItems;
        }

        return statusItems.filter((listing) =>
            [listing.title, listing.shortDescription, listing.category, formatListingPrice(listing), getListingStatusLabel(listing.status)]
                .join(" ")
                .toLowerCase()
                .includes(normalizedSearch)
        );
    }, [categoryListings, searchTerm, selectedStatus]);

    const featuredListings = useMemo(() => {
        const prioritized = listings.filter((listing) => listing.featured);
        const source = prioritized.length > 0 ? prioritized : listings;

        return source.slice(0, 3);
    }, [listings]);

    const compactListings = useMemo(() => {
        const featuredIds = new Set(featuredListings.map((listing) => listing.id));

        return listings.filter((listing) => !featuredIds.has(listing.id));
    }, [featuredListings, listings]);

    const openInquiry = (listing: Listing) => {
        setActiveListing(null);
        setInquiryListing(listing);
    };

    const handleCategoryChange = (category: "all" | ListingCategory) => {
        setSelectedCategory(category);

        if (category === "all") {
            setSearchParams({});
            return;
        }

        setSearchParams({ category });
    };

    return (
        <>
            <PageHero
                eyebrow="Our Inventory"
                title="Available listings"
                description="Browse selected cars, yachts and properties open for inquiry."
                actions={
                    <>
                        <a
                            href={company ? `https://wa.me/${company.whatsappNumber.replace(/[^\d]/g, "")}` : "#"}
                            className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(181,79,50,0.22)] transition duration-300 ease-out hover:brightness-[0.96]"
                        >
                            WhatsApp Us
                        </a>
                        <NavLink
                            to="/contact"
                            className="inline-flex items-center justify-center rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-slate-900 transition duration-300 ease-out hover:border-slate-950 hover:bg-stone-50"
                        >
                            Contact Desk
                        </NavLink>
                    </>
                }
            />

            <section className="pb-4 pt-2">
                <div className="mx-auto w-[min(1200px,calc(100%-1rem))] sm:w-[min(1200px,calc(100%-1.5rem))]">
                    <div className="sticky top-[4.65rem] z-20 rounded-[1.2rem] border border-stone-200 bg-white/94 p-2.5 shadow-[0_12px_26px_rgba(15,23,42,0.07)] backdrop-blur sm:top-[5.35rem] sm:rounded-[1.45rem] sm:p-3.5 sm:shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                        <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center xl:gap-4">
                            <label className="relative min-w-0 flex-1">
                                <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 sm:left-4" />
                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder="Search listings"
                                    className="h-10 w-full rounded-full border border-stone-200 bg-[#fbfaf7] pl-10 pr-4 text-[13px] text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:bg-white focus:ring-4 focus:ring-[#b54f32]/8 sm:h-11 sm:pl-11 sm:text-sm"
                                />
                            </label>

                            <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:flex-1 xl:pb-0">
                                {categories.map((category) => {
                                    const active = selectedCategory === category.value;

                                    return (
                                        <button
                                            key={category.value}
                                            type="button"
                                            onClick={() => handleCategoryChange(category.value)}
                                            className={[
                                                "shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition duration-300 ease-out sm:px-4 sm:py-2.5 sm:text-sm",
                                                active
                                                    ? "bg-[#b54f32] text-white shadow-[0_12px_26px_rgba(181,79,50,0.18)]"
                                                    : "border border-stone-300 bg-white text-slate-700 hover:border-[#d8b4a7] hover:bg-stone-50"
                                            ].join(" ")}
                                        >
                                            {category.label}
                                        </button>
                                    );
                                })}
                                <div className="flex gap-2 sm:hidden">
                                    {(["all", "available", "coming_soon", "sold"] as const).map((status) => {
                                        const active = selectedStatus === status;

                                        return (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => setSelectedStatus(status)}
                                                className={[
                                                    "shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition duration-300 ease-out",
                                                    active
                                                        ? "bg-slate-950 text-white shadow-[0_10px_20px_rgba(15,23,42,0.12)]"
                                                        : "border border-stone-300 bg-white text-slate-700 hover:bg-stone-50"
                                                ].join(" ")}
                                            >
                                                {status === "all" ? "All Status" : getListingStatusLabel(status)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="hidden items-center gap-2.5 sm:flex sm:justify-between xl:justify-end">
                                <select
                                    value={selectedStatus}
                                    onChange={(event) => setSelectedStatus(event.target.value as "all" | ListingStatus)}
                                    className="h-11 min-w-36 rounded-full border border-stone-200 bg-[#fbfaf7] px-4 text-sm text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:bg-white focus:ring-4 focus:ring-[#b54f32]/8"
                                >
                                    <option value="all">Status: All</option>
                                    <option value="available">Available</option>
                                    <option value="coming_soon">Coming Soon</option>
                                    <option value="sold">Sold</option>
                                </select>

                                <div className="shrink-0 rounded-full border border-stone-200 bg-[#fbfaf7] px-4 py-2.5 text-sm text-slate-600">
                                    <span className="font-semibold text-slate-950">{listings.length}</span> listings
                                </div>
                            </div>
                            <div className="shrink-0 rounded-full border border-stone-200 bg-[#fbfaf7] px-3.5 py-2 text-[13px] text-slate-600 sm:hidden">
                                <span className="font-semibold text-slate-950">{listings.length}</span> listings
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-9 pt-1 sm:pb-12">
                <div className="mx-auto w-[min(1200px,calc(100%-1rem))] sm:w-[min(1200px,calc(100%-1.5rem))]">
                    {listings.length > 0 ? (
                        <div className="space-y-3.5 sm:space-y-5">
                            <div className="grid gap-3.5 sm:gap-5 lg:grid-cols-3">
                                {featuredListings.map((listing) => (
                                    <ListingCard
                                        key={listing.id}
                                        listing={listing}
                                        onViewDetails={setActiveListing}
                                        onEnquire={openInquiry}
                                        variant="featured"
                                    />
                                ))}
                            </div>

                            {compactListings.length > 0 ? (
                                <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                    {compactListings.map((listing) => (
                                        <ListingCard
                                            key={listing.id}
                                            listing={listing}
                                            onViewDetails={setActiveListing}
                                            onEnquire={openInquiry}
                                            variant="compact"
                                        />
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="rounded-[1.55rem] border border-stone-200 bg-white p-6 text-center shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
                            <h2 className="font-display text-[1.9rem] text-slate-950">No listings in this view yet.</h2>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                Change category, status or search to continue browsing.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <section className="pb-8 sm:pb-10">
                <div className="mx-auto flex w-[min(1200px,calc(100%-1rem))] flex-col gap-3 rounded-[1.3rem] border border-stone-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.99),rgba(250,246,238,0.94))] px-4 py-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)] sm:w-[min(1200px,calc(100%-1.5rem))] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-[1.6rem] sm:px-6 sm:py-5 sm:shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                            Direct Inquiry
                        </p>
                        <h2 className="font-display mt-2 text-[1.45rem] leading-tight text-slate-950 sm:text-[2rem]">
                            Find the right asset and speak with us directly.
                        </h2>
                    </div>
                    <div className="flex flex-col gap-2.5 sm:flex-row">
                        <a
                            href={company ? `https://wa.me/${company.whatsappNumber.replace(/[^\d]/g, "")}` : "#"}
                            className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_12px_26px_rgba(181,79,50,0.18)] transition duration-300 ease-out hover:brightness-[0.96] sm:px-5 sm:py-3 sm:text-sm"
                        >
                            Send Inquiry
                        </a>
                        <NavLink
                            to="/contact"
                            className="inline-flex items-center justify-center rounded-full border border-stone-300 px-4 py-2.5 text-[13px] font-semibold text-slate-900 transition duration-300 ease-out hover:border-slate-950 hover:bg-stone-50 sm:px-5 sm:py-3 sm:text-sm"
                        >
                            Contact Desk
                        </NavLink>
                    </div>
                </div>
            </section>

            <ListingDetailsModal
                listing={activeListing}
                onClose={() => setActiveListing(null)}
                onEnquire={openInquiry}
            />

            {company ? (
                <InquiryForm
                    company={company}
                    listing={inquiryListing}
                    onClose={() => setInquiryListing(null)}
                />
            ) : null}
        </>
    );
}
