import { useMemo, useState } from "react";

import {
    buildInquiryTemplatePreview,
    inquiryLabelOptions,
    listingStatusOptions
} from "../../modules/site-data/listing-helpers";
import type {
    Listing,
    ListingCategory,
    ListingDraft,
    ListingInquiryLabel,
    ListingSpecs,
    ListingStatus
} from "../../modules/site-data/site-data.types";
import { ListingImageUploader } from "./listing-image-uploader";

type SaveIntent = "publish" | "draft";

interface ListingFormProps {
    mode: "create" | "edit";
    initialListing?: Listing;
    assetImages: string[];
    onCancel: () => void;
    onSave: (draft: ListingDraft, intent: SaveIntent) => void;
}

interface ListingFormState {
    title: string;
    category: ListingCategory;
    status: ListingStatus;
    price: string;
    shortDescription: string;
    mainImage: string;
    galleryImages: string[];
    featured: boolean;
    showOnWebsite: boolean;
    inquiryLabel: ListingInquiryLabel;
    specs: ListingSpecs;
}

type ValidationErrors = Partial<Record<"title" | "status" | "price" | "shortDescription" | "mainImage", string>>;

const fieldClassName = "min-h-12 rounded-[1rem] border border-stone-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8";

const sectionClassName = "rounded-[1.65rem] border border-stone-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)] sm:p-6";

const specFieldsByCategory: Record<ListingCategory, Array<{ key: keyof ListingSpecs; label: string; placeholder: string; inputType?: "text" | "date" }>> = {
    automobiles: [
        { key: "year", label: "Year", placeholder: "2024" },
        { key: "mileage", label: "Mileage", placeholder: "3,300 km" },
        { key: "coeExpiryDate", label: "COE expiry date", placeholder: "", inputType: "date" }
    ],
    yachts: [
        { key: "year", label: "Year", placeholder: "2023" },
        { key: "length", label: "Length", placeholder: "60 ft" },
        { key: "engineHours", label: "Engine hours", placeholder: "220 hrs" },
        { key: "cabins", label: "Cabin count", placeholder: "3" },
        { key: "marina", label: "Location / Marina", placeholder: "Marina Collection" }
    ],
    properties: [
        { key: "bedrooms", label: "Bedrooms", placeholder: "6" },
        { key: "bathrooms", label: "Bathrooms", placeholder: "7" },
        { key: "interiorSize", label: "Interior size", placeholder: "940 sqm" },
        { key: "parking", label: "Parking", placeholder: "5 cars" },
        { key: "view", label: "View", placeholder: "Waterfront" },
        { key: "propertyType", label: "Property type", placeholder: "Detached Villa" }
    ]
};

function createInitialState(listing?: Listing): ListingFormState {
    if (listing) {
        return {
            title: listing.title,
            category: listing.category,
            status: listing.status,
            price: String(listing.price),
            shortDescription: listing.shortDescription,
            mainImage: listing.mainImage,
            galleryImages: listing.galleryImages.filter((image) => image !== listing.mainImage),
            featured: listing.featured,
            showOnWebsite: listing.showOnWebsite,
            inquiryLabel: listing.inquiryLabel,
            specs: { ...listing.specs }
        };
    }

    return {
        title: "",
        category: "automobiles",
        status: "available",
        price: "",
        shortDescription: "",
        mainImage: "",
        galleryImages: [],
        featured: false,
        showOnWebsite: true,
        inquiryLabel: "Send Inquiry",
        specs: {}
    };
}

function normalizeDraft(state: ListingFormState, intent: SaveIntent): ListingDraft {
    const parsedPrice = Number(state.price.replace(/[^0-9.]/g, ""));
    const nextStatus = intent === "draft" ? "hidden" : state.status;
    const nextShowOnWebsite = intent === "draft" ? false : state.showOnWebsite;
    const allowedKeys = new Set(specFieldsByCategory[state.category].map((field) => field.key));

    return {
        title: state.title.trim(),
        category: state.category,
        status: nextStatus,
        price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
        shortDescription: state.shortDescription.trim(),
        mainImage: state.mainImage,
        galleryImages: [state.mainImage, ...state.galleryImages].filter((image, index, items) => image && items.indexOf(image) === index),
        featured: state.featured,
        showOnWebsite: nextShowOnWebsite,
        inquiryLabel: state.inquiryLabel,
        specs: Object.fromEntries(
            Object.entries(state.specs).filter(([key, value]) =>
                allowedKeys.has(key as keyof ListingSpecs) && value && value.trim().length > 0
            )
        )
    };
}

function validateState(state: ListingFormState): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!state.title.trim()) {
        errors.title = "Title is required";
    }

    if (!state.price.trim()) {
        errors.price = "Price is required";
    }

    if (!state.shortDescription.trim()) {
        errors.shortDescription = "Short description is required";
    }

    if (!state.mainImage) {
        errors.mainImage = "Main image is required";
    }

    if (!state.status) {
        errors.status = "Status is required";
    }

    return errors;
}

function RequiredLabel({ children }: { children: string }) {
    return (
        <span className="text-[13px] font-medium text-slate-700">
            {children} <span className="text-[#8f3c28]">*</span>
        </span>
    );
}

function ToggleField({
    label,
    value,
    description,
    onChange
}: {
    label: string;
    value: boolean;
    description: string;
    onChange: (value: boolean) => void;
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(!value)}
            className="flex items-center justify-between gap-4 rounded-[1.15rem] border border-stone-200 bg-stone-50/80 px-4 py-4 text-left transition hover:border-[#d8b4a7] hover:bg-white"
        >
            <span>
                <span className="block text-sm font-semibold text-slate-950">{label}</span>
                <span className="mt-1 block text-sm text-slate-600">{description}</span>
            </span>
            <span
                className={[
                    "relative inline-flex h-7 w-12 items-center rounded-full transition",
                    value ? "bg-[#b54f32]" : "bg-stone-300"
                ].join(" ")}
                aria-hidden="true"
            >
                <span
                    className={[
                        "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition",
                        value ? "translate-x-6" : "translate-x-1"
                    ].join(" ")}
                />
            </span>
        </button>
    );
}

export function ListingForm({ mode, initialListing, assetImages, onCancel, onSave }: ListingFormProps) {
    const [formState, setFormState] = useState<ListingFormState>(() => createInitialState(initialListing));
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [activeIntent, setActiveIntent] = useState<SaveIntent | null>(null);

    const specFields = specFieldsByCategory[formState.category];
    const inquiryPreview = useMemo(
        () => buildInquiryTemplatePreview({
            title: formState.title || "Mercedes-Maybach S680",
            price: Number(formState.price.replace(/[^0-9.]/g, "")) || 238000,
            status: formState.status,
            inquiryLabel: formState.inquiryLabel
        }),
        [formState.inquiryLabel, formState.price, formState.status, formState.title]
    );

    const handleSave = (intent: SaveIntent) => {
        const validationErrors = validateState(formState);

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setActiveIntent(intent);
        onSave(normalizeDraft(formState, intent), intent);
    };

    return (
        <div className="space-y-5">
            <section className={sectionClassName}>
                <div className="mb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Basic Information</p>
                    <h2 className="font-display mt-2 text-[1.65rem] leading-tight text-slate-950">Listing information</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2">
                        <RequiredLabel>Listing title</RequiredLabel>
                        <input
                            type="text"
                            value={formState.title}
                            onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
                            placeholder="Mercedes-Maybach S680"
                            className={fieldClassName}
                        />
                        {errors.title ? <span className="text-sm text-[#8f3c28]">{errors.title}</span> : null}
                    </label>

                    <label className="grid gap-2">
                        <RequiredLabel>Category</RequiredLabel>
                        <select
                            value={formState.category}
                            onChange={(event) => {
                                const nextCategory = event.target.value as ListingCategory;
                                const allowedKeys = new Set(specFieldsByCategory[nextCategory].map((item) => item.key));

                                setFormState((current) => ({
                                    ...current,
                                    category: nextCategory,
                                    specs: Object.fromEntries(
                                        Object.entries(current.specs).filter(([key]) => allowedKeys.has(key as keyof ListingSpecs))
                                    )
                                }));
                            }}
                            className={fieldClassName}
                        >
                            <option value="automobiles">Automobiles</option>
                            <option value="yachts">Yachts</option>
                            <option value="properties">Properties</option>
                        </select>
                    </label>

                    <label className="grid gap-2">
                        <RequiredLabel>Status</RequiredLabel>
                        <select
                            value={formState.status}
                            onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value as ListingStatus }))}
                            className={fieldClassName}
                        >
                            {listingStatusOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                        {errors.status ? <span className="text-sm text-[#8f3c28]">{errors.status}</span> : null}
                    </label>

                    <label className="grid gap-2">
                        <RequiredLabel>Price</RequiredLabel>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={formState.price}
                            onChange={(event) => setFormState((current) => ({ ...current, price: event.target.value }))}
                            placeholder="238000"
                            className={fieldClassName}
                        />
                        {errors.price ? <span className="text-sm text-[#8f3c28]">{errors.price}</span> : null}
                    </label>

                    <label className="grid gap-2 md:col-span-2">
                        <RequiredLabel>Short description</RequiredLabel>
                        <textarea
                            rows={4}
                            value={formState.shortDescription}
                            onChange={(event) => setFormState((current) => ({ ...current, shortDescription: event.target.value }))}
                            placeholder="Executive luxury sedan with premium comfort."
                            className={`${fieldClassName} min-h-28`}
                        />
                        {errors.shortDescription ? <span className="text-sm text-[#8f3c28]">{errors.shortDescription}</span> : null}
                    </label>
                </div>
            </section>

            <section className={sectionClassName}>
                <div className="mb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Media</p>
                    <h2 className="font-display mt-2 text-[1.65rem] leading-tight text-slate-950">Images</h2>
                </div>

                <ListingImageUploader
                    mainImage={formState.mainImage}
                    galleryImages={formState.galleryImages}
                    assetImages={assetImages}
                    mainImageError={errors.mainImage}
                    onMainImageChange={(image) => setFormState((current) => ({ ...current, mainImage: image }))}
                    onGalleryImagesChange={(images) => setFormState((current) => ({ ...current, galleryImages: images }))}
                />
            </section>

            <section className={sectionClassName}>
                <div className="mb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Listing Details</p>
                    <h2 className="font-display mt-2 text-[1.65rem] leading-tight text-slate-950">Category details</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {specFields.map((field) => (
                        <label key={field.key} className="grid gap-2">
                            <span className="text-[13px] font-medium text-slate-700">{field.label}</span>
                            <input
                                type={field.inputType ?? "text"}
                                value={formState.specs[field.key] ?? ""}
                                onChange={(event) => setFormState((current) => ({
                                    ...current,
                                    specs: {
                                        ...current.specs,
                                        [field.key]: event.target.value
                                    }
                                }))}
                                placeholder={field.placeholder}
                                className={fieldClassName}
                            />
                        </label>
                    ))}
                </div>
            </section>

            <section className={sectionClassName}>
                <div className="mb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Inquiry Settings</p>
                    <h2 className="font-display mt-2 text-[1.65rem] leading-tight text-slate-950">Inquiry settings</h2>
                </div>

                <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                    <label className="grid gap-2">
                        <span className="text-[13px] font-medium text-slate-700">Inquiry label</span>
                        <select
                            value={formState.inquiryLabel}
                            onChange={(event) => setFormState((current) => ({ ...current, inquiryLabel: event.target.value as ListingInquiryLabel }))}
                            className={fieldClassName}
                        >
                            {inquiryLabelOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="rounded-[1.2rem] border border-stone-200 bg-stone-50/85 p-4">
                        <span className="text-[13px] font-medium text-slate-700">WhatsApp message template preview</span>
                        <pre className="mt-3 whitespace-pre-wrap rounded-[1rem] bg-white p-4 text-sm leading-7 text-slate-600">
                            {inquiryPreview}
                        </pre>
                    </div>
                </div>
            </section>

            <section className={sectionClassName}>
                <div className="mb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Visibility</p>
                    <h2 className="font-display mt-2 text-[1.65rem] leading-tight text-slate-950">Website display</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <ToggleField
                        label="Show on website"
                        value={formState.showOnWebsite}
                        description="Visible on the public inventory when enabled."
                        onChange={(value) => setFormState((current) => ({ ...current, showOnWebsite: value }))}
                    />
                    <ToggleField
                        label="Mark as featured"
                        value={formState.featured}
                        description="Push this listing closer to the top."
                        onChange={(value) => setFormState((current) => ({ ...current, featured: value }))}
                    />
                </div>
            </section>

            <div className="sticky bottom-4 z-20 rounded-[1.4rem] border border-stone-200 bg-white/94 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-stone-500">
                        {mode === "create" ? "Ready to add this listing?" : "Save changes to this listing."}
                    </p>
                    <div className="flex flex-col gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => handleSave("publish")}
                            className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(181,79,50,0.18)] transition hover:brightness-[0.96]"
                        >
                            {activeIntent === "publish" ? "Saving..." : "Save Listing"}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSave("draft")}
                            className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                        >
                            {activeIntent === "draft" ? "Saving..." : "Save as Draft"}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
