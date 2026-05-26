import { NavLink } from "react-router";

import { PageHero } from "../components/ui/page-hero";

export function FinancePage() {
    return (
        <>
            <PageHero
                eyebrow="Acquisition Support"
                title="Start a finance inquiry."
                description="Share your interest and receive availability with the next steps."
                actions={
                    <NavLink
                        to="/contact"
                        className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(181,79,50,0.22)] transition hover:bg-[#8f3c28]"
                    >
                        Start Inquiry
                    </NavLink>
                }
            />

            <section className="pb-10 pt-4 sm:pb-16 sm:pt-6">
                <div className="mx-auto grid w-[min(1200px,calc(100%-1rem))] gap-4 sm:w-[min(1200px,calc(100%-1.5rem))] sm:gap-5 md:grid-cols-3">
                    {[
                        ["Home Loans", "For clients looking at home loan options and next-step support."],
                        ["Business & Personal Loans", "For business loans and personal loan requests."],
                        ["Cars & Yachts Loans", "For clients planning car or yacht financing support."]
                    ].map(([title, text]) => (
                        <article key={title} className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(15,23,42,0.08)]">
                            <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
                            <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}
