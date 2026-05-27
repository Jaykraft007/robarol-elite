import { NavLink } from "react-router";

import { listingStatusOptions } from "../../modules/site-data/listing-helpers";
import type { Listing, ListingStatus } from "../../modules/site-data/site-data.types";
import { CopyIcon, EyeIcon, EyeOffIcon, PencilIcon, StarIcon, TrashIcon } from "../ui/site-icon";

interface AdminListingQuickActionsProps {
    listing: Listing;
    layout?: "table" | "card";
    onView: (listing: Listing) => void;
    onDelete: (listing: Listing) => void;
    onStatusChange: (listingId: string, status: ListingStatus) => void;
    onToggleFeatured: (listing: Listing) => void;
    onToggleVisibility: (listing: Listing) => void;
    onDuplicate: (listing: Listing) => void;
}

function actionButtonClassName(layout: "table" | "card", accent: "default" | "feature" | "danger" = "default") {
    const sizeClassName = layout === "table"
        ? "h-[2.125rem] w-[2.125rem]"
        : "h-[2.375rem] w-[2.375rem]";

    const accentClassName = accent === "feature"
        ? "border-[#e3b4a6] bg-[#fdf1ec] text-[#8f3c28] hover:border-[#b54f32]"
        : accent === "danger"
            ? "border-stone-300 text-slate-900 hover:border-[#b54f32] hover:text-[#8f3c28]"
            : "border-stone-300 text-slate-900 hover:border-slate-950 hover:bg-stone-50";

    return [
        "inline-flex items-center justify-center rounded-full border bg-white transition duration-300 ease-out hover:-translate-y-0.5",
        sizeClassName,
        accentClassName
    ].join(" ");
}

interface QuickActionButtonProps {
    ariaLabel: string;
    children: React.ReactNode;
    className: string;
    tooltip: string;
    title?: string;
    onClick?: () => void;
    to?: string;
}

function QuickActionButton({ ariaLabel, children, className, tooltip, title, onClick, to }: QuickActionButtonProps) {
    const content = (
        <>
            {children}
            <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-900 opacity-0 shadow-[0_12px_24px_rgba(15,23,42,0.12)] transition duration-200 group-hover/action:opacity-100 group-focus-within/action:opacity-100">
                {tooltip}
            </span>
        </>
    );

    return (
        <span className="group/action relative inline-flex">
            {to ? (
                <NavLink
                    to={to}
                    className={className}
                    title={title ?? tooltip}
                    aria-label={ariaLabel}
                >
                    {content}
                </NavLink>
            ) : (
                <button
                    type="button"
                    onClick={onClick}
                    className={className}
                    title={title ?? tooltip}
                    aria-label={ariaLabel}
                >
                    {content}
                </button>
            )}
        </span>
    );
}

export function AdminListingQuickActions({
    listing,
    layout = "table",
    onView,
    onDelete,
    onStatusChange,
    onToggleFeatured,
    onToggleVisibility,
    onDuplicate
}: AdminListingQuickActionsProps) {
    return (
        <div className={layout === "table" ? "grid gap-2.5" : "grid gap-3"}>
            <div className="flex flex-wrap items-center gap-1.5">
                <QuickActionButton
                    ariaLabel={`Preview ${listing.title}`}
                    className={actionButtonClassName(layout)}
                    tooltip="Preview"
                    onClick={() => onView(listing)}
                >
                    <EyeIcon className="h-3.5 w-3.5" />
                </QuickActionButton>
                <QuickActionButton
                    ariaLabel={`Edit ${listing.title}`}
                    className={actionButtonClassName(layout)}
                    tooltip="Edit"
                    to={`/admin/listings/${listing.id}/edit`}
                >
                    <PencilIcon className="h-3.5 w-3.5" />
                </QuickActionButton>
                <QuickActionButton
                    ariaLabel={listing.featured ? `Remove ${listing.title} from featured` : `Mark ${listing.title} as featured`}
                    className={actionButtonClassName(layout, listing.featured ? "feature" : "default")}
                    tooltip={listing.featured ? "Remove featured" : "Mark as featured"}
                    onClick={() => onToggleFeatured(listing)}
                >
                    <StarIcon className="h-3.5 w-3.5" />
                </QuickActionButton>
                <QuickActionButton
                    ariaLabel={listing.showOnWebsite ? `Hide ${listing.title} from website` : `Show ${listing.title} on website`}
                    className={actionButtonClassName(layout)}
                    tooltip={listing.showOnWebsite ? "Hide from website" : "Show on website"}
                    onClick={() => onToggleVisibility(listing)}
                >
                    {listing.showOnWebsite ? <EyeOffIcon className="h-3.5 w-3.5" /> : <EyeIcon className="h-3.5 w-3.5" />}
                </QuickActionButton>
                <QuickActionButton
                    ariaLabel={`Duplicate ${listing.title}`}
                    className={actionButtonClassName(layout)}
                    tooltip="Duplicate"
                    onClick={() => onDuplicate(listing)}
                >
                    <CopyIcon className="h-3.5 w-3.5" />
                </QuickActionButton>
                <QuickActionButton
                    ariaLabel={`Delete ${listing.title}`}
                    className={actionButtonClassName(layout, "danger")}
                    tooltip="Delete"
                    onClick={() => onDelete(listing)}
                >
                    <TrashIcon className="h-3.5 w-3.5" />
                </QuickActionButton>
            </div>

            <label className={layout === "table" ? "grid gap-1" : "grid gap-1.5"}>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Status
                </span>
                <select
                    value={listing.status}
                    onChange={(event) => onStatusChange(listing.id, event.target.value as ListingStatus)}
                    className={[
                        "rounded-full border border-stone-200 bg-stone-50 text-slate-900 outline-none transition focus:border-[#b54f32] focus:bg-white focus:ring-4 focus:ring-[#b54f32]/8",
                        layout === "table"
                            ? "h-9 min-w-[10rem] px-3 text-[13px]"
                            : "h-10 px-3.5 text-sm"
                    ].join(" ")}
                >
                    {listingStatusOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}
