import { NavLink } from "react-router";

import { formatAdminUpdatedAt, formatListingPrice, listingStatusOptions } from "../../modules/site-data/listing-helpers";
import type { Listing, ListingStatus } from "../../modules/site-data/site-data.types";
import { listingCategoryMeta } from "../listings/listing-meta";
import { EyeIcon, PencilIcon, TrashIcon } from "../ui/site-icon";
import { ListingStatusBadge } from "./listing-status-badge";

interface AdminListingCardProps {
    listing: Listing;
    onView: (listing: Listing) => void;
    onDelete: (listing: Listing) => void;
    onStatusChange: (listingId: string, status: ListingStatus) => void;
}

export function AdminListingCard({ listing, onView, onDelete, onStatusChange }: AdminListingCardProps) {
    const category = listingCategoryMeta[listing.category];

    return (
        <article className="rounded-[1.55rem] border border-stone-200 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)] transition hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="flex gap-3.5">
                <img
                    src={listing.mainImage}
                    alt={listing.title}
                    className="h-28 w-28 rounded-[1.2rem] object-cover"
                />
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                            <category.Icon className="h-3.5 w-3.5" />
                            {category.label}
                        </span>
                        <ListingStatusBadge status={listing.status} />
                    </div>
                    <h3 className="mt-3 text-[1.02rem] font-semibold text-slate-950">{listing.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{listing.shortDescription}</p>
                    <strong className="mt-3 block text-lg font-semibold text-[#b54f32]">{formatListingPrice(listing)}</strong>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {listing.featured ? (
                    <span className="rounded-full border border-[#e3b4a6] bg-[#fdf1ec] px-2.5 py-1 text-[11px] font-semibold text-[#8f3c28]">
                        Featured
                    </span>
                ) : null}
                {!listing.showOnWebsite ? (
                    <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold text-stone-600">
                        Website off
                    </span>
                ) : null}
                <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold text-stone-600">
                    Updated {formatAdminUpdatedAt(listing.updatedAt)}
                </span>
            </div>

            <div className="mt-5 grid gap-2">
                <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                    <span>Status</span>
                    <select
                        value={listing.status}
                        onChange={(event) => onStatusChange(listing.id, event.target.value as ListingStatus)}
                        className="h-11 rounded-full border border-stone-200 bg-stone-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#b54f32] focus:bg-white focus:ring-4 focus:ring-[#b54f32]/8"
                    >
                        {listingStatusOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="grid grid-cols-3 gap-2">
                    <button
                        type="button"
                        onClick={() => onView(listing)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-stone-300 px-3 py-2.5 text-[13px] font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                    >
                        <EyeIcon className="h-3.5 w-3.5" />
                        View
                    </button>
                    <NavLink
                        to={`/admin/listings/${listing.id}/edit`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-stone-300 px-3 py-2.5 text-[13px] font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                    >
                        <PencilIcon className="h-3.5 w-3.5" />
                        Edit
                    </NavLink>
                    <button
                        type="button"
                        onClick={() => onDelete(listing)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-stone-300 px-3 py-2.5 text-[13px] font-semibold text-slate-900 transition hover:border-[#b54f32] hover:text-[#8f3c28]"
                    >
                        <TrashIcon className="h-3.5 w-3.5" />
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
}
