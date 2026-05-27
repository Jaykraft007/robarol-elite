import type { Listing } from "../../modules/site-data/site-data.types";
import { formatListingPrice } from "../../modules/site-data/listing-helpers";
import { ArrowUpRightIcon } from "../ui/site-icon";
import {
    getListingDisplayDetails,
    getListingDisplayStatusLabel,
    getListingInquiryLabel,
    getListingStatusClassName,
    listingCategoryMeta
} from "./listing-meta";

interface ListingCardProps {
    listing: Listing;
    onViewDetails: (listing: Listing) => void;
    onEnquire: (listing: Listing) => void;
    variant?: "featured" | "compact";
}

export function ListingCard({ listing, onViewDetails, onEnquire, variant = "featured" }: ListingCardProps) {
    const categoryMeta = listingCategoryMeta[listing.category];
    const inquiryLabel = getListingInquiryLabel(listing);
    const detailItems = getListingDisplayDetails(listing).slice(0, variant === "compact" ? 2 : 3);
    const isCompact = variant === "compact";
    const inquiryButtonClassName = listing.status === "sold"
        ? "border border-stone-300 bg-stone-100 text-slate-700 hover:bg-stone-200"
        : "bg-[#b54f32] text-white shadow-[0_12px_26px_rgba(181,79,50,0.16)] hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(181,79,50,0.2)]";

    return (
        <article
            className={[
                "group flex h-full flex-col overflow-hidden border border-stone-200/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(251,248,243,0.96))] transition duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.1)]",
                isCompact
                    ? "rounded-[1.45rem] shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
                    : "rounded-[1.55rem] shadow-[0_14px_30px_rgba(15,23,42,0.07)]"
            ].join(" ")}
        >
            <div className="relative overflow-hidden">
                <img
                    src={listing.mainImage}
                    alt={listing.title}
                    className={[
                        "w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]",
                        isCompact ? "h-32 object-center sm:h-44" : "h-[12rem] object-center sm:h-[14.5rem]"
                    ].join(" ")}
                    loading="lazy"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/18 via-slate-950/4 to-transparent" />
                <div className={["absolute flex items-start justify-between gap-2.5", isCompact ? "inset-x-3 top-3" : "inset-x-4 top-4"].join(" ")}>
                    <span
                        className={[
                            "inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/88 font-semibold uppercase tracking-[0.16em] text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.08)]",
                            isCompact ? "px-2.5 py-1 text-[9px] sm:px-3 sm:text-[10px]" : "px-2.5 py-1 text-[9px] sm:px-3 sm:py-1.5 sm:text-[10px]"
                        ].join(" ")}
                    >
                        <categoryMeta.Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {categoryMeta.label}
                    </span>
                    <span
                        className={[
                            "inline-flex rounded-full border font-semibold uppercase tracking-[0.16em] shadow-[0_8px_18px_rgba(15,23,42,0.06)]",
                            isCompact ? "px-2.5 py-1 text-[9px] sm:px-3 sm:text-[10px]" : "px-2.5 py-1 text-[9px] sm:px-3 sm:py-1.5 sm:text-[10px]",
                            getListingStatusClassName(listing.status)
                        ].join(" ")}
                    >
                        {getListingDisplayStatusLabel(listing.status)}
                    </span>
                </div>
            </div>

            {isCompact ? (
                <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                    <div className="min-w-0">
                        <h3 className="font-hero-display text-[1.02rem] leading-[1.1] text-slate-950 sm:text-[1.18rem]">
                            {listing.title}
                        </h3>
                    </div>

                    <div className="mt-3 flex items-start justify-between gap-3">
                        <div>
                            <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                Asking Price
                            </span>
                            <strong className="font-hero-display mt-1 block text-[1.2rem] leading-none text-[#b54f32] sm:text-[1.35rem]">
                                {formatListingPrice(listing)}
                            </strong>
                        </div>
                        <span className="rounded-full border border-stone-200 bg-white/80 px-2.5 py-1 text-[10px] font-medium text-slate-600">
                            {listing.status === "available" ? "Direct inquiry" : getListingDisplayStatusLabel(listing.status)}
                        </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-slate-600 sm:mt-2.5 sm:text-[13px] sm:leading-6">
                        {listing.shortDescription}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {detailItems.map((detail) => (
                            <div
                                key={`${listing.id}-${detail.label}`}
                                className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-stone-50/80 px-2.5 py-1.5 text-[11px] text-slate-700"
                            >
                                <span className="font-medium text-stone-400">{detail.label}</span>
                                <span className="font-semibold text-slate-800">{detail.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-3.5 sm:pt-4">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => onViewDetails(listing)}
                                className="group/details inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-stone-300 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-slate-900 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-stone-900 hover:bg-stone-50"
                            >
                                Details
                                <ArrowUpRightIcon className="h-3.5 w-3.5 transition duration-300 group-hover/details:-translate-y-0.5 group-hover/details:translate-x-0.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onEnquire(listing)}
                                className={[
                                    "inline-flex flex-1 items-center justify-center rounded-full px-3.5 py-2.5 text-[13px] font-semibold transition duration-300 ease-out",
                                    inquiryButtonClassName
                                ].join(" ")}
                            >
                                {inquiryLabel}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="min-w-0">
                        <h3 className="font-hero-display text-[1.12rem] leading-[1.08] text-slate-950 sm:text-[1.34rem]">
                            {listing.title}
                        </h3>
                    </div>

                    <div className="mt-3 flex items-start justify-between gap-3 sm:mt-3.5 sm:gap-4">
                        <div>
                            <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-400 sm:text-[10px]">
                                Asking Price
                            </span>
                            <strong className="font-hero-display mt-1 block text-[1.3rem] leading-none text-[#b54f32] sm:text-[1.6rem]">
                                {formatListingPrice(listing)}
                            </strong>
                        </div>
                        <span className="rounded-full border border-stone-200 bg-white/84 px-2.5 py-1 text-[10px] font-medium text-slate-600 sm:px-3 sm:py-1.5 sm:text-[11px]">
                            {listing.status === "available" ? "Direct inquiry" : getListingDisplayStatusLabel(listing.status)}
                        </span>
                    </div>

                    <p className="mt-2.5 line-clamp-2 text-[13px] leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-6">
                        {listing.shortDescription}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                        {detailItems.map((detail, index) => (
                            <div
                                key={`${listing.id}-${detail.label}`}
                                className={[
                                    "inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-stone-50/80 px-2.5 py-1.5 text-[11px] text-slate-700 sm:px-3 sm:py-2",
                                    index > 1 ? "hidden sm:inline-flex" : ""
                                ].join(" ")}
                            >
                                <span className="font-medium text-stone-400">
                                    {detail.label}
                                </span>
                                <span className="font-semibold text-slate-800">{detail.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-4 sm:pt-4">
                        <div className="flex gap-2 sm:gap-2.5">
                            <button
                                type="button"
                                onClick={() => onViewDetails(listing)}
                                className="group/details inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-900 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-stone-900 hover:bg-stone-50 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
                            >
                                Details
                                <ArrowUpRightIcon className="h-4 w-4 transition duration-300 group-hover/details:-translate-y-0.5 group-hover/details:translate-x-0.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onEnquire(listing)}
                                className={[
                                    "inline-flex flex-1 items-center justify-center rounded-full px-4 py-2.5 text-[13px] font-semibold transition duration-300 ease-out sm:px-4 sm:py-2.5 sm:text-sm",
                                    inquiryButtonClassName
                                ].join(" ")}
                            >
                                {inquiryLabel}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}
