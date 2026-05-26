import { NavLink } from "react-router";

import { PageHero } from "../components/ui/page-hero";

export function FinancePage() {
    return (
        <>
            <PageHero
                eyebrow="Finance"
                title="Loan support for major personal and business needs."
                description="Robarol helps clients start clear conversations around home, business, personal, car and yacht loans."
                actions={
                    <NavLink
                        to="/contact"
                        className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(181,79,50,0.22)] transition hover:bg-[#8f3c28]"
                    >
                        Start Finance Inquiry
                    </NavLink>
                }
            />

            <section className="pb-10 pt-4 sm:pb-16 sm:pt-6">
                <div className="mx-auto grid w-[min(1200px,calc(100%-1rem))] gap-4 sm:w-[min(1200px,calc(100%-1.5rem))] sm:gap-5 md:grid-cols-2 xl:grid-cols-5">
                    {[
                        ["Home Loan", "For clients exploring property financing and residential borrowing support."],
                        ["Business Loan", "For founders and operators needing structured business funding conversations."],
                        ["Personal Loan", "For personal liquidity needs that require a more direct next-step discussion."],
                        ["Car Loan", "For clients financing automobile purchases through guided inquiry support."],
                        ["Yacht Loan", "For buyers planning a yacht acquisition with financing in mind."]
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
