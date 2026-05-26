import type { Inquiry, InquiryCreatePayload, InquiryStatus } from "@robarol/shared";

import { AppError } from "../../lib/app-error.js";
import { supabaseServiceClient } from "../../lib/supabase.js";

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

export async function createInquiry(payload: InquiryCreatePayload) {
    const { data, error } = await supabaseServiceClient
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
        })
        .select("id, listing_id, full_name, email, phone, location, message, source, status, created_at, updated_at")
        .single<InquiryRow>();

    if (error) {
        throw new AppError(500, "Unable to submit inquiry.", error.message);
    }

    return mapInquiryRow(data);
}

export async function getAdminInquiries() {
    const { data, error } = await supabaseServiceClient
        .from("inquiries")
        .select("id, listing_id, full_name, email, phone, location, message, source, status, created_at, updated_at, listings(title)")
        .order("created_at", { ascending: false });

    if (error) {
        throw new AppError(500, "Unable to load inquiries.", error.message);
    }

    return (data as InquiryRow[]).map(mapInquiryRow);
}

export async function updateInquiryStatus(inquiryId: string, status: InquiryStatus) {
    const { data, error } = await supabaseServiceClient
        .from("inquiries")
        .update({ status })
        .eq("id", inquiryId)
        .select("id, listing_id, full_name, email, phone, location, message, source, status, created_at, updated_at, listings(title)")
        .maybeSingle<InquiryRow>();

    if (error) {
        throw new AppError(500, "Unable to update inquiry.", error.message);
    }

    if (!data) {
        throw new AppError(404, "Inquiry not found.");
    }

    return mapInquiryRow(data);
}
