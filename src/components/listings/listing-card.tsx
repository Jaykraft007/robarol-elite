import type { Listing } from "../../modules/site-data/site-data.types";
import { ArrowUpRightIcon, MapPinIcon } from "../ui/site-icon";
import { getListingInquiryLabel, getListingStatusClassName, listingCategoryMeta } from "./listing-meta";

interface ListingCardProps {
    listing: Listing;
    onViewDetails: (listing: Listing) => void;
    onEnquire: (listing: Listing) => void;
    variant?: "featured" | "compact";
}

export function ListingCard({ listing, onViewDetails, onEnquire, variant = "featured" }: ListingCardProps) {
    const categoryMeta = listingCategoryMeta[listing.category];
    const inquiryLabel = getListingInquiryLabel(listing.status);
    const isCompact = variant === "compact";
    const inquiryButtonClassName = listing.status === "Sold"
        ? "border border-stone-300 bg-stone-100 text-slate-700 hover:bg-stone-200"
        : "bg-[#b54f32] text-white shadow-[0_12px_28px_rgba(181,79,50,0.18)] hover:brightness-[0.96]";

    return (
        <article
            className={[
                "group flex h-full flex-col overflow-hidden border border-stone-200 bg-white transition duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(15,23,42,0.12)]",
                isCompact
                    ? "rounded-[1.55rem] shadow-[0_12px_34px_rgba(15,23,42,0.07)]"
                    : "rounded-[1.7rem] shadow-[0_14px_40px_rgba(15,23,42,0.08)]"
            ].join(" ")}
        >
            <div className="relative overflow-hidden">
                <img
                    src={listing.image}
                    alt={listing.name}
                    className={[
                        "w-full object-cover transition duration-700 ease-out group-hover:scale-[1.018]",
                        isCompact ? "h-36 sm:h-48" : "h-[13rem] sm:h-[17rem]"
                    ].join(" ")}
                    style={{ objectPosition: listing.imagePosition ?? "center" }}
                    loading="lazy"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/10 to-transparent" />
                <div className={["absolute flex items-start justify-between gap-3", isCompact ? "inset-x-3 top-3" : "inset-x-4 top-4"].join(" ")}>
                    <span
                        className={[
                            "inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/92 font-semibold uppercase tracking-[0.18em] text-slate-900 backdrop-blur",
                            isCompact ? "px-2 py-1.25 text-[9px] sm:px-2.5 sm:py-1.5 sm:text-[10px]" : "px-2.5 py-1.5 text-[10px] sm:px-3 sm:py-2 sm:text-[11px]"
                        ].join(" ")}
                    >
                        <categoryMeta.Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {categoryMeta.label}
                    </span>
                    <span
                        className={[
                            "inline-flex rounded-full border font-semibold uppercase tracking-[0.18em]",
                            isCompact ? "px-2 py-1.25 text-[9px] sm:px-2.5 sm:py-1.5 sm:text-[10px]" : "px-2.5 py-1.5 text-[10px] sm:px-3 sm:py-2 sm:text-[11px]",
                            getListingStatusClassName(listing.status)
                        ].join(" ")}
                    >
                        {listing.status}
                    </span>
                </div>
            </div>

            {isCompact ? (
                <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                    <div className="min-w-0">
                        <h3 className="font-display text-[1.08rem] leading-tight text-slate-950 sm:text-[1.2rem]">{listing.name}</h3>
                        <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-slate-500 sm:mt-2 sm:gap-2 sm:text-[12px]">
                            <MapPinIcon className="h-3.5 w-3.5" />
                            <span>{listing.location}</span>
                        </div>
                    </div>

                    <strong className="font-display mt-2.5 block text-[1.28rem] leading-none text-[#b54f32] sm:mt-3 sm:text-[1.45rem]">
                        {listing.price}
                    </strong>

                    <p className="mt-2 hidden text-[13px] leading-6 text-slate-600 sm:block">{listing.summary}</p>

                    <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-2.5">
                        {listing.details.slice(0, 2).map((detail) => (
                            <div key={`${listing.id}-${detail.label}`} className="rounded-[0.9rem] border border-stone-200/70 bg-stone-50/90 px-2.5 py-2 sm:rounded-[1rem] sm:px-3 sm:py-2.5">
                                <span className="block text-[9px] font-medium uppercase tracking-[0.15em] text-stone-400">
                                    {detail.label}
                                </span>
                                <span className="mt-1 block text-[12px] font-medium text-slate-800">{detail.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-3 sm:pt-4">
                        <div className="mb-3 h-px bg-[linear-gradient(90deg,rgba(214,211,209,0.12),rgba(214,211,209,0.8),rgba(214,211,209,0.12))] sm:mb-4" />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => onViewDetails(listing)}
                                className="inline-flex flex-1 items-center justify-center rounded-full border border-stone-300 px-3.5 py-2.5 text-[13px] font-semibold text-slate-900 transition duration-300 ease-out hover:border-slate-900 hover:bg-stone-50 sm:px-4 sm:py-3 sm:text-sm"
                            >
                                Details
                            </button>
                            <button
                                type="button"
                                onClick={() => onEnquire(listing)}
                                className={[
                                    "inline-flex flex-1 items-center justify-center rounded-full px-3.5 py-2.5 text-[13px] font-semibold transition duration-300 ease-out sm:px-4 sm:py-3 sm:text-sm",
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
                        <h3 className="font-display text-[1.18rem] leading-[1.08] text-slate-950 sm:text-[1.42rem]">{listing.name}</h3>
                        <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-slate-500 sm:mt-2 sm:gap-2 sm:text-[13px]">
                            <MapPinIcon className="h-4 w-4" />
                            <span>{listing.location}</span>
                        </div>
                    </div>

                    <div className="mt-3 flex items-end justify-between gap-3 border-y border-stone-200/80 py-3 sm:mt-4 sm:gap-4 sm:py-3.5">
                        <div>
                            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                Asking Price
                            </span>
                            <strong className="font-display mt-1 block text-[1.38rem] leading-none text-[#b54f32] sm:text-[1.75rem]">
                                {listing.price}
                            </strong>
                        </div>
                        <span className="rounded-full bg-stone-50 px-2.5 py-1.5 text-[10px] font-medium text-slate-600 sm:px-3 sm:py-2 sm:text-[11px]">
                            {listing.status === "Available" ? "Direct inquiry" : listing.status}
                        </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-[13px] leading-5 text-slate-600 sm:mt-4 sm:text-sm sm:leading-6.5">{listing.summary}</p>

                    <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-2.5">
                        {listing.details.slice(0, 4).map((detail, index) => (
                            <div
                                key={`${listing.id}-${detail.label}`}
                                className={[
                                    "rounded-[0.9rem] border border-stone-200/70 bg-stone-50/80 px-2.5 py-2 sm:rounded-[1rem] sm:px-3.5 sm:py-3",
                                    index > 1 ? "hidden sm:block" : ""
                                ].join(" ")}
                            >
                                <span className="block text-[9px] font-medium uppercase tracking-[0.16em] text-stone-400">
                                    {detail.label}
                                </span>
                                <span className="mt-1 block text-[12px] font-medium text-slate-800 sm:mt-1.5 sm:text-[13px]">{detail.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-3.5 sm:pt-4.5">
                        <div className="mb-3.5 h-px bg-[linear-gradient(90deg,rgba(214,211,209,0.1),rgba(214,211,209,0.85),rgba(214,211,209,0.1))] sm:mb-4.5" />
                        <div className="flex gap-2 sm:gap-3">
                            <button
                                type="button"
                                onClick={() => onViewDetails(listing)}
                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-stone-300 px-4 py-2.5 text-[13px] font-semibold text-slate-900 transition duration-300 ease-out hover:border-slate-900 hover:bg-stone-50 sm:gap-2 sm:px-5 sm:py-3 sm:text-sm"
                            >
                                Details
                                <ArrowUpRightIcon className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onEnquire(listing)}
                                className={[
                                    "inline-flex flex-1 items-center justify-center rounded-full px-4 py-2.5 text-[13px] font-semibold transition duration-300 ease-out sm:px-5 sm:py-3 sm:text-sm",
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
