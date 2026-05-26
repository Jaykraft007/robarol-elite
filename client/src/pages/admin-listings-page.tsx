import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";

import { AdminListingCard } from "../components/admin/admin-listing-card";
import { AdminListingTable } from "../components/admin/admin-listing-table";
import { DeleteConfirmModal } from "../components/admin/delete-confirm-modal";
import { ListingDetailsModal } from "../components/listings/listing-details-modal";
import { SearchIcon } from "../components/ui/site-icon";
import { listingCategoryOptions, getListingStatusLabel, listingStatusOptions } from "../modules/site-data/listing-helpers";
import { useSiteData } from "../modules/site-data/site-data.context";
import type { Listing, ListingCategory, ListingStatus } from "../modules/site-data/site-data.types";

type FilterCategory = "all" | ListingCategory;
type FilterStatus = "all" | ListingStatus;

export function AdminListingsPage() {
    const { allListings, deleteListing, loadError, updateListingStatus } = useSiteData();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all");
    const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("all");
    const [activeListing, setActiveListing] = useState<Listing | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

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
        total: allListings.length,
        live: allListings.filter((listing) => listing.showOnWebsite && listing.status !== "hidden").length,
        featured: allListings.filter((listing) => listing.featured).length,
        hidden: allListings.filter((listing) => listing.status === "hidden" || !listing.showOnWebsite).length
    }), [allListings]);

    const handleStatusChange = async (listingId: string, status: ListingStatus) => {
        await updateListingStatus(listingId, status);
        setToastMessage(`Status updated to ${getListingStatusLabel(status)}.`);
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
            <section className="rounded-[1.7rem] border border-[#e3b4a6] bg-[#fdf1ec] px-5 py-10 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:px-6">
                <h2 className="font-display text-[1.8rem] text-[#8f3c28]">Unable to load admin listings.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#8f3c28]">
                    {loadError}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <NavLink
                        to="/admin/login"
                        className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(181,79,50,0.18)] transition hover:brightness-[0.96]"
                    >
                        Sign in again
                    </NavLink>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center rounded-full border border-[#d9a595] bg-white px-5 py-3 text-sm font-semibold text-[#8f3c28] transition hover:bg-[#fff7f3]"
                    >
                        Reload
                    </button>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="rounded-[1.7rem] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,238,0.98))] px-5 py-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:px-6 sm:py-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                        <h2 className="font-display text-[1.8rem] leading-tight text-slate-950">Listings</h2>
                        <p className="mt-2 text-sm text-slate-600">Clean control for every listing.</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-500">
                            <span className="font-semibold text-slate-950">{listingStats.total}</span> total
                        </div>
                        <div className="rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-500">
                            <span className="font-semibold text-slate-950">{listingStats.live}</span> live
                        </div>
                        <div className="rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-500">
                            <span className="font-semibold text-slate-950">{listingStats.featured}</span> featured
                        </div>
                        <div className="rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-500">
                            <span className="font-semibold text-slate-950">{listingStats.hidden}</span> hidden
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 xl:min-w-[44rem] xl:flex-row">
                        <label className="relative min-w-0 flex-1">
                            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search listings"
                                className="h-12 w-full rounded-full border border-stone-200 bg-stone-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-[#b54f32] focus:bg-white focus:ring-4 focus:ring-[#b54f32]/8"
                            />
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(event) => setSelectedCategory(event.target.value as FilterCategory)}
                            className="h-12 rounded-full border border-stone-200 bg-stone-50 px-4 text-sm text-slate-950 outline-none transition focus:border-[#b54f32] focus:bg-white focus:ring-4 focus:ring-[#b54f32]/8"
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
                            className="h-12 rounded-full border border-stone-200 bg-stone-50 px-4 text-sm text-slate-950 outline-none transition focus:border-[#b54f32] focus:bg-white focus:ring-4 focus:ring-[#b54f32]/8"
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
                            className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(181,79,50,0.18)] transition hover:brightness-[0.96]"
                        >
                            Add Listing
                        </NavLink>
                </div>
            </section>

            <section className="mt-5">
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
                            />
                        </div>
                        <div className="grid gap-4 xl:hidden">
                            {filteredListings.map((listing) => (
                                <AdminListingCard
                                    key={listing.id}
                                    listing={listing}
                                    onView={setActiveListing}
                                    onDelete={setDeleteTarget}
                                    onStatusChange={(listingId, status) => {
                                        void handleStatusChange(listingId, status);
                                    }}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="rounded-[1.7rem] border border-stone-200 bg-white px-5 py-10 text-center shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:px-6">
                        <h2 className="font-display text-[1.7rem] text-slate-950">
                            {hasListings ? "No listings in this view." : "No listings yet."}
                        </h2>
                        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-600">
                            {hasListings
                                ? "Try a different search or filter."
                                : "Add the first listing to get started."}
                        </p>
                        {!hasListings ? (
                            <NavLink
                                to="/admin/listings/new"
                                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#b54f32] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(181,79,50,0.18)] transition hover:brightness-[0.96]"
                            >
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
                    message="This will remove the listing from the admin preview and public website mock data."
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={() => {
                        void handleDeleteConfirm();
                    }}
                />
            ) : null}

            {toastMessage ? (
                <div className="fixed bottom-5 right-5 z-50 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
                    {toastMessage}
                </div>
            ) : null}
        </>
    );
}
