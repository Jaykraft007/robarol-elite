import type { Inquiry, InquiryCreatePayload, InquiryStatus, Listing, ListingDraft, SiteDataSnapshot } from "./site-data.types";

import { apiFetch } from "../core/api-client";
import { companyProfile, navigationLinks } from "./site-data.data";

export async function fetchPublicSiteData(): Promise<SiteDataSnapshot> {
    const listings = await apiFetch<Listing[]>("/api/listings");

    return {
        company: companyProfile,
        navigation: navigationLinks,
        listings
    };
}

export async function fetchAdminListings() {
    return apiFetch<Listing[]>("/api/admin/listings");
}

export function createListingRecord(draft: ListingDraft) {
    return apiFetch<Listing>("/api/admin/listings", {
        method: "POST",
        body: draft
    });
}

export function updateListingRecord(listingId: string, draft: Partial<ListingDraft>) {
    return apiFetch<Listing>(`/api/admin/listings/${listingId}`, {
        method: "PATCH",
        body: draft
    });
}

export async function deleteListingRecord(listingId: string) {
    await apiFetch<void>(`/api/admin/listings/${listingId}`, {
        method: "DELETE"
    });
}

export function updateListingRecordStatus(listingId: string, status: Listing["status"]) {
    return apiFetch<Listing>(`/api/admin/listings/${listingId}`, {
        method: "PATCH",
        body: { status }
    });
}

export function createInquiryRecord(payload: InquiryCreatePayload) {
    return apiFetch<Inquiry>("/api/inquiries", {
        method: "POST",
        body: payload
    });
}

export function fetchInquiryRecords() {
    return apiFetch<Inquiry[]>("/api/admin/inquiries");
}

export function updateInquiryRecordStatus(inquiryId: string, status: InquiryStatus) {
    return apiFetch<Inquiry>(`/api/admin/inquiries/${inquiryId}`, {
        method: "PATCH",
        body: { status }
    });
}

export async function uploadListingImage(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    return apiFetch<{ path: string; url: string }>("/api/admin/uploads", {
        method: "POST",
        body: formData
    });
}
