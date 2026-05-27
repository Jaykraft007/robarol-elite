import { useEffect, useMemo, useState } from "react";
import { NavLink, useSearchParams } from "react-router";

import { InquiryForm } from "../components/listings/inquiry-form";
import { ListingCard } from "../components/listings/listing-card";
import { ListingDetailsModal } from "../components/listings/listing-details-modal";
import {
    getListingDisplayDetails,
    getListingDisplayStatusLabel,
    getListingInquiryLabel,
    getListingStatusClassName,
    listingCategoryMeta
} from "../components/listings/listing-meta";
import { ArrowUpRightIcon, SearchIcon } from "../components/ui/site-icon";
import { useSiteData } from "../modules/site-data/site-data.context";
import { formatListingPrice } from "../modules/site-data/listing-helpers";
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
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const statusItems = selectedStatus === "all"
            ? categoryListings
            : categoryListings.filter((listing) => listing.status === selectedStatus);

        if (!normalizedSearch) {
            return statusItems;
        }

        return statusItems.filter((listing) =>
            [listing.title, listing.shortDescription, listing.category, formatListingPrice(listing), getListingDisplayStatusLabel(listing.status)]
                .join(" ")
                .toLowerCase()
                .includes(normalizedSearch)
        );
    }, [categoryListings, searchTerm, selectedStatus]);

    const featuredListing = useMemo(() => {
        const prioritized = listings.filter((listing) => listing.featured);
        return prioritized[0] ?? listings[0] ?? null;
    }, [listings]);

    const remainingListings = useMemo(() => {
        if (!featuredListing) {
            return [];
        }

        return listings.filter((listing) => listing.id !== featuredListing.id);
    }, [featuredListing, listings]);

    const featuredCategoryMeta = featuredListing ? listingCategoryMeta[featuredListing.category] : null;
    const featuredDetailItems = featuredListing ? getListingDisplayDetails(featuredListing).slice(0, 3) : [];
    const featuredInquiryLabel = featuredListing ? getListingInquiryLabel(featuredListing) : "Send Inquiry";

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
            <section className="pt-2.5 sm:pt-4">
                <div className="mx-auto w-[min(1120px,calc(100%-1rem))] sm:w-[min(1120px,calc(100%-1.5rem))]">
                    <div className="max-w-[46rem]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                            Listings
                        </p>
                        <h1 className="font-hero-display mt-2 text-[1.28rem] leading-[1.16] text-slate-950 sm:text-[1.6rem] lg:text-[1.95rem]">
                            Browse verified automobiles, yachts and properties available for direct inquiry.
                        </h1>
                    </div>
                </div>
            </section>

            <section className="pb-4 pt-3 sm:pb-5">
                <div className="mx-auto w-[min(1120px,calc(100%-1rem))] sm:w-[min(1120px,calc(100%-1.5rem))]">
                    <div className="sticky top-[4.65rem] z-20 rounded-[1.25rem] border border-stone-200/80 bg-white/94 px-3 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.06)] backdrop-blur sm:top-[5.35rem] sm:rounded-[1.5rem] sm:px-4 sm:py-4">
                        <div className="grid gap-3 xl:grid-cols-[minmax(0,18rem)_1fr_auto] xl:items-center xl:gap-4">
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

                            <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:justify-center xl:pb-0">
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
                                                    ? "bg-[#b54f32] text-white shadow-[0_12px_22px_rgba(181,79,50,0.16)]"
                                                    : "border border-stone-300 bg-white text-slate-700 hover:border-[#d8b4a7] hover:bg-stone-50"
                                            ].join(" ")}
                                        >
                                            {category.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex items-center gap-2.5 xl:justify-end">
                                <select
                                    value={selectedStatus}
                                    onChange={(event) => setSelectedStatus(event.target.value as "all" | ListingStatus)}
                                    className="h-10 min-w-0 flex-1 rounded-full border border-stone-200 bg-[#fbfaf7] px-4 text-[13px] text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:bg-white focus:ring-4 focus:ring-[#b54f32]/8 sm:h-11 sm:min-w-40 sm:flex-none sm:text-sm"
                                >
                                    <option value="all">Status: All</option>
                                    <option value="available">Available</option>
                                    <option value="coming_soon">Coming Soon</option>
                                    <option value="sold">Sold</option>
                                </select>

                                <div className="shrink-0 rounded-full border border-stone-200 bg-[#fbfaf7] px-3.5 py-2 text-[13px] text-slate-600 sm:px-4 sm:py-2.5 sm:text-sm">
                                    <span className="font-semibold text-slate-950">{listings.length}</span> listings
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-8 pt-1 sm:pb-10">
                <div className="mx-auto w-[min(1120px,calc(100%-1rem))] sm:w-[min(1120px,calc(100%-1.5rem))]">
                    {listings.length > 0 ? (
                        <div className="space-y-6 sm:space-y-8">
                            {featuredListing && featuredCategoryMeta ? (
                                <div>
                                    <div className="mb-4 flex items-end justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                                                Featured Listing
                                            </p>
                                            <h2 className="font-hero-display mt-1 text-[1.35rem] leading-tight text-slate-950 sm:text-[1.7rem]">
                                                Selected for your current view.
                                            </h2>
                                        </div>
                                        <span className="hidden rounded-full border border-stone-200 bg-white/84 px-3.5 py-2 text-sm text-slate-600 sm:inline-flex">
                                            Curated highlight
                                        </span>
                                    </div>

                                    <article className="group overflow-hidden rounded-[1.65rem] border border-stone-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(251,248,243,0.96))] shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(15,23,42,0.1)]">
                                        <div className="grid lg:grid-cols-[1.06fr_0.94fr]">
                                            <div className="relative overflow-hidden">
                                                <img
                                                    src={featuredListing.mainImage}
                                                    alt={featuredListing.title}
                                                    className="h-[16.5rem] w-full object-cover object-center transition duration-700 ease-out group-hover:scale-[1.035] sm:h-[20rem] lg:h-full"
                                                    loading="lazy"
                                                />
                                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/18 via-slate-950/5 to-transparent" />
                                                <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2.5">
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/88 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
                                                        <featuredCategoryMeta.Icon className="h-3.5 w-3.5" />
                                                        {featuredCategoryMeta.label}
                                                    </span>
                                                    <span
                                                        className={[
                                                            "inline-flex rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-[0_8px_18px_rgba(15,23,42,0.06)]",
                                                            getListingStatusClassName(featuredListing.status)
                                                        ].join(" ")}
                                                    >
                                                        {getListingDisplayStatusLabel(featuredListing.status)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col p-4 sm:p-5 lg:p-6">
                                                <h3 className="font-hero-display text-[1.3rem] leading-[1.04] text-slate-950 sm:text-[1.7rem]">
                                                    {featuredListing.title}
                                                </h3>

                                                <div className="mt-4 flex items-end justify-between gap-3 border-y border-stone-200/80 py-3.5">
                                                    <div>
                                                        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                                            Asking Price
                                                        </span>
                                                        <strong className="font-hero-display mt-1 block text-[1.45rem] leading-none text-[#b54f32] sm:text-[1.9rem]">
                                                            {formatListingPrice(featuredListing)}
                                                        </strong>
                                                    </div>
                                                    <span className="rounded-full border border-stone-200 bg-white/84 px-3 py-1.5 text-[11px] font-medium text-slate-600">
                                                        {featuredListing.status === "available" ? "Direct inquiry" : getListingDisplayStatusLabel(featuredListing.status)}
                                                    </span>
                                                </div>

                                                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-[0.98rem] sm:leading-7">
                                                    {featuredListing.shortDescription}
                                                </p>

                                                <div className="mt-4 flex flex-wrap gap-2.5">
                                                    {featuredDetailItems.map((detail) => (
                                                        <div
                                                            key={`${featuredListing.id}-${detail.label}`}
                                                            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-stone-50/85 px-3 py-1.5 text-[11px] text-slate-700 sm:text-[12px]"
                                                        >
                                                            <span className="font-medium text-stone-400">{detail.label}</span>
                                                            <span className="font-semibold text-slate-800">{detail.value}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-auto flex flex-col gap-2.5 pt-5 sm:flex-row">
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveListing(featuredListing)}
                                                        className="group/details inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-stone-900 hover:bg-stone-50"
                                                    >
                                                        Details
                                                        <ArrowUpRightIcon className="h-4 w-4 transition duration-300 group-hover/details:-translate-y-0.5 group-hover/details:translate-x-0.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openInquiry(featuredListing)}
                                                        className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-5 py-3 text-sm font-semibold !text-white shadow-[0_12px_28px_rgba(181,79,50,0.18)] transition duration-300 ease-out hover:-translate-y-0.5 hover:brightness-[0.97] hover:!text-white"
                                                    >
                                                        {featuredInquiryLabel}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            ) : null}

                            {remainingListings.length > 0 ? (
                                <div>
                                    <div className="mb-4 flex items-end justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                                                Inventory
                                            </p>
                                            <h2 className="font-hero-display mt-1 text-[1.35rem] leading-tight text-slate-950 sm:text-[1.7rem]">
                                                Available inventory
                                            </h2>
                                        </div>
                                        <span className="hidden rounded-full border border-stone-200 bg-white/84 px-3.5 py-2 text-sm text-slate-600 sm:inline-flex">
                                            {remainingListings.length} listings
                                        </span>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        {remainingListings.map((listing) => (
                                            <ListingCard
                                                key={listing.id}
                                                listing={listing}
                                                onViewDetails={setActiveListing}
                                                onEnquire={openInquiry}
                                                variant="compact"
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="rounded-[1.45rem] border border-stone-200 bg-white/92 p-5 text-center shadow-[0_14px_32px_rgba(15,23,42,0.06)] sm:p-7">
                            <h2 className="font-hero-display text-[1.55rem] leading-tight text-slate-950 sm:text-[1.9rem]">
                                No listings in this view yet.
                            </h2>
                            <p className="mt-2.5 text-sm leading-6 text-slate-600">
                                Change category, status or search to continue browsing.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <section className="pb-6 sm:pb-8">
                <div className="mx-auto w-[min(1120px,calc(100%-1rem))] sm:w-[min(1120px,calc(100%-1.5rem))]">
                    <div className="flex flex-col gap-3.5 rounded-[1.35rem] border border-stone-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.99),rgba(250,246,238,0.95))] px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-4">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                                Inquiry Desk
                            </p>
                            <h2 className="font-hero-display mt-1 text-[1.2rem] leading-tight text-slate-950 sm:text-[1.45rem]">
                                Need help finding the right listing?
                            </h2>
                        </div>
                        <div className="flex flex-col gap-2.5 sm:flex-row">
                            <NavLink
                                to="/contact"
                                className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white/84 px-4 py-2.5 text-[13px] font-semibold text-slate-900 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-950 hover:bg-stone-50 sm:px-5 sm:py-3 sm:text-sm"
                            >
                                Contact Desk
                            </NavLink>
                            <a
                                href={company ? `https://wa.me/${company.whatsappNumber.replace(/[^\d]/g, "")}` : "#"}
                                className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-4 py-2.5 text-[13px] font-semibold !text-white shadow-[0_12px_26px_rgba(181,79,50,0.18)] transition duration-300 ease-out hover:-translate-y-0.5 hover:brightness-[0.97] hover:!text-white sm:px-5 sm:py-3 sm:text-sm"
                            >
                                Send Inquiry
                            </a>
                        </div>
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
