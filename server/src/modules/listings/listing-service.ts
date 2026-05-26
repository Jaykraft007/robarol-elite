import type { Listing, ListingDraft, ListingInquiryLabel, ListingStatus, ListingCategory, ListingSpecs } from "@robarol/shared";

import { AppError } from "../../lib/app-error.js";
import { supabasePublicClient, supabaseServiceClient } from "../../lib/supabase.js";

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

export async function getPublicListings() {
    const { data, error } = await supabasePublicClient
        .from("listings")
        .select("*")
        .order("featured", { ascending: false })
        .order("updated_at", { ascending: false });

    if (error) {
        throw new AppError(500, "Unable to load listings.", error.message);
    }

    return (data as ListingRow[]).map(mapListingRow);
}

export async function getPublicListingById(listingId: string) {
    const { data, error } = await supabasePublicClient
        .from("listings")
        .select("*")
        .eq("id", listingId)
        .maybeSingle<ListingRow>();

    if (error) {
        throw new AppError(500, "Unable to load listing.", error.message);
    }

    return data ? mapListingRow(data) : null;
}

export async function getAdminListings() {
    const { data, error } = await supabaseServiceClient
        .from("listings")
        .select("*")
        .order("featured", { ascending: false })
        .order("updated_at", { ascending: false });

    if (error) {
        throw new AppError(500, "Unable to load admin listings.", error.message);
    }

    return (data as ListingRow[]).map(mapListingRow);
}

export async function createListing(input: ListingDraft) {
    const { data, error } = await supabaseServiceClient
        .from("listings")
        .insert(mapListingDraft(input))
        .select("*")
        .single<ListingRow>();

    if (error) {
        throw new AppError(500, "Unable to create listing.", error.message);
    }

    return mapListingRow(data);
}

export async function updateListing(listingId: string, input: Partial<ListingDraft>) {
    const { data, error } = await supabaseServiceClient
        .from("listings")
        .update(mapListingDraft(input))
        .eq("id", listingId)
        .select("*")
        .maybeSingle<ListingRow>();

    if (error) {
        throw new AppError(500, "Unable to update listing.", error.message);
    }

    if (!data) {
        throw new AppError(404, "Listing not found.");
    }

    return mapListingRow(data);
}

export async function deleteListing(listingId: string) {
    const { error } = await supabaseServiceClient
        .from("listings")
        .delete()
        .eq("id", listingId);

    if (error) {
        throw new AppError(500, "Unable to delete listing.", error.message);
    }
}
