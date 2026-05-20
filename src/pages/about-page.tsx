import { NavLink } from "react-router";

import { PageHero } from "../components/ui/page-hero";

export function AboutPage() {
    return (
        <>
            <PageHero
                eyebrow="About"
                title="Premium cars, yachts and properties."
                description="Browse selected listings and send direct inquiries."
            />

            <section className="pb-10 pt-4 sm:pb-14 sm:pt-6">
                <div className="mx-auto grid w-[min(1200px,calc(100%-1rem))] gap-4 sm:w-[min(1200px,calc(100%-1.5rem))] sm:gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <figure className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-4 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
                        <img
                            src="/assets/luxury-property.png"
                            alt="Luxury property exterior"
                            className="h-full min-h-[24rem] w-full rounded-[1.5rem] object-cover lg:min-h-[29rem]"
                        />
                    </figure>

                    <div className="rounded-[2rem] border border-stone-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.99),rgba(250,246,238,0.94))] p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)] sm:p-8">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                            Robarol Elite
                        </p>
                        <h2 className="font-display mt-3 text-4xl leading-[0.95] text-slate-950 sm:text-5xl">
                            Selected listings. Direct contact.
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                            Robarol Elite presents selected automobiles, yachts and properties for buyers who value clear availability and direct response.
                        </p>

                        <div className="mt-5 grid gap-4 sm:grid-cols-3">
                            {[
                                ["3", "Categories"],
                                ["Direct", "Inquiry"],
                                ["Clear", "Pricing"]
                            ].map(([value, label]) => (
                                <div key={label} className="rounded-[1.35rem] border border-stone-200/70 bg-white/82 p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                                    <strong className="font-display block text-3xl text-slate-950">{value}</strong>
                                    <span className="mt-2 block text-sm text-slate-600">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-10 sm:pb-16">
                <div className="mx-auto w-[min(1200px,calc(100%-1rem))] rounded-[1.45rem] border border-stone-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)] sm:w-[min(1200px,calc(100%-1.5rem))] sm:rounded-[2rem] sm:p-8 sm:shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
                    <div className="grid gap-5 md:grid-cols-3">
                        {[
                            ["Automobiles", "Executive sedans, SUVs and statement vehicles."],
                            ["Yachts", "Private yachts and marine listings."],
                            ["Properties", "Premium homes and investment properties."]
                        ].map(([title, text]) => (
                            <article key={title} className="rounded-[1.5rem] border border-stone-200/70 bg-stone-50 p-6">
                                <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                            </article>
                        ))}
                    </div>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <NavLink
                            to="/inventory"
                            className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(181,79,50,0.22)] transition duration-300 ease-out hover:brightness-[0.96]"
                        >
                            View Listings
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-4 text-sm font-semibold text-slate-900 transition duration-300 ease-out hover:border-slate-950 hover:bg-stone-50"
                        >
                            Send Inquiry
                        </NavLink>
                    </div>
                </div>
            </section>
        </>
    );
}
