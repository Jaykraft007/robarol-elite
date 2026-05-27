import { formatAdminUpdatedAt, formatListingPrice } from "../../modules/site-data/listing-helpers";
import type { Listing, ListingStatus } from "../../modules/site-data/site-data.types";
import { listingCategoryMeta } from "../listings/listing-meta";
import { AdminListingQuickActions } from "./admin-listing-quick-actions";
import { ListingStatusBadge } from "./listing-status-badge";

interface AdminListingCardProps {
    listing: Listing;
    onView: (listing: Listing) => void;
    onDelete: (listing: Listing) => void;
    onStatusChange: (listingId: string, status: ListingStatus) => void;
    onToggleFeatured: (listing: Listing) => void;
    onToggleVisibility: (listing: Listing) => void;
    onDuplicate: (listing: Listing) => void;
}

export function AdminListingCard({
    listing,
    onView,
    onDelete,
    onStatusChange,
    onToggleFeatured,
    onToggleVisibility,
    onDuplicate
}: AdminListingCardProps) {
    const category = listingCategoryMeta[listing.category];

    return (
        <article className="rounded-[1.35rem] border border-stone-200/85 bg-white/96 p-3.5 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition duration-300 ease-out hover:shadow-[0_16px_32px_rgba(15,23,42,0.07)] sm:p-4">
            <div className="flex items-start gap-3">
                <img
                    src={listing.mainImage}
                    alt={listing.title}
                    className="h-24 w-[6.15rem] rounded-[1rem] object-cover"
                />
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-stone-50/80 px-2 py-1 text-[10px] font-semibold text-slate-700">
                            <category.Icon className="h-3.5 w-3.5 text-stone-500" />
                            {category.label}
                        </span>
                        <ListingStatusBadge status={listing.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold leading-tight text-slate-950">{listing.title}</h3>
                        {listing.featured ? (
                            <span className="rounded-full border border-[#e3b4a6] bg-[#fdf1ec] px-2 py-1 text-[10px] font-semibold text-[#8f3c28]">
                                Featured
                            </span>
                        ) : null}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-slate-600">{listing.shortDescription}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <strong className="text-[15px] font-semibold text-slate-950">{formatListingPrice(listing)}</strong>
                        {!listing.showOnWebsite ? (
                            <span className="rounded-full border border-stone-200/80 bg-stone-50 px-2 py-1 text-[10px] font-semibold text-stone-600">
                                Website off
                            </span>
                        ) : null}
                        <span className="text-[11px] text-stone-500">Updated {formatAdminUpdatedAt(listing.updatedAt)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-3.5">
                <AdminListingQuickActions
                    listing={listing}
                    layout="card"
                    onView={onView}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                    onToggleFeatured={onToggleFeatured}
                    onToggleVisibility={onToggleVisibility}
                    onDuplicate={onDuplicate}
                />
            </div>
        </article>
    );
}
