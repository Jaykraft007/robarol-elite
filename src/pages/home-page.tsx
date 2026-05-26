import { useState } from "react";
import { NavLink } from "react-router";

import { InquiryForm } from "../components/listings/inquiry-form";
import { ListingCard } from "../components/listings/listing-card";
import { ListingDetailsModal } from "../components/listings/listing-details-modal";
import { SectionHeading } from "../components/ui/section-heading";
import {
    ArrowUpRightIcon,
    BankIcon,
    BriefcaseIcon,
    CarIcon,
    WhatsappIcon,
    YachtIcon
} from "../components/ui/site-icon";
import { useSiteData } from "../modules/site-data/site-data.context";
import type { Listing } from "../modules/site-data/site-data.types";

type FeaturedCategory = "all" | "automobiles" | "yachts";

export function HomePage() {
    const { company, featuredListings, getListingsByCategory } = useSiteData();
    const [activeCategory, setActiveCategory] = useState<FeaturedCategory>("all");
    const [activeListing, setActiveListing] = useState<Listing | null>(null);
    const [inquiryListing, setInquiryListing] = useState<Listing | null>(null);

    if (!company) {
        return null;
    }

    const showcaseCards = [
        {
            title: "Automobiles",
            description: "Premium cars and direct conversations for ready buyers.",
            meta: `${getListingsByCategory("automobiles").length} listings`,
            image: "/assets/catalog-mercedes-front.jpg",
            to: "/inventory?category=automobiles",
            Icon: CarIcon
        },
        {
            title: "Yachts",
            description: "Yacht sourcing, showcase inventory and client support.",
            meta: `${getListingsByCategory("yachts").length} listings`,
            image: "/assets/catalog-gtr-angle.jpg",
            to: "/inventory?category=yachts",
            Icon: YachtIcon
        },
        {
            title: "Finance & Loans",
            description: "Home, business, personal, car and yacht loan support.",
            meta: "Finance options",
            image: "/assets/catalog-bmw-front.jpg",
            to: "/finance",
            Icon: BankIcon
        },
        {
            title: "Visa & Business Setup",
            description: "Foreigner support for visas, PR applications and new business setup.",
            meta: "Direct support",
            image: "/assets/catalog-bmw-side.jpg",
            to: "/services",
            Icon: BriefcaseIcon
        }
    ];

    const showcaseListings = featuredListings.filter((listing) => listing.category !== "properties");
    const visibleListings = (activeCategory === "all"
        ? showcaseListings
        : showcaseListings.filter((listing) => listing.category === activeCategory)).slice(0, 6);

    const openInquiry = (listing: Listing) => {
        setActiveListing(null);
        setInquiryListing(listing);
    };

    return (
        <>
            <section className="pb-9 pt-2 sm:pt-6">
                <div className="mx-auto grid w-[min(1200px,calc(100%-1rem))] gap-3.5 sm:w-[min(1200px,calc(100%-1.5rem))] sm:gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div className="rounded-[1.45rem] border border-stone-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.99),rgba(250,246,238,0.94))] p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8 sm:shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                            {company.tagline}
                        </p>
                        <h1 className="font-display max-w-3xl text-[2rem] leading-[1] text-slate-950 sm:text-5xl lg:text-6xl">
                            Yachts, automobiles, finance and global client support.
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-8">
                            Robarol gives you direct access to {company.contactName} for asset inquiries, loan support,
                            visa guidance, PR applications and business setup for foreigners.
                        </p>
                        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-7 sm:flex sm:flex-row sm:gap-3">
                            <NavLink
                                to="/inventory"
                                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#b54f32] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_12px_30px_rgba(181,79,50,0.22)] transition duration-300 ease-out hover:brightness-[0.96] sm:gap-2 sm:px-6 sm:py-4 sm:text-sm"
                            >
                                View Inventory
                                <ArrowUpRightIcon className="h-4 w-4" />
                            </NavLink>
                            <a
                                href={`https://wa.me/${company.whatsappNumber.replace(/[^\d]/g, "")}`}
                                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-stone-300 px-4 py-3 text-[13px] font-semibold text-slate-900 transition duration-300 ease-out hover:border-slate-950 hover:bg-stone-50 sm:gap-2 sm:px-6 sm:py-4 sm:text-sm"
                            >
                                <WhatsappIcon className="h-4 w-4" />
                                WhatsApp Lats
                            </a>
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-7 sm:gap-4">
                            {[
                                ["Direct Contact", company.contactName],
                                ["WhatsApp", company.phone],
                                ["Website", company.websiteLabel]
                            ].map(([title, value]) => (
                                <div key={title} className="rounded-[1rem] border border-stone-200/70 bg-white/78 p-3 shadow-[0_8px_20px_rgba(15,23,42,0.04)] sm:rounded-[1.35rem] sm:p-4">
                                    <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-stone-500 sm:text-[10px] sm:tracking-[0.18em]">
                                        {title}
                                    </span>
                                    <strong className="font-display mt-1.5 block text-[1rem] text-slate-950 sm:mt-2 sm:text-[1.4rem]">{value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>

                    <figure className="overflow-hidden rounded-[1.45rem] border border-stone-200 bg-white p-3 shadow-[0_14px_36px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-4 sm:shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                        <div className="relative overflow-hidden rounded-[1.1rem] sm:rounded-[1.5rem]">
                            <img
                                src="/assets/hero-convertible.jpg"
                                alt="Premium convertible available through Robarol"
                                className="h-full min-h-[13.25rem] w-full object-cover sm:min-h-[30rem] lg:min-h-[36rem]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/8 to-transparent sm:hidden" />
                            <div className="absolute left-3 top-3 rounded-full border border-white/80 bg-white/90 px-3 py-2 text-[11px] font-semibold text-slate-950 shadow-sm backdrop-blur sm:left-5 sm:top-5 sm:px-4 sm:py-3 sm:text-sm">
                                Direct support from {company.contactName}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-3 sm:inset-x-5 sm:bottom-5 sm:p-0">
                                <div className="max-w-[76%] rounded-[1rem] bg-transparent p-0 shadow-none sm:max-w-[24rem] sm:rounded-[1.15rem] sm:border sm:border-white/60 sm:bg-white/82 sm:p-4 sm:shadow-[0_12px_28px_rgba(15,23,42,0.12)] sm:backdrop-blur lg:max-w-[27rem]">
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/78 sm:text-[10px] sm:tracking-[0.2em] sm:text-stone-500">
                                        Robarol
                                    </span>
                                    <strong className="mt-1.5 block font-display text-[1.08rem] leading-tight text-white sm:mt-2 sm:text-[1.9rem] sm:leading-[1.02] sm:text-slate-950 lg:text-[2.2rem]">
                                        Premium assets. Practical support.
                                    </strong>
                                    <p className="mt-1.5 max-w-md text-[12px] leading-5 text-white/76 sm:mt-2 sm:text-[13px] sm:leading-6 sm:text-slate-600">
                                        From first inquiry to finance or paperwork, communication stays direct.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </figure>
                </div>
            </section>

            <section className="pb-10 sm:pb-14">
                <div className="mx-auto w-[min(1200px,calc(100%-1rem))] sm:w-[min(1200px,calc(100%-1.5rem))]">
                    <SectionHeading
                        eyebrow="Explore"
                        title="What Robarol handles."
                        description="From premium inventory to finance and foreigner support, choose where you want to start."
                    />

                    <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-4">
                        {showcaseCards.map((item) => (
                            <NavLink
                                key={item.title}
                                to={item.to}
                                className="group relative overflow-hidden rounded-[1.45rem] border border-stone-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(15,23,42,0.11)] lg:rounded-[1.75rem] lg:shadow-[0_16px_44px_rgba(15,23,42,0.08)]"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-48 w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025] sm:h-60"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/20 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-4">
                                    <div className="max-w-[19rem] rounded-[1rem] border border-white/18 bg-white/10 p-4 backdrop-blur">
                                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                                            <item.Icon className="h-3.5 w-3.5" />
                                            {item.title}
                                        </span>
                                        <h3 className="font-display mt-3 text-[1.25rem] leading-none text-white">{item.title}</h3>
                                        <p className="mt-2 text-[12px] leading-5 text-white/78">{item.description}</p>
                                        <div className="mt-3 flex items-center justify-between text-[12px] text-white/84">
                                            <span>{item.meta}</span>
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/18 bg-white/12 px-2.5 py-1.5 font-semibold text-white">
                                                Open
                                                <ArrowUpRightIcon className="h-3.5 w-3.5" />
                                            </span>
                                        </div>
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
                        eyebrow="Showcase"
                        title="Featured inventory."
                        description="Current public listings for yachts and automobiles."
                    />

                    <div className="mb-5 flex gap-2 overflow-x-auto rounded-[1.2rem] border border-stone-200 bg-white/80 p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mb-8 sm:flex-wrap sm:items-center sm:gap-3 sm:rounded-[1.5rem] sm:p-3">
                        {[
                            { label: "All", value: "all" as const },
                            { label: "Automobiles", value: "automobiles" as const },
                            { label: "Yachts", value: "yachts" as const }
                        ].map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => setActiveCategory(item.value)}
                                className={[
                                    "shrink-0 rounded-full px-3.5 py-2.5 text-[13px] font-semibold transition duration-300 ease-out sm:px-4 sm:py-3 sm:text-sm",
                                    activeCategory === item.value
                                        ? "bg-[#b54f32] text-white shadow-[0_12px_26px_rgba(181,79,50,0.18)]"
                                        : "border border-stone-300 bg-white text-slate-700 hover:border-slate-950 hover:bg-stone-50"
                                ].join(" ")}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {visibleListings.map((listing) => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                onViewDetails={setActiveListing}
                                onEnquire={openInquiry}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="pb-10 sm:pb-16">
                <div className="mx-auto w-[min(1200px,calc(100%-1rem))] rounded-[1.45rem] border border-stone-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.99),rgba(250,246,238,0.94))] p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)] sm:w-[min(1200px,calc(100%-1.5rem))] sm:rounded-[2rem] sm:p-8 sm:shadow-[0_22px_64px_rgba(15,23,42,0.08)]">
                    <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-center">
                        <div>
                            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                                Direct Contact
                            </p>
                            <h2 className="font-display text-[1.7rem] leading-tight text-slate-950 sm:text-5xl sm:leading-[0.95]">
                                Speak with {company.contactName} about listings, loans or business support.
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
                                Robarol keeps communication direct whether you are buying an asset, applying for a loan
                                or starting a move as a foreign client.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-1">
                            {[
                                ["1", "Choose an inventory or service option"],
                                ["2", "Share your brief or request"],
                                ["3", "Continue on WhatsApp or email"]
                            ].map(([step, text]) => (
                                <div key={step} className="rounded-[1rem] border border-stone-200/70 bg-white/78 p-3 shadow-[0_8px_20px_rgba(15,23,42,0.04)] sm:rounded-[1.35rem] sm:p-5">
                                    <span className="text-[13px] font-semibold text-[#b54f32] sm:text-sm">{step}</span>
                                    <p className="mt-1.5 text-[12px] leading-5 text-slate-700 sm:mt-2 sm:text-sm">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2.5 sm:mt-5 sm:flex-row sm:gap-3">
                        <NavLink
                            to="/inventory"
                            className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_12px_30px_rgba(181,79,50,0.22)] transition duration-300 ease-out hover:brightness-[0.96] sm:px-6 sm:py-4 sm:text-sm"
                        >
                            Browse Inventory
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className="inline-flex items-center justify-center rounded-full border border-stone-300 px-5 py-3 text-[13px] font-semibold text-slate-900 transition duration-300 ease-out hover:border-slate-950 hover:bg-stone-50 sm:px-6 sm:py-4 sm:text-sm"
                        >
                            Contact Lats
                        </NavLink>
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
