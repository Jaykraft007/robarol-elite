import { useMemo } from "react";
import { NavLink, useNavigate, useParams } from "react-router";

import { ListingForm } from "../components/admin/listing-form";
import { useSiteData } from "../modules/site-data/site-data.context";
import type { ListingDraft } from "../modules/site-data/site-data.types";

export function AdminListingFormPage() {
    const { assetImages, createListing, getListingById, isLoading, loadError, updateListing } = useSiteData();
    const navigate = useNavigate();
    const { listingId } = useParams();
    const existingListing = useMemo(
        () => (listingId ? getListingById(listingId) : null),
        [getListingById, listingId]
    );
    const mode = listingId ? "edit" : "create";

    const handleSave = async (draft: ListingDraft, intent: "publish" | "draft") => {
        if (mode === "edit" && listingId) {
            await updateListing(listingId, draft);
            navigate("/admin/listings", {
                state: {
                    toast: intent === "draft" ? "Listing saved as draft." : "Listing updated successfully."
                }
            });
            return;
        }

        await createListing(draft);
        navigate("/admin/listings", {
            state: {
                toast: intent === "draft" ? "Listing saved as draft." : "Listing saved successfully."
            }
        });
    };

    if (isLoading) {
        return (
            <section className="rounded-[1.7rem] border border-stone-200 bg-white px-5 py-10 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:px-6">
                <p className="text-sm text-slate-600">Loading listing...</p>
            </section>
        );
    }

    if (loadError) {
        return (
            <section className="rounded-[1.7rem] border border-[#e3b4a6] bg-[#fdf1ec] px-5 py-10 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:px-6">
                <h2 className="font-display text-[1.8rem] text-[#8f3c28]">Unable to open listing form.</h2>
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

    if (mode === "edit" && !existingListing) {
        return (
            <section className="rounded-[1.7rem] border border-stone-200 bg-white px-5 py-10 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:px-6">
                <h2 className="font-display text-[1.8rem] text-slate-950">Listing not found.</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                    The requested listing is no longer available in this mock inventory.
                </p>
                <NavLink
                    to="/admin/listings"
                    className="mt-6 inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                >
                    Back to listings
                </NavLink>
            </section>
        );
    }

    return (
        <div className="space-y-5">
            <section className="rounded-[1.7rem] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,238,0.98))] px-5 py-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:px-6 sm:py-6">
                <h2 className="font-display text-[1.8rem] leading-tight text-slate-950">
                    {mode === "edit" ? "Edit listing" : "New listing"}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    {mode === "edit" ? "Update the essentials and photos." : "Add the essentials and photos."}
                </p>
            </section>

            <ListingForm
                mode={mode}
                initialListing={existingListing ?? undefined}
                assetImages={assetImages}
                onCancel={() => navigate("/admin/listings")}
                onSave={handleSave}
            />
        </div>
    );
}
