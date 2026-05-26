import { NavLink } from "react-router";

import { PageHero } from "../components/ui/page-hero";

export function ServicesPage() {
    return (
        <>
            <PageHero
                eyebrow="Services"
                title="Business development, visa and foreigner support."
                description="Robarol supports clients beyond inventory with practical business consulting and relocation-related guidance."
            />

            <section className="pb-10 pt-4 sm:pb-16 sm:pt-6">
                <div className="mx-auto grid w-[min(1200px,calc(100%-1rem))] gap-4 sm:w-[min(1200px,calc(100%-1.5rem))] sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {[
                        ["Business Development", "Support for commercial planning, positioning and opportunity development."],
                        ["Business Consulting", "Practical guidance around structuring conversations, offers and business direction."],
                        ["Visa for Foreigners", "Help starting the process for foreign clients who need entry or relocation support."],
                        ["Employment Passes", "Support around work-pass related requirements and client follow-through."],
                        ["PR Application", "Guidance for clients preparing permanent residence applications."],
                        ["Open Business for Foreigners", "Help starting a business as a foreigner with clearer next-step coordination."]
                    ].map(([title, text]) => (
                        <article key={title} className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(15,23,42,0.08)]">
                            <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
                            <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                        </article>
                    ))}
                </div>

                <div className="mx-auto mt-6 w-[min(1200px,calc(100%-1rem))] sm:mt-7 sm:w-[min(1200px,calc(100%-1.5rem))]">
                    <NavLink
                        to="/contact"
                        className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(181,79,50,0.22)] transition duration-300 ease-out hover:brightness-[0.96]"
                    >
                        Talk to Lats
                    </NavLink>
                </div>
            </section>
        </>
    );
}
