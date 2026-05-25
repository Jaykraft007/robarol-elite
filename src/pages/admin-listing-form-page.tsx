import { useMemo } from "react";
import { NavLink, useNavigate, useParams } from "react-router";

import { ListingForm } from "../components/admin/listing-form";
import { useSiteData } from "../modules/site-data/site-data.context";
import type { ListingDraft } from "../modules/site-data/site-data.types";

export function AdminListingFormPage() {
    const { assetImages, createListing, getListingById, updateListing } = useSiteData();
    const navigate = useNavigate();
    const { listingId } = useParams();
    const existingListing = useMemo(
        () => (listingId ? getListingById(listingId) : null),
        [getListingById, listingId]
    );
    const mode = listingId ? "edit" : "create";

    const handleSave = (draft: ListingDraft, intent: "publish" | "draft") => {
        if (mode === "edit" && listingId) {
            updateListing(listingId, draft);
            navigate("/admin/listings", {
                state: {
                    toast: intent === "draft" ? "Listing saved as draft." : "Listing updated successfully."
                }
            });
            return;
        }

        createListing(draft);
        navigate("/admin/listings", {
            state: {
                toast: intent === "draft" ? "Listing saved as draft." : "Listing saved successfully."
            }
        });
    };

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
            <section className="rounded-[1.7rem] border border-stone-200 bg-white px-5 py-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:px-6 sm:py-6">
                <h2 className="font-display text-[1.8rem] leading-tight text-slate-950">
                    {mode === "edit" ? "Edit listing" : "Add listing"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    {mode === "edit"
                        ? "Update this listing and sync the website preview."
                        : "Add a new car, yacht or property to the public inventory."}
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
