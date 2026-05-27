import { useState } from "react";
import { NavLink } from "react-router";

import { InquiryForm } from "../components/listings/inquiry-form";
import { ListingCard } from "../components/listings/listing-card";
import { ListingDetailsModal } from "../components/listings/listing-details-modal";
import { SectionHeading } from "../components/ui/section-heading";
import { ArrowUpRightIcon, CarIcon, CheckIcon, PropertyIcon, YachtIcon } from "../components/ui/site-icon";
import { useSiteData } from "../modules/site-data/site-data.context";
import type { Listing, ListingCategory } from "../modules/site-data/site-data.types";

export function HomePage() {
    const { company, featuredListings, getListingsByCategory, isLoading } = useSiteData();
    const [activeCategory, setActiveCategory] = useState<"all" | ListingCategory>("all");
    const [activeListing, setActiveListing] = useState<Listing | null>(null);
    const [inquiryListing, setInquiryListing] = useState<Listing | null>(null);

    if (!company) {
        return null;
    }

    const categoryCards = [
        {
            category: "automobiles" as const,
            label: "Automobiles",
            description: "Selected luxury cars and SUVs.",
            image: "/assets/catalog-mercedes-front.jpg",
            imagePosition: "object-[58%_center]",
            desktopClass: "lg:flex-[1.14] lg:h-[34rem]",
            Icon: CarIcon
        },
        {
            category: "yachts" as const,
            label: "Yachts",
            description: "Private yachts and marine listings.",
            image: "/assets/category-yacht-premium.png",
            imagePosition: "object-[52%_center]",
            desktopClass: "lg:flex-[0.9] lg:h-[30rem]",
            Icon: YachtIcon
        },
        {
            category: "properties" as const,
            label: "Properties",
            description: "Premium homes and investment properties.",
            image: "/assets/category-property-premium.png",
            imagePosition: "object-[54%_center]",
            desktopClass: "lg:flex-[1.02] lg:h-[32rem]",
            Icon: PropertyIcon
        }
    ];

    const visibleListings = (activeCategory === "all"
        ? featuredListings
        : featuredListings.filter((listing) => listing.category === activeCategory)).slice(0, 6);

    const openInquiry = (listing: Listing) => {
        setActiveListing(null);
        setInquiryListing(listing);
    };

    return (
        <>
            <section className="font-ui-body pb-9 pt-3 sm:pb-12 sm:pt-6 lg:pb-14">
                <div className="mx-auto w-[min(1240px,calc(100%-1rem))] sm:w-[min(1240px,calc(100%-1.5rem))]">
                    <div className="relative min-h-[68svh] overflow-hidden rounded-[1.9rem] border border-stone-200/80 bg-[linear-gradient(135deg,#fbf7f1_0%,#f6efe5_100%)] px-4 pb-5 pt-8 shadow-[0_20px_54px_rgba(15,23,42,0.05)] sm:min-h-[38rem] sm:rounded-[2.35rem] sm:px-7 sm:pb-7 sm:pt-9 md:min-h-[40rem] lg:min-h-[82vh] lg:px-8 lg:py-10 xl:min-h-[86vh]">
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[43%] overflow-hidden lg:hidden">
                            <img
                                src="/assets/hero-lifestyle-marketplace-mobile.png"
                                alt="Premium waterfront home, yacht, and premium vehicle"
                                className="h-full w-full object-cover object-[58%_76%]"
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,247,241,1)_0%,rgba(251,247,241,0.9)_16%,rgba(251,247,241,0.46)_42%,rgba(251,247,241,0.1)_70%,rgba(251,247,241,0)_100%)]" />
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,247,241,0.26)_0%,rgba(251,247,241,0.1)_28%,rgba(251,247,241,0)_48%,rgba(251,247,241,0)_100%)]" />
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_74%_94%,rgba(15,23,42,0.16),transparent_21%)]" />
                        </div>

                        <div className="absolute inset-0 lg:hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,244,0.06)_0%,rgba(255,250,244,0)_36%,rgba(255,250,244,0.08)_100%)]" />
                        </div>

                        <div className="absolute inset-y-0 right-0 hidden w-[66%] lg:block">
                            <img
                                src="/assets/hero-lifestyle-marketplace.png"
                                alt="Premium waterfront home, yacht, and premium vehicle"
                                className="h-full w-full object-cover object-[68%_center]"
                            />
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_90%,rgba(15,23,42,0.12),transparent_22%)]" />
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,247,241,1)_0%,rgba(251,247,241,0.97)_14%,rgba(251,247,241,0.82)_28%,rgba(251,247,241,0.46)_41%,rgba(251,247,241,0.1)_54%,rgba(251,247,241,0)_63%)]" />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,249,242,0.1)_0%,rgba(255,249,242,0)_26%,rgba(255,249,242,0.14)_100%)]" />
                        </div>

                        <div className="relative z-10 flex w-full max-w-[35rem] flex-col items-center pr-2 pb-[10.5rem] pt-10 text-center sm:pr-4 sm:pb-[12rem] sm:pt-0 lg:min-h-[74vh] lg:items-start lg:pb-0 lg:pr-0 lg:text-left">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#ab6b54] sm:text-[11px]">
                                DIRECT SOURCING & SUPPORT
                            </p>
                            <h1 className="font-hero-display mt-4 max-w-[12ch] text-[2.2rem] leading-[0.98] text-slate-950 sm:mt-5 sm:text-[3.45rem] lg:text-[4.4rem]">
                                Robarol Yachts & Automobiles.
                            </h1>
                            
                            <div className="mt-4 flex max-w-[34rem] flex-wrap justify-center gap-1 lg:justify-start">
                                {[
                                    "Yachts & automobiles",
                                    "Finance & Loans",
                                    "Business Consulting",
                                    "Visa, EP & PR support"
                                ].map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-stone-200/80 bg-white/72 px-3 py-1.5 text-[12px] font-medium text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.035)]"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-4 max-w-[34rem] text-[15px] leading-7 text-slate-600 sm:mt-5 sm:text-[1.02rem] sm:leading-8">
                                Browse verified listings with clear pricing, key details and direct inquiry.
                            </p>

                            <div className="mt-7 w-full sm:w-auto">
                                <NavLink
                                    to="/inventory"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#b54f32] px-6 py-4 text-sm font-semibold !text-white shadow-[0_14px_30px_rgba(181,79,50,0.2)] transition duration-300 ease-out hover:-translate-y-0.5 hover:brightness-[0.98] hover:!text-white visited:!text-white sm:w-auto sm:px-7"
                                >
                                    View Listings
                                    <ArrowUpRightIcon className="h-4 w-4" />
                                </NavLink>
                                <div className="mt-4 flex items-center justify-center gap-2.5 text-sm text-slate-600 lg:justify-start">
                                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white/88 text-[#b54f32] shadow-[0_6px_14px_rgba(15,23,42,0.04)]">
                                        <CheckIcon className="h-3.5 w-3.5" />
                                    </span>
                                    <span>Inquire directly with our experts</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="font-ui-body pb-12 pt-2 sm:pb-16 lg:pb-20">
                <div className="mx-auto w-[min(1240px,calc(100%-1rem))] sm:w-[min(1240px,calc(100%-1.5rem))]">
                    <div className="max-w-[42rem]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ab6b54]">
                            BROWSE
                        </p>
                        <h2 className="font-hero-display mt-3 text-[1.92rem] leading-[0.98] text-slate-950 sm:text-[2.7rem] lg:text-[3.15rem]">
                            Browse by category.
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-[0.98rem]">
                            Choose what you are interested in and view available listings.
                        </p>
                    </div>

                    <div className="mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-8 sm:gap-4 lg:mt-10 lg:items-end lg:gap-5 lg:overflow-visible lg:pb-0 xl:gap-6">
                        {categoryCards.map((item) => (
                            <NavLink
                                key={item.category}
                                to={`/inventory?category=${item.category}`}
                                className={[
                                    "group relative isolate min-w-[84vw] snap-start overflow-hidden rounded-[1.55rem] border border-stone-200/80 bg-white shadow-[0_14px_32px_rgba(15,23,42,0.06)] transition duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(15,23,42,0.1)] sm:min-w-[67vw] sm:rounded-[1.75rem]",
                                    "lg:min-w-0 lg:self-end lg:rounded-[1.9rem]",
                                    item.desktopClass
                                ].join(" ")}
                            >
                                <img
                                    src={item.image}
                                    alt={item.label}
                                    className={[
                                        "h-[22rem] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04] sm:h-[26rem] lg:h-full",
                                        item.imagePosition
                                    ].join(" ")}
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.03)_18%,rgba(15,23,42,0.2)_52%,rgba(15,23,42,0.84)_100%)] lg:bg-[linear-gradient(180deg,rgba(15,23,42,0.02)_18%,rgba(15,23,42,0.16)_48%,rgba(15,23,42,0.78)_100%)]" />
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,240,0.08)_0%,rgba(255,248,240,0)_26%,rgba(255,248,240,0.03)_100%)]" />

                                <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/28 bg-white/14 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_8px_18px_rgba(15,23,42,0.08)] backdrop-blur-[4px]">
                                        <item.Icon className="h-3.5 w-3.5" />
                                        {item.label}
                                    </span>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
                                    <div className="max-w-[17rem] sm:max-w-[19rem]">
                                        <h3 className="font-hero-display text-[1.38rem] leading-[0.96] text-white sm:text-[1.55rem] lg:text-[1.7rem]">
                                            {item.label}
                                        </h3>
                                        <p className="mt-2 text-[13px] leading-6 text-white/78 sm:text-sm">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-3">
                                        <span className="text-[12px] font-medium text-white/80 sm:text-[13px]">
                                            {isLoading ? "Loading..." : `${getListingsByCategory(item.category).length} listings`}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#b54f32]/92 px-3 py-2 text-[11px] font-semibold text-white shadow-[0_10px_24px_rgba(181,79,50,0.18)] transition duration-300 ease-out group-hover:bg-[#b54f32] sm:text-[12px]">
                                            View Listings
                                            <ArrowUpRightIcon className="h-3.5 w-3.5 transition duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                        </span>
                                    </div>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </section>

            <section className="pb-10 sm:pb-14">
                <div className="mx-auto w-[min(1200px,calc(100%-1rem))] sm:w-[min(1200px,calc(100%-1.5rem))]">
                    <SectionHeading
                        eyebrow="Listings"
                        title="Available listings."
                        description="Browse verified listings available for direct inquiry."
                    />

                    <div className="mb-5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mb-8">
                        <div className="inline-flex min-w-max items-center gap-2 rounded-[1.2rem] border border-stone-200/80 bg-white/88 p-2 shadow-[0_12px_28px_rgba(15,23,42,0.045)] sm:gap-2.5 sm:rounded-[1.45rem] sm:p-2.5">
                            {[
                                { label: "All", value: "all" as const },
                                { label: "Automobiles", value: "automobiles" as const },
                                { label: "Yachts", value: "yachts" as const },
                                { label: "Properties", value: "properties" as const }
                            ].map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setActiveCategory(item.value)}
                                    className={[
                                        "shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition duration-300 ease-out sm:px-4 sm:py-2.5 sm:text-sm",
                                        activeCategory === item.value
                                            ? "bg-[#b54f32] text-white shadow-[0_12px_22px_rgba(181,79,50,0.15)]"
                                            : "border border-stone-300/90 bg-white/88 text-slate-700 hover:-translate-y-0.5 hover:border-stone-900 hover:bg-stone-50"
                                    ].join(" ")}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isLoading && visibleListings.length === 0 ? (
                        <div className="rounded-[1.45rem] border border-stone-200 bg-white/92 p-5 text-center shadow-[0_14px_32px_rgba(15,23,42,0.06)] sm:p-7">
                            <p className="text-sm text-slate-600">Loading listings...</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
                            {visibleListings.map((listing) => (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                    onViewDetails={setActiveListing}
                                    onEnquire={openInquiry}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="pb-10 sm:pb-16">
                <div className="mx-auto w-[min(1200px,calc(100%-1rem))] sm:w-[min(1200px,calc(100%-1.5rem))]">
                    <div className="relative overflow-hidden rounded-[1.6rem] border border-stone-200/80 bg-[radial-gradient(circle_at_top_left,rgba(207,151,127,0.12),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.99),rgba(250,246,238,0.96))] px-4 py-5 shadow-[0_18px_48px_rgba(15,23,42,0.07)] sm:rounded-[2rem] sm:px-6 sm:py-6 lg:px-10 lg:py-8">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,211,209,0.9),transparent)]" />
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)] lg:items-start lg:gap-8">
                            <div className="max-w-[40rem] pt-1 sm:pt-2 lg:pt-4">
                                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                                Direct Inquiry
                                </p>
                                <h2 className="font-hero-display max-w-[12ch] text-[1.95rem] leading-[0.95] text-slate-950 sm:text-[2.8rem] lg:text-[4.1rem]">
                                    Verified availability. Clear details. Direct contact.
                                </h2>
                                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
                                    Find the right asset and speak with us instantly.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
                                {[
                                    ["1", "Pick a listing"],
                                    ["2", "View the details"],
                                    ["3", "Send the inquiry"]
                                ].map(([step, text]) => (
                                    <div
                                        key={step}
                                        className="rounded-[1.2rem] border border-stone-200/75 bg-white/88 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:min-h-[9rem] sm:px-5 sm:py-5 lg:min-h-0"
                                    >
                                        <p className="flex items-start gap-2.5 text-[15px] leading-6 text-slate-800 sm:text-[1.05rem] sm:leading-7">
                                            <span className="shrink-0 font-semibold text-[#b54f32]">{step}.</span>
                                            <span>{text}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5 h-px bg-[linear-gradient(90deg,rgba(214,211,209,0.12),rgba(214,211,209,0.85),rgba(214,211,209,0.12))] sm:mt-6 lg:mt-7" />

                        <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:gap-3">
                            <NavLink
                                to="/inventory"
                                className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-5 py-3 text-[13px] font-semibold !text-white shadow-[0_14px_30px_rgba(181,79,50,0.2)] transition duration-300 ease-out hover:-translate-y-0.5 hover:brightness-[0.97] hover:!text-white sm:min-w-[12.5rem] sm:px-6 sm:py-3.5 sm:text-sm"
                            >
                                View All Listings
                            </NavLink>
                            <NavLink
                                to="/contact"
                                className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white/84 px-5 py-3 text-[13px] font-semibold text-slate-900 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-950 hover:bg-stone-50 sm:min-w-[12.5rem] sm:px-6 sm:py-3.5 sm:text-sm"
                            >
                                Contact Robarol
                            </NavLink>
                        </div>
                    </div>
                </div>
            </section>

            <ListingDetailsModal
                listing={activeListing}
                onClose={() => setActiveListing(null)}
                onEnquire={openInquiry}
            />

            <InquiryForm
                company={company}
                listing={inquiryListing}
                onClose={() => setInquiryListing(null)}
            />
        </>
    );
}
