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
                "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                listingStatusMeta[status].badgeClassName,
                className
            ].join(" ")}
        >
            {getListingStatusLabel(status)}
        </span>
    );
}
