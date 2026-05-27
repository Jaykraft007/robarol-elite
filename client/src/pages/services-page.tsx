import { NavLink } from "react-router";

import { ArrowUpRightIcon, BriefcaseIcon, CarIcon, GlobeIcon, WalletIcon } from "../components/ui/site-icon";

const serviceCards = [
    {
        title: "Yachts & Automobiles",
        description: "Direct sourcing and support for selected automobile and yacht inquiries.",
        Icon: CarIcon,
        className: "lg:col-span-7"
    },
    {
        title: "Business Development",
        description: "Business guidance and support around selected commercial opportunities.",
        Icon: BriefcaseIcon,
        className: "lg:col-span-5"
    },
    {
        title: "Finance & Loans",
        description: "Finance support for home, business, personal, car and yacht requests.",
        Icon: WalletIcon,
        className: "lg:col-span-5"
    },
    {
        title: "Visa & PR Support",
        description: "Visa, employment pass, PR and foreign business setup support.",
        Icon: GlobeIcon,
        className: "lg:col-span-7"
    }
] as const;

export function ServicesPage() {
    return (
        <>
            <section className="pt-2.5 sm:pt-4">
                <div className="mx-auto w-[min(1120px,calc(100%-1rem))] sm:w-[min(1120px,calc(100%-1.5rem))]">
                    <div className="max-w-[42rem]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                            Support
                        </p>
                        <h1 className="font-hero-display mt-2 text-[1.65rem] leading-[1.02] text-slate-950 sm:text-[2.3rem] lg:text-[2.85rem]">
                            Sourcing and follow-through.
                        </h1>
                        <p className="mt-3 max-w-[36rem] text-sm leading-6 text-slate-600 sm:text-[0.98rem] sm:leading-7">
                            Direct sourcing and support for selected automobile, yacht and business inquiries.
                        </p>
                        <div className="mt-5">
                            <NavLink
                                to="/contact"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b54f32] px-5 py-3 text-sm font-semibold !text-white shadow-[0_12px_26px_rgba(181,79,50,0.18)] transition duration-300 ease-out hover:-translate-y-0.5 hover:brightness-[0.97] hover:!text-white"
                            >
                                Send Inquiry
                                <ArrowUpRightIcon className="h-4 w-4" />
                            </NavLink>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-8 pt-5 sm:pb-12 sm:pt-6">
                <div className="mx-auto w-[min(1120px,calc(100%-1rem))] sm:w-[min(1120px,calc(100%-1.5rem))]">
                    <div className="grid gap-4 lg:grid-cols-12">
                        {serviceCards.map(({ title, description, Icon, className }) => (
                            <article
                                key={title}
                                className={[
                                    "rounded-[1.45rem] border border-stone-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,246,240,0.94))] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.07)] sm:p-6",
                                    className
                                ].join(" ")}
                            >
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200/80 bg-white/84 text-stone-400">
                                    <Icon className="h-[1.125rem] w-[1.125rem]" />
                                </span>
                                <h2 className="font-hero-display mt-5 text-[1.2rem] leading-tight text-slate-950 sm:text-[1.35rem]">
                                    {title}
                                </h2>
                                <p className="mt-2.5 max-w-[32ch] text-sm leading-6 text-slate-600">
                                    {description}
                                </p>
                            </article>
                        ))}
                    </div>

                    <div className="mt-5 flex flex-col gap-3 rounded-[1.3rem] border border-stone-200/80 bg-white/72 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                                Concierge Support
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                Need a direct starting point for a selected inquiry?
                            </p>
                        </div>
                        <NavLink
                            to="/contact"
                            className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-950 hover:bg-stone-50"
                        >
                            Contact Robarol
                        </NavLink>
                    </div>
                </div>
            </section>
        </>
    );
}
