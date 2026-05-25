import { getListingStatusLabel, listingStatusMeta } from "../../modules/site-data/listing-helpers";
import type { ListingStatus } from "../../modules/site-data/site-data.types";

interface ListingStatusBadgeProps {
    status: ListingStatus;
    className?: string;
}

export function ListingStatusBadge({ status, className = "" }: ListingStatusBadgeProps) {
    return (
        <span
            className={[
                "inline-flex rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]",
                listingStatusMeta[status].badgeClassName,
                className
            ].join(" ")}
        >
            {getListingStatusLabel(status)}
        </span>
    );
}
