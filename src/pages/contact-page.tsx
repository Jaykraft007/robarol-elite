import { useMemo, useState, type FormEvent } from "react";

import { PageHero } from "../components/ui/page-hero";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, WhatsappIcon } from "../components/ui/site-icon";
import { useSiteData } from "../modules/site-data/site-data.context";
import { formatListingPrice } from "../modules/site-data/listing-helpers";
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
    const { company, listings } = useSiteData();
    const [isSubmitted, setIsSubmitted] = useState(false);
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
        "Yachts & Automobiles",
        "Business Development & Consulting",
        "Finance & Loans",
        "Home Loans",
        "Business Loans",
        "Personal Loans",
        "Cars & Yachts Loans",
        "Visa for Foreigners",
        "Employment Passes",
        "PR Application",
        "Open Business for Foreigners"
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

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <>
            <PageHero
                eyebrow="Contact"
                title={`Contact ${company.contactName}`}
                description="Yachts & automobiles, business development, finance & loans, and support for foreigners."
            />

            <section className="pb-7 pt-3 sm:pb-10 sm:pt-4">
                <div className="mx-auto grid w-[min(1200px,calc(100%-1rem))] gap-4 sm:w-[min(1200px,calc(100%-1.5rem))] sm:gap-5 lg:grid-cols-[0.88fr_1.12fr]">
                    <aside className="grid gap-3.5 rounded-[1.4rem] border border-stone-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.99),rgba(250,246,238,0.94))] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:rounded-[1.7rem] sm:gap-4 sm:p-6 sm:shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                                Contact
                            </p>
                            <h2 className="font-display mt-2 text-[1.45rem] leading-tight text-slate-950 sm:text-[1.85rem]">
                                {company.contactName} (Robarol)
                            </h2>
                            <p className="mt-1.5 text-sm leading-6 text-slate-600 sm:mt-2">
                                Yachts & automobiles, finance & loans, business development and support for foreigners.
                            </p>
                        </div>

                        <a
                            href={buildWhatsAppLink(company.whatsappNumber, "Hello Robarol, I would like to make an inquiry.")}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 rounded-[1rem] border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-800 shadow-[0_8px_20px_rgba(5,150,105,0.08)] transition duration-300 ease-out hover:-translate-y-0.5 sm:rounded-[1.2rem] sm:px-4 sm:py-3.5"
                        >
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white sm:h-10 sm:w-10">
                                <WhatsappIcon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block font-semibold">WhatsApp</span>
                                <span className="block text-[13px] text-emerald-700">{company.phone}</span>
                            </span>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Open</span>
                        </a>

                        <a
                            href={`tel:${company.phone.replace(/\s+/g, "")}`}
                            className="flex items-center gap-3 rounded-[1rem] border border-stone-200/70 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition duration-300 ease-out hover:-translate-y-0.5 sm:rounded-[1.2rem] sm:px-4 sm:py-3.5"
                        >
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-slate-700 sm:h-10 sm:w-10">
                                <PhoneIcon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block font-semibold">Phone</span>
                                <span className="block text-[13px] text-slate-600">{company.phone}</span>
                            </span>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Call</span>
                        </a>

                        <a
                            href={`mailto:${company.email}`}
                            className="flex items-center gap-3 rounded-[1rem] border border-stone-200/70 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition duration-300 ease-out hover:-translate-y-0.5 sm:rounded-[1.2rem] sm:px-4 sm:py-3.5"
                        >
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-slate-700 sm:h-10 sm:w-10">
                                <MailIcon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block font-semibold">Email</span>
                                <span className="block text-[13px] text-slate-600">{company.email}</span>
                            </span>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Send</span>
                        </a>

                        <div className="rounded-[1rem] border border-stone-200/70 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.04)] sm:rounded-[1.2rem] sm:px-4 sm:py-4">
                            <h3 className="font-semibold text-slate-950">What we do</h3>
                            <ul className="mt-3 grid gap-2 text-[13px] leading-5 text-slate-600">
                                <li>Yachts &amp; Automobiles</li>
                                <li>Business Development &amp; Consultants</li>
                                <li>Finance &amp; Loans</li>
                                <li>Home, Business, Personal, Cars &amp; Yachts Loans</li>
                                <li>Visa for Foreigners, Employment Passes, PR Application</li>
                                <li>Open Business for Foreigners</li>
                            </ul>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                            <a
                                href={company.instagramUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 px-4 py-3 text-center text-[13px] font-semibold text-slate-900 transition duration-300 ease-out hover:border-slate-950 hover:bg-stone-50"
                            >
                                <InstagramIcon className="h-4 w-4" />
                                Instagram
                            </a>
                            <a
                                href={company.facebookUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 px-4 py-3 text-center text-[13px] font-semibold text-slate-900 transition duration-300 ease-out hover:border-slate-950 hover:bg-stone-50"
                            >
                                <FacebookIcon className="h-4 w-4" />
                                Facebook
                            </a>
                        </div>
                    </aside>

                    <div className="rounded-[1.4rem] border border-stone-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:rounded-[1.7rem] sm:p-6 sm:shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
                        {isSubmitted ? (
                            <div className="rounded-[1.35rem] border border-emerald-200 bg-emerald-50 p-5 shadow-[0_10px_26px_rgba(5,150,105,0.08)]">
                                <p className="text-base font-semibold text-emerald-800">
                                    Inquiry prepared successfully. You can continue on WhatsApp or email.
                                </p>
                                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
                                    >
                                        <WhatsappIcon className="h-4 w-4" />
                                        Continue on WhatsApp
                                    </a>
                                    <a
                                        href={mailtoLink}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-950 sm:w-auto"
                                    >
                                        <MailIcon className="h-4 w-4" />
                                        Send by Email
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h2 className="font-display text-[1.45rem] leading-tight text-slate-950 sm:text-[1.85rem]">
                                    Send request
                                </h2>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                                    Share your contact details and what you need help with.
                                </p>

                                <div className="mt-4 grid gap-3.5 sm:mt-5 sm:grid-cols-2 sm:gap-4">
                                    <label className="grid gap-1.5 text-sm text-slate-700">
                                        <span className="text-[13px] font-medium">Full Name</span>
                                        <input
                                            type="text"
                                            required
                                            value={formState.fullName}
                                            onChange={(event) => handleChange("fullName", event.target.value)}
                                            className="min-h-11 rounded-[0.95rem] border border-stone-300 bg-white px-4 py-2.5 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8 sm:min-h-12 sm:rounded-[1rem] sm:py-3"
                                        />
                                    </label>
                                    <label className="grid gap-1.5 text-sm text-slate-700">
                                        <span className="text-[13px] font-medium">Email Address</span>
                                        <input
                                            type="email"
                                            required
                                            value={formState.email}
                                            onChange={(event) => handleChange("email", event.target.value)}
                                            className="min-h-11 rounded-[0.95rem] border border-stone-300 bg-white px-4 py-2.5 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8 sm:min-h-12 sm:rounded-[1rem] sm:py-3"
                                        />
                                    </label>
                                    <label className="grid gap-1.5 text-sm text-slate-700">
                                        <span className="text-[13px] font-medium">Phone / WhatsApp</span>
                                        <input
                                            type="tel"
                                            required
                                            value={formState.phone}
                                            onChange={(event) => handleChange("phone", event.target.value)}
                                            className="min-h-11 rounded-[0.95rem] border border-stone-300 bg-white px-4 py-2.5 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8 sm:min-h-12 sm:rounded-[1rem] sm:py-3"
                                        />
                                    </label>
                                    <label className="grid gap-1.5 text-sm text-slate-700">
                                        <span className="text-[13px] font-medium">Country / Location</span>
                                        <input
                                            type="text"
                                            required
                                            value={formState.location}
                                            onChange={(event) => handleChange("location", event.target.value)}
                                            className="min-h-11 rounded-[0.95rem] border border-stone-300 bg-white px-4 py-2.5 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8 sm:min-h-12 sm:rounded-[1rem] sm:py-3"
                                        />
                                    </label>
                                    <label className="grid gap-1.5 text-sm text-slate-700 sm:col-span-2">
                                        <span className="text-[13px] font-medium">What do you need help with?</span>
                                        <select
                                            value={formState.selectedListing}
                                            onChange={(event) => handleChange("selectedListing", event.target.value)}
                                            className="min-h-11 rounded-[0.95rem] border border-stone-300 bg-white px-4 py-2.5 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8 sm:min-h-12 sm:rounded-[1rem] sm:py-3"
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
                                            rows={6}
                                            required
                                            value={formState.message}
                                            onChange={(event) => handleChange("message", event.target.value)}
                                            className="min-h-28 rounded-[0.95rem] border border-stone-300 bg-white px-4 py-2.5 text-slate-950 outline-none transition duration-300 focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8 sm:min-h-32 sm:rounded-[1rem] sm:py-3"
                                        />
                                    </label>
                                </div>

                                <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:gap-3">
                                    <button
                                        type="submit"
                                        className="inline-flex w-full items-center justify-center rounded-full bg-[#b54f32] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_12px_30px_rgba(181,79,50,0.22)] transition duration-300 ease-out hover:brightness-[0.96] sm:w-auto sm:py-3 sm:text-sm"
                                    >
                                        Submit Inquiry
                                    </button>
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-[13px] font-semibold text-emerald-700 transition duration-300 ease-out hover:bg-emerald-100 sm:w-auto sm:py-3 sm:text-sm"
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
