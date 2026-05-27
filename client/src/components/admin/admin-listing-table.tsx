import { formatAdminUpdatedAt, formatListingPrice } from "../../modules/site-data/listing-helpers";
import type { Listing, ListingStatus } from "../../modules/site-data/site-data.types";
import { listingCategoryMeta } from "../listings/listing-meta";
import { AdminListingQuickActions } from "./admin-listing-quick-actions";
import { ListingStatusBadge } from "./listing-status-badge";

interface AdminListingTableProps {
    listings: Listing[];
    onView: (listing: Listing) => void;
    onDelete: (listing: Listing) => void;
    onStatusChange: (listingId: string, status: ListingStatus) => void;
    onToggleFeatured: (listing: Listing) => void;
    onToggleVisibility: (listing: Listing) => void;
    onDuplicate: (listing: Listing) => void;
}

export function AdminListingTable({
    listings,
    onView,
    onDelete,
    onStatusChange,
    onToggleFeatured,
    onToggleVisibility,
    onDuplicate
}: AdminListingTableProps) {
    return (
        <div className="overflow-hidden rounded-[1.45rem] border border-stone-200/85 bg-white/96 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-stone-200/80 bg-stone-50/85 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                            <th className="px-4 py-3.5">Listing</th>
                            <th className="px-4 py-3.5">Price</th>
                            <th className="px-4 py-3.5">Status</th>
                            <th className="px-4 py-3.5">Updated</th>
                            <th className="px-4 py-3.5">Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listings.map((listing) => {
                            const category = listingCategoryMeta[listing.category];

                            return (
                                <tr key={listing.id} className="border-b border-stone-200/75 align-top transition hover:bg-stone-50/45 last:border-b-0">
                                    <td className="px-4 py-3.5">
                                        <div className="flex min-w-[23rem] items-start gap-3">
                                            <img
                                                src={listing.mainImage}
                                                alt={listing.title}
                                                className="h-14 w-[4.5rem] rounded-[0.95rem] object-cover"
                                            />
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <strong className="text-[14px] font-semibold leading-tight text-slate-950">
                                                        {listing.title}
                                                    </strong>
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-stone-50/80 px-2 py-1 text-[10px] font-semibold text-slate-700">
                                                        <category.Icon className="h-3.5 w-3.5 text-stone-500" />
                                                        {category.label}
                                                    </span>
                                                    {listing.featured ? (
                                                        <span className="rounded-full border border-[#e3b4a6] bg-[#fdf1ec] px-2 py-1 text-[10px] font-semibold text-[#8f3c28]">
                                                            Featured
                                                        </span>
                                                    ) : null}
                                                    {!listing.showOnWebsite ? (
                                                        <span className="rounded-full border border-stone-200/80 bg-stone-50 px-2 py-1 text-[10px] font-semibold text-stone-600">
                                                            Website off
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <p className="mt-1.5 line-clamp-2 max-w-[34rem] text-[13px] leading-5 text-slate-600">
                                                    {listing.shortDescription}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="block whitespace-nowrap text-[13px] font-semibold text-slate-950">
                                            {formatListingPrice(listing)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <ListingStatusBadge status={listing.status} />
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="block whitespace-nowrap text-[12px] text-slate-600">
                                            {formatAdminUpdatedAt(listing.updatedAt)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <AdminListingQuickActions
                                            listing={listing}
                                            layout="table"
                                            onView={onView}
                                            onDelete={onDelete}
                                            onStatusChange={onStatusChange}
                                            onToggleFeatured={onToggleFeatured}
                                            onToggleVisibility={onToggleVisibility}
                                            onDuplicate={onDuplicate}
                                        />
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
