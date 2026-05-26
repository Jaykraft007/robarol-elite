import type { Inquiry, InquiryCreatePayload, InquiryStatus, Listing, ListingDraft, ListingInquiryLabel, ListingStatus, ListingCategory, ListingSpecs, SiteDataSnapshot } from "./site-data.types";

import { ApiError } from "../core/api-client";
import { supabase } from "../core/supabase";
import { fetchAdminSession } from "../admin-session/admin-session.service";
import { companyProfile, navigationLinks } from "./site-data.data";

interface ListingRow {
    id: string;
    title: string;
    category: ListingCategory;
    status: ListingStatus;
    price: number | string;
    short_description: string;
    main_image_url: string;
    gallery_images: string[];
    featured: boolean;
    show_on_website: boolean;
    inquiry_label: ListingInquiryLabel;
    specs: ListingSpecs | null;
    created_at: string;
    updated_at: string;
}

interface InquiryRow {
    id: string;
    listing_id: string | null;
    full_name: string;
    email: string;
    phone: string;
    location: string;
    message: string;
    source: "contact_page" | "listing_modal";
    status: InquiryStatus;
    created_at: string;
    updated_at: string;
    listings?: Array<{ title: string | null }> | null;
}

function mapListingRow(row: ListingRow): Listing {
    return {
        id: row.id,
        title: row.title,
        category: row.category,
        status: row.status,
        price: Number(row.price),
        shortDescription: row.short_description,
        mainImage: row.main_image_url,
        galleryImages: row.gallery_images ?? [],
        featured: row.featured,
        showOnWebsite: row.show_on_website,
        inquiryLabel: row.inquiry_label,
        specs: row.specs ?? {},
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

function mapListingDraft(input: Partial<ListingDraft>) {
    const payload: Record<string, unknown> = {};

    if (input.title !== undefined) payload.title = input.title;
    if (input.category !== undefined) payload.category = input.category;
    if (input.status !== undefined) payload.status = input.status;
    if (input.price !== undefined) payload.price = input.price;
    if (input.shortDescription !== undefined) payload.short_description = input.shortDescription;
    if (input.mainImage !== undefined) payload.main_image_url = input.mainImage;
    if (input.galleryImages !== undefined) payload.gallery_images = input.galleryImages;
    if (input.featured !== undefined) payload.featured = input.featured;
    if (input.showOnWebsite !== undefined) payload.show_on_website = input.showOnWebsite;
    if (input.inquiryLabel !== undefined) payload.inquiry_label = input.inquiryLabel;
    if (input.specs !== undefined) payload.specs = input.specs;

    return payload;
}

function mapInquiryRow(row: InquiryRow): Inquiry {
    return {
        id: row.id,
        listingId: row.listing_id,
        listingTitle: row.listings?.[0]?.title ?? null,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        location: row.location,
        message: row.message,
        source: row.source,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

function createApiError(statusCode: number, message: string, details?: unknown) {
    return new ApiError(statusCode, message, details);
}

function createInquiryResponse(payload: InquiryCreatePayload): Inquiry {
    const timestamp = new Date().toISOString();

    return {
        id: crypto.randomUUID(),
        listingId: payload.listingId ?? null,
        listingTitle: null,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        location: payload.location,
        message: payload.message,
        source: payload.source,
        status: "new",
        createdAt: timestamp,
        updatedAt: timestamp
    };
}

export async function fetchPublicSiteData(): Promise<SiteDataSnapshot> {
    const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("featured", { ascending: false })
        .order("updated_at", { ascending: false });

    if (error) {
        throw createApiError(500, "Unable to load listings.", error.message);
    }

    return {
        company: companyProfile,
        navigation: navigationLinks,
        listings: (data as ListingRow[]).map(mapListingRow)
    };
}

export async function fetchAdminListings() {
    await fetchAdminSession();

    const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("featured", { ascending: false })
        .order("updated_at", { ascending: false });

    if (error) {
        throw createApiError(500, "Unable to load admin listings.", error.message);
    }

    return (data as ListingRow[]).map(mapListingRow);
}

export async function createListingRecord(draft: ListingDraft) {
    await fetchAdminSession();

    const { data, error } = await supabase
        .from("listings")
        .insert(mapListingDraft(draft))
        .select("*")
        .single<ListingRow>();

    if (error) {
        throw createApiError(500, "Unable to create listing.", error.message);
    }

    return mapListingRow(data);
}

export async function updateListingRecord(listingId: string, draft: Partial<ListingDraft>) {
    await fetchAdminSession();

    const { data, error } = await supabase
        .from("listings")
        .update(mapListingDraft(draft))
        .eq("id", listingId)
        .select("*")
        .maybeSingle<ListingRow>();

    if (error) {
        throw createApiError(500, "Unable to update listing.", error.message);
    }

    if (!data) {
        throw createApiError(404, "Listing not found.");
    }

    return mapListingRow(data);
}

export async function deleteListingRecord(listingId: string) {
    await fetchAdminSession();

    const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listingId);

    if (error) {
        throw createApiError(500, "Unable to delete listing.", error.message);
    }
}

export async function updateListingRecordStatus(listingId: string, status: Listing["status"]) {
    return updateListingRecord(listingId, { status });
}

export async function createInquiryRecord(payload: InquiryCreatePayload) {
    const { error } = await supabase
        .from("inquiries")
        .insert({
            listing_id: payload.listingId ?? null,
            full_name: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            location: payload.location,
            message: payload.message,
            source: payload.source,
            status: "new"
        });

    if (error) {
        throw createApiError(500, "Unable to submit inquiry.", error.message);
    }

    return createInquiryResponse(payload);
}

export async function fetchInquiryRecords() {
    await fetchAdminSession();

    const { data, error } = await supabase
        .from("inquiries")
        .select("id, listing_id, full_name, email, phone, location, message, source, status, created_at, updated_at, listings(title)")
        .order("created_at", { ascending: false });

    if (error) {
        throw createApiError(500, "Unable to load inquiries.", error.message);
    }

    return (data as InquiryRow[]).map(mapInquiryRow);
}

export async function updateInquiryRecordStatus(inquiryId: string, status: InquiryStatus) {
    await fetchAdminSession();

    const { data, error } = await supabase
        .from("inquiries")
        .update({ status })
        .eq("id", inquiryId)
        .select("id, listing_id, full_name, email, phone, location, message, source, status, created_at, updated_at, listings(title)")
        .maybeSingle<InquiryRow>();

    if (error) {
        throw createApiError(500, "Unable to update inquiry.", error.message);
    }

    if (!data) {
        throw createApiError(404, "Inquiry not found.");
    }

    return mapInquiryRow(data);
}

export async function uploadListingImage(file: File) {
    await fetchAdminSession();

    const filePath = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${file.name.split(".").pop() || "jpg"}`;
    const { error } = await supabase.storage
        .from("listing-images")
        .upload(filePath, file, {
            contentType: file.type,
            upsert: false
        });

    if (error) {
        throw createApiError(500, "Unable to upload image.", error.message);
    }

    const { data } = supabase.storage.from("listing-images").getPublicUrl(filePath);

    return {
        path: filePath,
        url: data.publicUrl
    };
}
