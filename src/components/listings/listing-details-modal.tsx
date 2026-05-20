import { useEffect } from "react";

import { useSiteData } from "../../modules/site-data/site-data.context";
import type { Listing } from "../../modules/site-data/site-data.types";
import { ArrowUpRightIcon, CloseIcon, MapPinIcon } from "../ui/site-icon";
import { buildWhatsAppLink } from "../../utils/inquiry-links";
import { getListingInquiryLabel, getListingStatusClassName, listingCategoryMeta } from "./listing-meta";

interface ListingDetailsModalProps {
    listing: Listing | null;
    onClose: () => void;
    onEnquire: (listing: Listing) => void;
}

export function ListingDetailsModal({ listing, onClose, onEnquire }: ListingDetailsModalProps) {
    const { company } = useSiteData();

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

    if (!listing) {
        return null;
    }

    const categoryMeta = listingCategoryMeta[listing.category];
    const inquiryLabel = getListingInquiryLabel(listing.status);
    const whatsappLink = buildWhatsAppLink(
        company?.whatsappNumber ?? "",
        `Hello Robarol Elite,\nI am interested in the ${listing.name} listed at ${listing.price}.\n\nPlease send me more details.`
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
            onClick={onClose}
            role="presentation"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={`listing-title-${listing.id}`}
                className="luxury-modal-scroll relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-stone-200 bg-[linear-gradient(135deg,rgba(251,250,247,1),rgba(246,241,234,0.96))] shadow-[0_30px_90px_rgba(15,23,42,0.22)]"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/90 bg-white/90 text-slate-900 shadow-sm transition hover:border-slate-950"
                    aria-label="Close details"
                >
                    <CloseIcon className="h-4 w-4" />
                </button>

                <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
                    <div className="overflow-hidden">
                        <img
                            src={listing.image}
                            alt={listing.name}
                            className="h-full min-h-[24rem] w-full object-cover lg:min-h-[42rem]"
                            style={{ objectPosition: listing.imagePosition ?? "center" }}
                        />
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900">
                                <categoryMeta.Icon className="h-3.5 w-3.5" />
                                {categoryMeta.label}
                            </span>
                            <span className={`inline-flex rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${getListingStatusClassName(listing.status)}`}>
                                {listing.status}
                            </span>
                        </div>

                        <h2 id={`listing-title-${listing.id}`} className="font-display mt-5 text-4xl leading-tight text-slate-950 sm:text-5xl">
                            {listing.name}
                        </h2>

                        <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
                            <MapPinIcon className="h-4 w-4" />
                            <span>{listing.location}</span>
                        </div>

                        <div className="mt-5 rounded-[1.4rem] border border-stone-200 bg-white/90 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                Asking Price
                            </span>
                            <strong className="font-display mt-2 block text-4xl leading-none text-[#b54f32]">{listing.price}</strong>
                        </div>

                        <p className="mt-5 text-base leading-7 text-slate-700">{listing.summary}</p>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{listing.description}</p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {listing.details.map((detail) => (
                                <div key={`${listing.id}-${detail.label}`} className="rounded-[1.15rem] border border-stone-200/80 bg-white px-4 py-4 shadow-[0_6px_16px_rgba(15,23,42,0.04)]">
                                    <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-stone-400">
                                        {detail.label}
                                    </span>
                                    <span className="mt-1.5 block text-sm font-medium text-slate-800">{detail.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-[1.5rem] border border-stone-200 bg-white p-5">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                                Highlights
                            </h3>
                            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                                {listing.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#b54f32]" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => onEnquire(listing)}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b54f32] px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(181,79,50,0.18)] transition duration-300 ease-out hover:brightness-[0.96]"
                            >
                                {inquiryLabel}
                                <ArrowUpRightIcon className="h-4 w-4" />
                            </button>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm font-semibold text-emerald-700 transition duration-300 ease-out hover:bg-emerald-100"
                            >
                                Message on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
