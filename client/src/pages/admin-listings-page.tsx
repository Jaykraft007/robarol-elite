import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";

import { AdminListingCard } from "../components/admin/admin-listing-card";
import { AdminListingTable } from "../components/admin/admin-listing-table";
import { DeleteConfirmModal } from "../components/admin/delete-confirm-modal";
import { ListingDetailsModal } from "../components/listings/listing-details-modal";
import { PlusIcon, SearchIcon } from "../components/ui/site-icon";
import { getListingStatusLabel, listingCategoryOptions, listingStatusOptions } from "../modules/site-data/listing-helpers";
import { useSiteData } from "../modules/site-data/site-data.context";
import type { Listing, ListingCategory, ListingDraft, ListingStatus } from "../modules/site-data/site-data.types";

type FilterCategory = "all" | ListingCategory;
type FilterStatus = "all" | ListingStatus;

function createDuplicateDraft(listing: Listing): ListingDraft {
    return {
        title: `${listing.title} Copy`,
        category: listing.category,
        status: "hidden",
        price: listing.price,
        shortDescription: listing.shortDescription,
        mainImage: listing.mainImage,
        galleryImages: listing.galleryImages,
        featured: false,
        showOnWebsite: false,
        inquiryLabel: listing.inquiryLabel,
        specs: listing.specs
    };
}

export function AdminListingsPage() {
    const {
        allListings,
        inquiries,
        deleteListing,
        loadAdminInquiries,
        loadError,
        createListing,
        updateListing,
        updateListingStatus
    } = useSiteData();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all");
    const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("all");
    const [activeListing, setActiveListing] = useState<Listing | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        void loadAdminInquiries().catch(() => undefined);
    }, [loadAdminInquiries]);

    useEffect(() => {
        const toast = (location.state as { toast?: string } | null)?.toast;

        if (!toast) {
            return;
        }

        setToastMessage(toast);
        navigate(location.pathname, { replace: true, state: null });
    }, [location.pathname, location.state, navigate]);

    useEffect(() => {
        if (!toastMessage) {
            return;
        }

        const timeoutId = window.setTimeout(() => setToastMessage(null), 2800);

        return () => window.clearTimeout(timeoutId);
    }, [toastMessage]);

    const filteredListings = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return [...allListings]
            .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
            .filter((listing) => {
                if (selectedCategory !== "all" && listing.category !== selectedCategory) {
                    return false;
                }

                if (selectedStatus !== "all" && listing.status !== selectedStatus) {
                    return false;
                }

                if (!normalizedSearch) {
                    return true;
                }

                return [
                    listing.title,
                    listing.shortDescription,
                    listing.category,
                    getListingStatusLabel(listing.status)
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(normalizedSearch);
            });
    }, [allListings, searchTerm, selectedCategory, selectedStatus]);

    const listingStats = useMemo(() => ({
        live: allListings.filter((listing) => listing.showOnWebsite && listing.status !== "hidden").length,
        inquiries: inquiries.length,
        hidden: allListings.filter((listing) => listing.status === "hidden" || !listing.showOnWebsite).length,
        featured: allListings.filter((listing) => listing.featured).length
    }), [allListings, inquiries.length]);

    const handleStatusChange = async (listingId: string, status: ListingStatus) => {
        await updateListingStatus(listingId, status);
        setToastMessage(`Status updated to ${getListingStatusLabel(status)}.`);
    };

    const handleToggleFeatured = async (listing: Listing) => {
        await updateListing(listing.id, { featured: !listing.featured });
        setToastMessage(listing.featured ? "Removed from featured." : "Marked as featured.");
    };

    const handleToggleVisibility = async (listing: Listing) => {
        await updateListing(listing.id, { showOnWebsite: !listing.showOnWebsite });
        setToastMessage(listing.showOnWebsite ? "Website visibility turned off." : "Website visibility turned on.");
    };

    const handleDuplicate = async (listing: Listing) => {
        await createListing(createDuplicateDraft(listing));
        setToastMessage("Listing duplicated as hidden draft.");
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) {
            return;
        }

        await deleteListing(deleteTarget.id);
        setToastMessage("Listing deleted.");
        setDeleteTarget(null);
        setActiveListing((current) => (current?.id === deleteTarget.id ? null : current));
    };

    const hasListings = allListings.length > 0;

    if (loadError) {
        return (
            <section className="rounded-[1.55rem] border border-[#e3b4a6] bg-[#fdf1ec] px-5 py-8 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
                <h2 className="font-hero-display text-[1.5rem] leading-tight text-[#8f3c28]">Unable to load admin listings.</h2>
                <p className="mt-2.5 max-w-2xl text-sm leading-6 text-[#8f3c28]">
                    {loadError}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                    <NavLink
                        to="/admin/login"
                        className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(181,79,50,0.18)] transition hover:brightness-[0.96]"
                    >
                        Sign in again
                    </NavLink>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center rounded-full border border-[#d9a595] bg-white px-5 py-2.5 text-sm font-semibold text-[#8f3c28] transition hover:bg-[#fff7f3]"
                    >
                        Reload
                    </button>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="rounded-[1.55rem] border border-stone-200/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,238,0.97))] px-4 py-4 shadow-[0_14px_34px_rgba(15,23,42,0.05)] sm:px-5 sm:py-5">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                                Inventory Control
                            </p>
                            <h2 className="font-hero-display mt-1.5 text-[1.45rem] leading-tight text-slate-950 sm:text-[1.7rem]">
                                Listings
                            </h2>
                            <p className="mt-1 text-sm text-slate-600">
                                Showing {filteredListings.length} of {allListings.length} listings.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <div className="rounded-full border border-[#e3b4a6] bg-[#fdf1ec] px-3.5 py-2 text-sm text-[#8f3c28] shadow-[0_8px_18px_rgba(181,79,50,0.08)]">
                                <span className="font-semibold">{listingStats.live}</span> live
                            </div>
                            <div className="rounded-full border border-stone-300 bg-white px-3.5 py-2 text-sm text-slate-700">
                                <span className="font-semibold text-slate-950">{listingStats.inquiries}</span> inquiries
                            </div>
                            <div className="rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-500">
                                <span className="font-semibold text-slate-950">{listingStats.featured}</span> featured
                            </div>
                            <div className="rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-500">
                                <span className="font-semibold text-slate-950">{listingStats.hidden}</span> hidden
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_12rem_11rem_auto] xl:items-center">
                        <label className="relative min-w-0">
                            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search listings"
                                className="h-11 w-full rounded-full border border-stone-200 bg-white pl-10 pr-4 text-sm text-slate-950 outline-none transition focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8"
                            />
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(event) => setSelectedCategory(event.target.value as FilterCategory)}
                            className="h-11 rounded-full border border-stone-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8"
                        >
                            <option value="all">All categories</option>
                            {listingCategoryOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedStatus}
                            onChange={(event) => setSelectedStatus(event.target.value as FilterStatus)}
                            className="h-11 rounded-full border border-stone-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8"
                        >
                            <option value="all">All status</option>
                            {listingStatusOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                        <NavLink
                            to="/admin/listings/new"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b54f32] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(181,79,50,0.16)] transition hover:-translate-y-0.5 hover:brightness-[0.97]"
                        >
                            <PlusIcon className="h-4 w-4" />
                            Add Listing
                        </NavLink>
                    </div>
                </div>
            </section>

            <section className="mt-4 sm:mt-5">
                {filteredListings.length > 0 ? (
                    <>
                        <div className="hidden xl:block">
                            <AdminListingTable
                                listings={filteredListings}
                                onView={setActiveListing}
                                onDelete={setDeleteTarget}
                                onStatusChange={(listingId, status) => {
                                    void handleStatusChange(listingId, status);
                                }}
                                onToggleFeatured={(listing) => {
                                    void handleToggleFeatured(listing);
                                }}
                                onToggleVisibility={(listing) => {
                                    void handleToggleVisibility(listing);
                                }}
                                onDuplicate={(listing) => {
                                    void handleDuplicate(listing);
                                }}
                            />
                        </div>
                        <div className="grid gap-3 xl:hidden">
                            {filteredListings.map((listing) => (
                                <AdminListingCard
                                    key={listing.id}
                                    listing={listing}
                                    onView={setActiveListing}
                                    onDelete={setDeleteTarget}
                                    onStatusChange={(listingId, status) => {
                                        void handleStatusChange(listingId, status);
                                    }}
                                    onToggleFeatured={(item) => {
                                        void handleToggleFeatured(item);
                                    }}
                                    onToggleVisibility={(item) => {
                                        void handleToggleVisibility(item);
                                    }}
                                    onDuplicate={(item) => {
                                        void handleDuplicate(item);
                                    }}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="rounded-[1.5rem] border border-stone-200/85 bg-white/96 px-5 py-8 text-center shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
                        <h2 className="font-hero-display text-[1.45rem] leading-tight text-slate-950">
                            {hasListings ? "No listings in this view." : "No listings yet."}
                        </h2>
                        <p className="mx-auto mt-2.5 max-w-lg text-sm leading-6 text-slate-600">
                            {hasListings
                                ? "Try a different search or filter."
                                : "Add the first listing to start managing your inventory."}
                        </p>
                        {!hasListings ? (
                            <NavLink
                                to="/admin/listings/new"
                                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#b54f32] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(181,79,50,0.16)] transition hover:brightness-[0.97]"
                            >
                                <PlusIcon className="h-4 w-4" />
                                Add Listing
                            </NavLink>
                        ) : null}
                    </div>
                )}
            </section>

            <ListingDetailsModal
                listing={activeListing}
                onClose={() => setActiveListing(null)}
                onEnquire={() => setActiveListing(null)}
                showInquiryActions={false}
            />

            {deleteTarget ? (
                <DeleteConfirmModal
                    title="Delete listing?"
                    message="This will remove the listing from the admin inventory and public website."
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={() => {
                        void handleDeleteConfirm();
                    }}
                />
            ) : null}

            {toastMessage ? (
                <div className="fixed bottom-5 right-5 z-50 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_16px_32px_rgba(15,23,42,0.12)]">
                    {toastMessage}
                </div>
            ) : null}
        </>
    );
}
