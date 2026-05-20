import { useEffect, useMemo, useState, type FormEvent } from "react";

import type { CompanyProfile, Listing } from "../../modules/site-data/site-data.types";
import { buildMailtoLink, buildWhatsAppLink, createInquiryMessage } from "../../utils/inquiry-links";
import { CloseIcon, MailIcon, WhatsappIcon } from "../ui/site-icon";
import { getListingInquiryDefaultMessage } from "./listing-meta";

interface InquiryFormProps {
    company: CompanyProfile;
    listing: Listing | null;
    onClose: () => void;
}

interface InquiryFormState {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    selectedListing: string;
    message: string;
}

export function InquiryForm({ company, listing, onClose }: InquiryFormProps) {
    const [formState, setFormState] = useState<InquiryFormState>({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        selectedListing: listing?.name ?? "",
        message: listing ? getListingInquiryDefaultMessage(listing) : "Hello, I am interested in this listing. Please send me more details."
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (!listing) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        setFormState({
            fullName: "",
            email: "",
            phone: "",
            location: "",
            selectedListing: listing.name,
            message: getListingInquiryDefaultMessage(listing)
        });
        setIsSubmitted(false);
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [listing, onClose]);

    const inquiryMessage = useMemo(() => {
        if (!listing) {
            return "";
        }

        return createInquiryMessage({
            fullName: formState.fullName,
            email: formState.email,
            phone: formState.phone,
            location: formState.location,
            listingName: formState.selectedListing,
            price: listing.price,
            message: formState.message
        });
    }, [formState, listing]);

    if (!listing) {
        return null;
    }

    const whatsappLink = buildWhatsAppLink(company.whatsappNumber, inquiryMessage);
    const mailtoLink = buildMailtoLink(company.email, `Inquiry: ${listing.name}`, inquiryMessage);

    const handleChange = (field: keyof InquiryFormState, value: string) => {
        setFormState((current) => ({
            ...current,
            [field]: value
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6"
            onClick={onClose}
            role="presentation"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={`inquiry-title-${listing.id}`}
                className="luxury-modal-scroll max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[1.5rem] border border-stone-200 bg-[linear-gradient(135deg,rgba(251,250,247,1),rgba(246,241,234,0.97))] p-4 shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:rounded-[2rem] sm:p-8 sm:shadow-[0_30px_90px_rgba(15,23,42,0.22)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                            Direct Inquiry
                        </p>
                        <h2 id={`inquiry-title-${listing.id}`} className="font-display mt-2 text-[1.55rem] leading-tight text-slate-950 sm:mt-3 sm:text-5xl">
                            {isSubmitted ? "Inquiry Ready" : "Send an inquiry."}
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:mt-3 sm:leading-7">
                            Share your contact details and the listing you are interested in.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-slate-900 transition hover:border-slate-950 sm:h-11 sm:w-11"
                        aria-label="Close inquiry form"
                    >
                        <CloseIcon className="h-4 w-4" />
                    </button>
                </div>

                {isSubmitted ? (
                    <div className="mt-6 rounded-[1.2rem] border border-emerald-200 bg-emerald-50 p-4 shadow-[0_10px_26px_rgba(5,150,105,0.08)] sm:mt-8 sm:rounded-[1.5rem] sm:p-6">
                        <p className="text-base font-semibold text-emerald-800">
                            Inquiry prepared successfully. You can continue on WhatsApp or email.
                        </p>
                        <p className="mt-3 text-sm leading-7 text-emerald-700/90">
                            The message is ready to send using your preferred channel.
                        </p>

                        <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:gap-3">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-emerald-700 sm:px-6 sm:py-4 sm:text-sm"
                            >
                                <WhatsappIcon className="h-4 w-4" />
                                Continue on WhatsApp
                            </a>
                            <a
                                href={mailtoLink}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-[13px] font-semibold text-slate-900 transition hover:border-slate-950 sm:px-6 sm:py-4 sm:text-sm"
                            >
                                <MailIcon className="h-4 w-4" />
                                Send by Email
                            </a>
                        </div>

                        <pre className="mt-6 overflow-x-auto rounded-[1.25rem] bg-white p-4 text-sm whitespace-pre-wrap text-slate-600">
                            {inquiryMessage}
                        </pre>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-6 sm:mt-8">
                        <div className="rounded-[1.15rem] border border-stone-200 bg-white/80 p-3.5 shadow-[0_8px_20px_rgba(15,23,42,0.04)] sm:rounded-[1.4rem] sm:p-5">
                            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                Interested Listing
                            </span>
                            <strong className="mt-2 block text-lg font-semibold text-slate-950">
                                {listing.name}
                            </strong>
                            <p className="mt-1 text-sm text-slate-500">{listing.price}</p>
                        </div>

                        <div className="mt-4 grid gap-3.5 sm:mt-5 sm:grid-cols-2 sm:gap-5">
                            <label className="grid gap-1.5 text-sm text-slate-700 sm:gap-2">
                                <span className="text-[13px] font-medium">Full Name</span>
                                <input
                                    type="text"
                                    required
                                    value={formState.fullName}
                                    onChange={(event) => handleChange("fullName", event.target.value)}
                                    className="min-h-11 rounded-[0.95rem] border border-stone-300 bg-white px-4 py-2.5 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8 sm:min-h-14 sm:rounded-[1.15rem] sm:py-3.5"
                                />
                            </label>
                            <label className="grid gap-1.5 text-sm text-slate-700 sm:gap-2">
                                <span className="text-[13px] font-medium">Email Address</span>
                                <input
                                    type="email"
                                    required
                                    value={formState.email}
                                    onChange={(event) => handleChange("email", event.target.value)}
                                    className="min-h-11 rounded-[0.95rem] border border-stone-300 bg-white px-4 py-2.5 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8 sm:min-h-14 sm:rounded-[1.15rem] sm:py-3.5"
                                />
                            </label>
                            <label className="grid gap-1.5 text-sm text-slate-700 sm:gap-2">
                                <span className="text-[13px] font-medium">WhatsApp / Phone Number</span>
                                <input
                                    type="tel"
                                    required
                                    value={formState.phone}
                                    onChange={(event) => handleChange("phone", event.target.value)}
                                    className="min-h-11 rounded-[0.95rem] border border-stone-300 bg-white px-4 py-2.5 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8 sm:min-h-14 sm:rounded-[1.15rem] sm:py-3.5"
                                />
                            </label>
                            <label className="grid gap-1.5 text-sm text-slate-700 sm:gap-2">
                                <span className="text-[13px] font-medium">Country / Location</span>
                                <input
                                    type="text"
                                    required
                                    value={formState.location}
                                    onChange={(event) => handleChange("location", event.target.value)}
                                    className="min-h-11 rounded-[0.95rem] border border-stone-300 bg-white px-4 py-2.5 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8 sm:min-h-14 sm:rounded-[1.15rem] sm:py-3.5"
                                />
                            </label>
                            <label className="grid gap-1.5 text-sm text-slate-700 sm:col-span-2 sm:gap-2">
                                <span className="text-[13px] font-medium">Interested Listing</span>
                                <input
                                    type="text"
                                    readOnly
                                    value={formState.selectedListing}
                                    className="min-h-11 rounded-[0.95rem] border border-stone-300 bg-stone-50 px-4 py-2.5 text-slate-950 outline-none sm:min-h-14 sm:rounded-[1.15rem] sm:py-3.5"
                                />
                            </label>
                            <label className="grid gap-1.5 text-sm text-slate-700 sm:col-span-2 sm:gap-2">
                                <span className="text-[13px] font-medium">Message</span>
                                <textarea
                                    rows={7}
                                    required
                                    value={formState.message}
                                    onChange={(event) => handleChange("message", event.target.value)}
                                    className="min-h-28 rounded-[0.95rem] border border-stone-300 bg-white px-4 py-2.5 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8 sm:min-h-36 sm:rounded-[1.15rem] sm:py-3.5"
                                />
                            </label>
                        </div>

                        <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:gap-3">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_12px_28px_rgba(181,79,50,0.18)] transition duration-300 ease-out hover:brightness-[0.96] sm:px-6 sm:py-4 sm:text-sm"
                            >
                                Submit Inquiry
                            </button>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-[13px] font-semibold text-emerald-700 transition duration-300 ease-out hover:bg-emerald-100 sm:px-6 sm:py-4 sm:text-sm"
                            >
                                <WhatsappIcon className="h-4 w-4" />
                                Message on WhatsApp
                            </a>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
