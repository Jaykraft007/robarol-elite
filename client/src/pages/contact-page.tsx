import { useMemo, useState, type FormEvent } from "react";

import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, WhatsappIcon } from "../components/ui/site-icon";
import { ApiError } from "../modules/core/api-client";
import { formatListingPrice } from "../modules/site-data/listing-helpers";
import { useSiteData } from "../modules/site-data/site-data.context";
import { buildMailtoLink, buildWhatsAppLink, createInquiryMessage } from "../utils/inquiry-links";

interface ContactFormState {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    selectedListing: string;
    message: string;
}

export function ContactPage() {
    const { company, createInquiry, listings } = useSiteData();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formState, setFormState] = useState<ContactFormState>({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        selectedListing: "General inquiry",
        message: "Hello, I would like to make an inquiry. Please share the next steps."
    });

    if (!company) {
        return null;
    }

    const serviceOptions = [
        "General inquiry",
        "Automobile sourcing",
        "Finance & loan support",
        "Business assistance",
        "Visa & relocation support",
        "Swimming & personal training"
    ];

    const selectedListing = listings.find((listing) => listing.title === formState.selectedListing);

    const inquiryMessage = useMemo(() => createInquiryMessage({
        fullName: formState.fullName,
        email: formState.email,
        phone: formState.phone,
        location: formState.location,
        listingName: formState.selectedListing,
        price: selectedListing ? formatListingPrice(selectedListing) : "Request pricing",
        message: formState.message
    }), [formState, selectedListing]);

    const whatsappLink = buildWhatsAppLink(company.whatsappNumber, inquiryMessage);
    const mailtoLink = buildMailtoLink(company.email, `Inquiry: ${formState.selectedListing}`, inquiryMessage);

    const handleChange = (field: keyof ContactFormState, value: string) => {
        setFormState((current) => ({
            ...current,
            [field]: value
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            await createInquiry({
                listingId: selectedListing?.id ?? null,
                fullName: formState.fullName,
                email: formState.email,
                phone: formState.phone,
                location: formState.location,
                message: inquiryMessage,
                source: "contact_page"
            });
            setIsSubmitted(true);
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Unable to submit inquiry right now.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <section className="pt-2.5 sm:pt-4">
                <div className="mx-auto w-[min(1120px,calc(100%-1rem))] sm:w-[min(1120px,calc(100%-1.5rem))]">
                    <div className="max-w-[40rem]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                            Contact
                        </p>
                        <h1 className="font-hero-display mt-2 text-[1.6rem] leading-[1.02] text-slate-950 sm:text-[2.2rem] lg:text-[2.7rem]">
                            Contact & inquiry.
                        </h1>
                        <p className="mt-3 max-w-[34rem] text-sm leading-6 text-slate-600 sm:text-[0.98rem] sm:leading-7">
                            Reach out for listings, sourcing, finance or support.
                        </p>
                    </div>
                </div>
            </section>

            <section className="pb-7 pt-4 sm:pb-9 sm:pt-5">
                <div className="mx-auto grid w-[min(1120px,calc(100%-1rem))] gap-4 sm:w-[min(1120px,calc(100%-1.5rem))] sm:gap-5 lg:grid-cols-[0.94fr_1.06fr]">
                    <aside className="rounded-[1.35rem] border border-stone-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,246,240,0.95))] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] sm:rounded-[1.55rem] sm:p-5">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                                Direct Contact
                            </p>
                            <h2 className="font-hero-display mt-2 text-[1.3rem] leading-tight text-slate-950 sm:text-[1.55rem]">
                                {company.contactName} (Robarol)
                            </h2>
                        </div>

                        <div className="mt-4">
                            <a
                                href={buildWhatsAppLink(company.whatsappNumber, "Hello Robarol, I would like to make an inquiry.")}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 rounded-[1.1rem] border border-emerald-200/80 bg-emerald-50/92 px-3.5 py-3.5 text-sm text-emerald-800 shadow-[0_10px_24px_rgba(5,150,105,0.07)] transition duration-300 ease-out hover:-translate-y-0.5"
                            >
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_10px_20px_rgba(22,163,74,0.18)]">
                                    <WhatsappIcon className="h-4 w-4" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block font-semibold">WhatsApp</span>
                                    <span className="block text-[13px] text-emerald-700">{company.phone}</span>
                                </span>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Open</span>
                            </a>
                        </div>

                        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                            <a
                                href={`tel:${company.phone.replace(/\s+/g, "")}`}
                                className="flex items-center gap-3 rounded-[1rem] border border-stone-200/75 bg-white/84 px-3.5 py-3 text-sm text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition duration-300 ease-out hover:-translate-y-0.5"
                            >
                                <span className="inline-flex h-[2.125rem] w-[2.125rem] items-center justify-center rounded-full bg-stone-100 text-slate-700">
                                    <PhoneIcon className="h-4 w-4" />
                                </span>
                                <span className="min-w-0">
                                    <span className="block font-semibold">Phone</span>
                                    <span className="block text-[13px] text-slate-600">{company.phone}</span>
                                </span>
                            </a>

                            <a
                                href={`mailto:${company.email}`}
                                className="flex items-center gap-3 rounded-[1rem] border border-stone-200/75 bg-white/84 px-3.5 py-3 text-sm text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition duration-300 ease-out hover:-translate-y-0.5"
                            >
                                <span className="inline-flex h-[2.125rem] w-[2.125rem] items-center justify-center rounded-full bg-stone-100 text-slate-700">
                                    <MailIcon className="h-4 w-4" />
                                </span>
                                <span className="min-w-0">
                                    <span className="block font-semibold">Email</span>
                                    <span className="block text-[13px] text-slate-600">{company.email}</span>
                                </span>
                            </a>
                        </div>

                        <div className="mt-4 border-t border-stone-200/80 pt-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                                Support Areas
                            </p>
                            <ul className="mt-3 grid gap-2 text-[13px] leading-5 text-slate-600">
                                <li>Automobile sourcing</li>
                                <li>Finance &amp; loan support</li>
                                <li>Business assistance</li>
                                <li>Visa &amp; relocation support</li>
                                <li>Swimming &amp; personal training</li>
                            </ul>
                        </div>

                        <div className="mt-4 border-t border-stone-200/80 pt-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                                Training Rates
                            </p>
                            <div className="mt-3 grid gap-2 text-[13px] leading-5 text-slate-600">
                                <p>Competitive swimming training: <span className="font-semibold text-slate-900">$250/hr</span></p>
                                <p>Beginner swimming: <span className="font-semibold text-slate-900">$350 for 5 sessions</span></p>
                                <p>Personal training for models: <span className="font-semibold text-slate-900">$200/hr</span></p>
                                <p>Regular personal training: <span className="font-semibold text-slate-900">$90/hr</span></p>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2.5">
                            <a
                                href={company.instagramUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-900 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-950 hover:bg-stone-50"
                            >
                                <InstagramIcon className="h-4 w-4" />
                                Instagram
                            </a>
                            <a
                                href={company.facebookUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-900 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-950 hover:bg-stone-50"
                            >
                                <FacebookIcon className="h-4 w-4" />
                                Facebook
                            </a>
                        </div>
                    </aside>

                    <div className="rounded-[1.35rem] border border-stone-200/80 bg-white/92 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] sm:rounded-[1.55rem] sm:p-5 lg:p-6">
                        {isSubmitted ? (
                            <div className="rounded-[1.2rem] border border-emerald-200/85 bg-emerald-50/92 p-4 shadow-[0_10px_22px_rgba(5,150,105,0.07)] sm:p-5">
                                <p className="font-hero-display text-[1.2rem] leading-tight text-emerald-900 sm:text-[1.35rem]">
                                    Inquiry prepared successfully.
                                </p>
                                <p className="mt-2 text-sm leading-6 text-emerald-800">
                                    Continue on WhatsApp or send the request by email.
                                </p>
                                <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold !text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-emerald-700 hover:!text-white"
                                    >
                                        <WhatsappIcon className="h-4 w-4" />
                                        Continue on WhatsApp
                                    </a>
                                    <a
                                        href={mailtoLink}
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-950"
                                    >
                                        <MailIcon className="h-4 w-4" />
                                        Send by Email
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={(event) => void handleSubmit(event)}>
                                <div>
                                    <h2 className="font-hero-display text-[1.3rem] leading-tight text-slate-950 sm:text-[1.55rem]">
                                        Submit inquiry
                                    </h2>
                                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                                        Share your details and what you need help with.
                                    </p>
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-3.5">
                                    <label className="grid gap-1.5 text-sm text-slate-700">
                                        <span className="text-[13px] font-medium">Full Name</span>
                                        <input
                                            type="text"
                                            required
                                            value={formState.fullName}
                                            onChange={(event) => handleChange("fullName", event.target.value)}
                                            className="h-11 rounded-[0.95rem] border border-stone-300 bg-white px-4 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8"
                                        />
                                    </label>
                                    <label className="grid gap-1.5 text-sm text-slate-700">
                                        <span className="text-[13px] font-medium">Email Address</span>
                                        <input
                                            type="email"
                                            required
                                            value={formState.email}
                                            onChange={(event) => handleChange("email", event.target.value)}
                                            className="h-11 rounded-[0.95rem] border border-stone-300 bg-white px-4 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8"
                                        />
                                    </label>
                                    <label className="grid gap-1.5 text-sm text-slate-700">
                                        <span className="text-[13px] font-medium">Phone / WhatsApp</span>
                                        <input
                                            type="tel"
                                            required
                                            value={formState.phone}
                                            onChange={(event) => handleChange("phone", event.target.value)}
                                            className="h-11 rounded-[0.95rem] border border-stone-300 bg-white px-4 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8"
                                        />
                                    </label>
                                    <label className="grid gap-1.5 text-sm text-slate-700">
                                        <span className="text-[13px] font-medium">Country / Location</span>
                                        <input
                                            type="text"
                                            required
                                            value={formState.location}
                                            onChange={(event) => handleChange("location", event.target.value)}
                                            className="h-11 rounded-[0.95rem] border border-stone-300 bg-white px-4 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8"
                                        />
                                    </label>
                                    <label className="grid gap-1.5 text-sm text-slate-700 sm:col-span-2">
                                        <span className="text-[13px] font-medium">What do you need help with?</span>
                                        <select
                                            value={formState.selectedListing}
                                            onChange={(event) => handleChange("selectedListing", event.target.value)}
                                            className="h-11 rounded-[0.95rem] border border-stone-300 bg-white px-4 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8"
                                        >
                                            {serviceOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                            {listings.map((listing) => (
                                                <option key={listing.id} value={listing.title}>
                                                    {listing.title}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="grid gap-1.5 text-sm text-slate-700 sm:col-span-2">
                                        <span className="text-[13px] font-medium">Message</span>
                                        <textarea
                                            rows={5}
                                            required
                                            value={formState.message}
                                            onChange={(event) => handleChange("message", event.target.value)}
                                            className="min-h-28 rounded-[0.95rem] border border-stone-300 bg-white px-4 py-3 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8"
                                        />
                                    </label>
                                </div>

                                {errorMessage ? (
                                    <div className="mt-4 rounded-[1rem] border border-[#e3b4a6] bg-[#fdf1ec] px-4 py-3 text-sm text-[#8f3c28]">
                                        {errorMessage}
                                    </div>
                                ) : null}

                                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-5 py-2.5 text-sm font-semibold !text-white shadow-[0_12px_26px_rgba(181,79,50,0.18)] transition duration-300 ease-out hover:-translate-y-0.5 hover:brightness-[0.97] hover:!text-white"
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                                    </button>
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200/85 bg-emerald-50/75 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-emerald-100/80"
                                    >
                                        <WhatsappIcon className="h-4 w-4" />
                                        Continue on WhatsApp
                                    </a>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
