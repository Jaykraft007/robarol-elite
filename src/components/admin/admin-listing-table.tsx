import { NavLink } from "react-router";

import { formatAdminUpdatedAt, formatListingPrice, listingStatusOptions } from "../../modules/site-data/listing-helpers";
import type { Listing, ListingStatus } from "../../modules/site-data/site-data.types";
import { listingCategoryMeta } from "../listings/listing-meta";
import { EyeIcon, PencilIcon, TrashIcon } from "../ui/site-icon";
import { ListingStatusBadge } from "./listing-status-badge";

interface AdminListingTableProps {
    listings: Listing[];
    onView: (listing: Listing) => void;
    onDelete: (listing: Listing) => void;
    onStatusChange: (listingId: string, status: ListingStatus) => void;
}

export function AdminListingTable({ listings, onView, onDelete, onStatusChange }: AdminListingTableProps) {
    return (
        <div className="overflow-hidden rounded-[1.6rem] border border-stone-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-stone-200 bg-stone-50/90 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                            <th className="px-5 py-4">Image</th>
                            <th className="px-5 py-4">Listing</th>
                            <th className="px-5 py-4">Category</th>
                            <th className="px-5 py-4">Price</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Updated</th>
                            <th className="px-5 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listings.map((listing) => {
                            const category = listingCategoryMeta[listing.category];

                            return (
                                <tr key={listing.id} className="border-b border-stone-200/80 align-top last:border-b-0">
                                    <td className="px-5 py-4">
                                        <img
                                            src={listing.mainImage}
                                            alt={listing.title}
                                            className="h-16 w-20 rounded-[1rem] object-cover"
                                        />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="min-w-[16rem]">
                                            <strong className="block text-sm text-slate-950">{listing.title}</strong>
                                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{listing.shortDescription}</p>
                                            <div className="mt-3 flex flex-wrap gap-2">
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
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center gap-2 text-sm text-slate-700">
                                            <category.Icon className="h-4 w-4 text-stone-500" />
                                            {category.label}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-950">{formatListingPrice(listing)}</td>
                                    <td className="px-5 py-4">
                                        <ListingStatusBadge status={listing.status} />
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-600">{formatAdminUpdatedAt(listing.updatedAt)}</td>
                                    <td className="px-5 py-4">
                                        <div className="min-w-[12rem] space-y-3">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onView(listing)}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-3 py-2 text-[12px] font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                                                >
                                                    <EyeIcon className="h-3.5 w-3.5" />
                                                    View
                                                </button>
                                                <NavLink
                                                    to={`/admin/listings/${listing.id}/edit`}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-3 py-2 text-[12px] font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                                                >
                                                    <PencilIcon className="h-3.5 w-3.5" />
                                                    Edit
                                                </NavLink>
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(listing)}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-3 py-2 text-[12px] font-semibold text-slate-900 transition hover:border-[#b54f32] hover:text-[#8f3c28]"
                                                >
                                                    <TrashIcon className="h-3.5 w-3.5" />
                                                    Delete
                                                </button>
                                            </div>
                                            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                                                <span>Status</span>
                                                <select
                                                    value={listing.status}
                                                    onChange={(event) => onStatusChange(listing.id, event.target.value as ListingStatus)}
                                                    className="h-10 rounded-full border border-stone-200 bg-stone-50 px-3 text-sm text-slate-900 outline-none transition focus:border-[#b54f32] focus:bg-white focus:ring-4 focus:ring-[#b54f32]/8"
                                                >
                                                    {listingStatusOptions.map((item) => (
                                                        <option key={item.value} value={item.value}>
                                                            {item.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
