import { useEffect, useState } from "react";

import { formatListingPrice, getListingDisplayDetails, getListingInquiryDefaultMessage } from "../../modules/site-data/listing-helpers";
import { useSiteData } from "../../modules/site-data/site-data.context";
import type { Listing } from "../../modules/site-data/site-data.types";
import { buildWhatsAppLink } from "../../utils/inquiry-links";
import { ArrowUpRightIcon, CloseIcon } from "../ui/site-icon";
import { getListingDisplayStatusLabel, getListingInquiryLabel, getListingStatusClassName, listingCategoryMeta } from "./listing-meta";

interface ListingDetailsModalProps {
    listing: Listing | null;
    onClose: () => void;
    onEnquire: (listing: Listing) => void;
    showInquiryActions?: boolean;
}

export function ListingDetailsModal({ listing, onClose, onEnquire, showInquiryActions = true }: ListingDetailsModalProps) {
    const { company } = useSiteData();
    const [activeImage, setActiveImage] = useState("");

    useEffect(() => {
        if (!listing) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [listing, onClose]);

    useEffect(() => {
        if (!listing) {
            setActiveImage("");
            return;
        }

        setActiveImage(listing.mainImage);
    }, [listing]);

    if (!listing) {
        return null;
    }

    const categoryMeta = listingCategoryMeta[listing.category];
    const inquiryLabel = getListingInquiryLabel(listing);
    const detailItems = getListingDisplayDetails(listing);
    const whatsappLink = buildWhatsAppLink(
        company?.whatsappNumber ?? "",
        getListingInquiryDefaultMessage(listing)
    );
    const galleryImages = Array.from(new Set([listing.mainImage, ...listing.galleryImages].filter(Boolean)));
    const displayImage = activeImage || galleryImages[0];

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(15,23,42,0.62)] px-3 py-3 backdrop-blur-[10px] sm:items-center sm:px-4 sm:py-5"
            onClick={onClose}
            role="presentation"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={`listing-title-${listing.id}`}
                className="luxury-modal-scroll relative max-h-[94vh] w-full max-w-[72rem] overflow-y-auto rounded-[1.7rem] border border-stone-200/75 bg-[linear-gradient(180deg,rgba(252,250,246,0.99),rgba(246,241,234,0.97))] shadow-[0_32px_90px_rgba(15,23,42,0.24)] sm:rounded-[2rem] lg:rounded-[2.2rem]"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/88 text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-900 sm:right-5 sm:top-5 sm:h-11 sm:w-11"
                    aria-label="Close details"
                >
                    <CloseIcon className="h-4 w-4" />
                </button>

                <div className="grid lg:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)]">
                    <section className="px-3 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-5 lg:px-6 lg:py-6">
                        <div className="relative overflow-hidden rounded-[1.5rem] bg-[#f5efe7] shadow-[0_22px_50px_rgba(15,23,42,0.14)] sm:rounded-[1.8rem] lg:rounded-[2rem]">
                            <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_top_left,rgba(255,245,235,0.32),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(15,23,42,0.05))]" />
                            <img
                                src={displayImage}
                                alt={listing.title}
                                className="h-[18rem] w-full object-cover object-center sm:h-[23rem] lg:h-[41rem]"
                            />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/28 via-slate-950/8 to-transparent" />
                        </div>

                        {galleryImages.length > 1 ? (
                            <div className="mt-4 sm:mt-5">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                                        More Views
                                    </p>
                                    <span className="text-[11px] text-stone-400 sm:text-[12px]">
                                        {galleryImages.length} images
                                    </span>
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-3">
                                    {galleryImages.map((image, index) => {
                                        const isActive = displayImage === image;

                                        return (
                                            <button
                                                key={`${listing.id}-${image}-${index}`}
                                                type="button"
                                                onClick={() => setActiveImage(image)}
                                                className={[
                                                    "group/thumb relative shrink-0 overflow-hidden rounded-[1.05rem] border bg-white/84 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition duration-300 ease-out hover:-translate-y-0.5",
                                                    isActive
                                                        ? "border-[#b54f32]/60 ring-2 ring-[#b54f32]/14"
                                                        : "border-stone-200/80 hover:border-stone-300"
                                                ].join(" ")}
                                                aria-label={`View image ${index + 1}`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${listing.title} view ${index + 1}`}
                                                    className="h-20 w-24 object-cover transition duration-500 ease-out group-hover/thumb:scale-[1.04] sm:h-24 sm:w-32"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null}
                    </section>

                    <section className="px-4 pb-4 pt-1 sm:px-6 sm:pb-6 lg:py-6 lg:pl-0 lg:pr-6">
                        <div className="lg:rounded-[1.8rem] lg:bg-white/74 lg:p-6 lg:shadow-[0_20px_46px_rgba(15,23,42,0.08)] lg:backdrop-blur-sm">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/90 bg-white/88 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-900">
                                    <categoryMeta.Icon className="h-3.5 w-3.5" />
                                    {categoryMeta.label}
                                </span>
                                <span
                                    className={[
                                        "inline-flex rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]",
                                        getListingStatusClassName(listing.status)
                                    ].join(" ")}
                                >
                                    {getListingDisplayStatusLabel(listing.status)}
                                </span>
                            </div>

                            <h2
                                id={`listing-title-${listing.id}`}
                                className="font-hero-display mt-4 text-[1.8rem] leading-[0.98] text-slate-950 sm:mt-5 sm:text-[2.35rem] lg:text-[2.8rem]"
                            >
                                {listing.title}
                            </h2>

                            <div className="mt-5 border-t border-stone-200/75 pt-4 sm:mt-6 sm:pt-5">
                                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                    Asking Price
                                </span>
                                <strong className="font-hero-display mt-2 block text-[2rem] leading-none text-[#b54f32] sm:text-[2.35rem] lg:text-[2.7rem]">
                                    {formatListingPrice(listing)}
                                </strong>
                            </div>

                            <p className="mt-5 text-sm leading-6 text-slate-600 sm:text-[0.98rem] sm:leading-7">
                                {listing.shortDescription}
                            </p>

                            <dl className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2 sm:gap-y-4">
                                {detailItems.map((detail) => (
                                    <div key={`${listing.id}-${detail.label}`} className="border-t border-stone-200/75 pt-3">
                                        <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-stone-400">
                                            {detail.label}
                                        </dt>
                                        <dd className="mt-1.5 text-sm font-medium text-slate-800 sm:text-[15px]">
                                            {detail.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            {showInquiryActions ? (
                                <div className="sticky bottom-0 -mx-4 mt-6 border-t border-stone-200/80 bg-[linear-gradient(180deg,rgba(251,250,246,0.58),rgba(251,250,246,0.96)_26%)] px-4 pb-1 pt-4 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-t-0 lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-7 lg:backdrop-blur-none">
                                    <div className="flex flex-col gap-2.5 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={() => onEnquire(listing)}
                                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b54f32] px-5 py-3 text-sm font-semibold !text-white shadow-[0_12px_28px_rgba(181,79,50,0.18)] transition duration-300 ease-out hover:-translate-y-0.5 hover:brightness-[0.97] hover:!text-white"
                                        >
                                            {inquiryLabel}
                                            <ArrowUpRightIcon className="h-4 w-4" />
                                        </button>
                                        <a
                                            href={whatsappLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center rounded-full border border-emerald-200/80 bg-white/88 px-5 py-3 text-sm font-semibold text-emerald-700 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/80"
                                        >
                                            Message on WhatsApp
                                        </a>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
