import { NavLink } from "react-router";

import { ArrowUpRightIcon, CheckIcon, WhatsappIcon } from "../components/ui/site-icon";
import { useSiteData } from "../modules/site-data/site-data.context";
import { buildWhatsAppLink } from "../utils/inquiry-links";

const trainingPrograms = [
    {
        title: "Model personal training",
        price: "$200/hr",
        label: "Shape and conditioning",
        description: "Focused personal training for posture, conditioning and a lean presentation-driven fitness routine.",
        points: ["Form-focused training", "Body-conditioning support", "Private training sessions"]
    },
    {
        title: "Regular personal training",
        price: "$90/hr",
        label: "Everyday fitness",
        description: "Straightforward personal training for strength, movement and consistency, tailored to your current level.",
        points: ["General fitness support", "Progress-based sessions", "Flexible training focus"]
    },
    {
        title: "Competitive swimming",
        price: "$250/hr",
        label: "Performance coaching",
        description: "Private coaching for swimmers who want sharper technique, stronger endurance and focused race preparation.",
        points: ["Stroke refinement", "Pace and endurance work", "One-to-one guidance"]
    },
    {
        title: "Beginner swimming",
        price: "$350 for 5 sessions",
        label: "Starter program",
        description: "A guided session block for beginners building confidence, water control and steady swimming fundamentals.",
        points: ["5-session bundle", "Confidence building", "Foundational technique"]
    }
] as const;

const trainingHighlights = [
    "Personal fitness training led as a one-to-one service",
    "Model-focused conditioning and presentation support",
    "Regular training for strength, movement and consistency",
    "Swimming coaching for competitive and beginner levels",
    "Direct inquiry for pricing, availability and scheduling"
] as const;

export function FitnessPage() {
    const { company } = useSiteData();
    const whatsappLink = company
        ? buildWhatsAppLink(company.whatsappNumber, "Hello Robarol, I would like to inquire about fitness training and swimming coaching.")
        : null;

    return (
        <>
            <section className="pt-2.5 sm:pt-4">
                <div className="mx-auto grid w-[min(1120px,calc(100%-1rem))] gap-4 sm:w-[min(1120px,calc(100%-1.5rem))] lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
                    <div className="flex flex-col justify-center">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                            Fitness
                        </p>
                        <h1 className="font-hero-display mt-2 max-w-[13ch] text-[1.7rem] leading-[1.02] text-slate-950 sm:text-[2.35rem] lg:text-[2.95rem]">
                            Personal fitness training with swimming support.
                        </h1>
                        <p className="mt-3 max-w-[36rem] text-sm leading-6 text-slate-600 sm:text-[0.98rem] sm:leading-7">
                            We offer model personal training, regular personal training, competitive swimming and beginner swimming sessions with direct inquiry for availability and scheduling.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2.5">
                            <NavLink
                                to="/contact"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b54f32] px-5 py-3 text-sm font-semibold !text-white shadow-[0_12px_26px_rgba(181,79,50,0.18)] transition duration-300 ease-out hover:-translate-y-0.5 hover:brightness-[0.97] hover:!text-white"
                            >
                                Send Inquiry
                                <ArrowUpRightIcon className="h-4 w-4" />
                            </NavLink>
                            {whatsappLink ? (
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200/85 bg-emerald-50/80 px-5 py-3 text-sm font-semibold text-emerald-700 transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-emerald-100/85"
                                >
                                    <WhatsappIcon className="h-4 w-4" />
                                    WhatsApp Inquiry
                                </a>
                            ) : null}
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {["Model training", "Personal fitness", "Body conditioning", "Swimming coaching"].map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-stone-200 bg-white/85 px-3 py-1.5 text-[12px] font-medium text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.04)]"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[1.08fr_0.92fr]">
                        <article className="group relative min-h-[24rem] overflow-hidden rounded-[1.55rem] border border-stone-900/80 bg-black shadow-[0_18px_40px_rgba(15,23,42,0.16)] sm:min-h-[31rem]">
                            <img
                                src="/assets/fitness-2.png"
                                alt="Bodycraft Fitness owner in a brand portrait"
                                className="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,5,0.12),rgba(4,4,5,0.5)_48%,rgba(4,4,5,0.88))]" />
                            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/62">
                                    Brand Owner
                                </p>
                                {/* <h2 className="font-hero-display mt-2 max-w-[15ch] text-[1.38rem] leading-[1.04] text-white sm:text-[1.75rem]">
                                    Fitness training led by the face of the brand.
                                </h2>
                                <p className="mt-3 max-w-[28rem] text-sm leading-6 text-white/78">
                                    Clients can see the trainer behind Bodycraft Fitness and inquire directly for private sessions.
                                </p> */}
                                {/* <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white/82">
                                        1-to-1 coaching
                                    </span>
                                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white/82">
                                        Bodycraft Fitness
                                    </span>
                                </div> */}
                            </div>
                        </article>

                        <div className="grid gap-3">
                            <article className="group relative min-h-[11.6rem] overflow-hidden rounded-[1.45rem] border border-stone-900/80 bg-black shadow-[0_14px_34px_rgba(15,23,42,0.14)]">
                                <img
                                    src="/assets/fitness-1.png"
                                    alt="Bodycraft Fitness owner during a studio shoot"
                                    className="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                                />
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,5,0.08),rgba(4,4,5,0.62)_58%,rgba(4,4,5,0.84))]" />
                                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/62">
                                        Bodycraft Fitness PTE Ltd
                                    </p>
                                    <p className="mt-2 text-base font-semibold text-white">
                                        Model personal training
                                    </p>
                                    <p className="mt-1 text-sm text-[#ffd8c8]">
                                        $200/hr
                                    </p>
                                </div>
                            </article>

                            <article className="group relative min-h-[11.6rem] overflow-hidden rounded-[1.45rem] border border-stone-900/80 bg-black shadow-[0_14px_34px_rgba(15,23,42,0.14)]">
                                <img
                                    src="/assets/fitness-3.png"
                                    alt="Bodycraft Fitness branded portrait"
                                    className="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                                />
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,5,0.08),rgba(4,4,5,0.6)_58%,rgba(4,4,5,0.82))]" />
                                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/62">
                                        Added Service
                                    </p>
                                    <p className="mt-2 text-base font-semibold text-white">
                                        Swimming coaching available
                                    </p>
                                    <p className="mt-1 text-sm text-[#ffd8c8]">
                                        Competitive and beginner sessions
                                    </p>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-8 pt-5 sm:pb-12 sm:pt-6">
                <div className="mx-auto w-[min(1120px,calc(100%-1rem))] sm:w-[min(1120px,calc(100%-1.5rem))]">
                    <div className="grid gap-4 md:grid-cols-2">
                        {trainingPrograms.map(({ title, price, label, description, points }) => (
                            <article
                                key={title}
                                className="rounded-[1.45rem] border border-stone-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,246,240,0.94))] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.07)] sm:p-6"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                                            {label}
                                        </p>
                                        <h2 className="font-hero-display mt-2 text-[1.2rem] leading-tight text-slate-950 sm:text-[1.35rem]">
                                            {title}
                                        </h2>
                                    </div>
                                    <span className="rounded-full border border-[#d9b09f] bg-[#fbefe9] px-3 py-1.5 text-[12px] font-semibold text-[#8f3c28]">
                                        {price}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {description}
                                </p>
                                <div className="mt-4 grid gap-2">
                                    {points.map((point) => (
                                        <div key={point} className="flex items-start gap-2.5 text-sm text-slate-700">
                                            <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 text-slate-700">
                                                <CheckIcon className="h-3.5 w-3.5" />
                                            </span>
                                            <span>{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                        <article className="rounded-[1.4rem] border border-stone-200/80 bg-white/90 p-5 shadow-[0_10px_26px_rgba(15,23,42,0.05)] sm:p-6">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                                What We Offer
                            </p>
                            <h2 className="font-hero-display mt-2 text-[1.22rem] leading-tight text-slate-950 sm:text-[1.4rem]">
                                Direct support for personal fitness and swimming inquiries.
                            </h2>
                            <div className="mt-4 grid gap-2.5">
                                {trainingHighlights.map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-[1rem] border border-stone-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,245,239,0.96))] px-4 py-3 text-sm leading-6 text-slate-700"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="rounded-[1.4rem] border border-stone-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,246,240,0.95))] p-5 shadow-[0_10px_26px_rgba(15,23,42,0.05)] sm:p-6">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                                Inquiry
                            </p>
                            <h2 className="font-hero-display mt-2 text-[1.22rem] leading-tight text-slate-950 sm:text-[1.4rem]">
                                Tell us the fitness goal you want first and we will guide the next step.
                            </h2>
                            <p className="mt-3 max-w-[40rem] text-sm leading-6 text-slate-600">
                                Share the training service you want, your current level, preferred schedule and any goals you have in mind. Swimming support can also be included where needed.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-2.5">
                                <NavLink
                                    to="/contact"
                                    className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-950 hover:bg-stone-50"
                                >
                                    Contact Robarol
                                </NavLink>
                                {whatsappLink ? (
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200/85 bg-emerald-50/75 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-emerald-100/80"
                                    >
                                        <WhatsappIcon className="h-4 w-4" />
                                        Inquire on WhatsApp
                                    </a>
                                ) : null}
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </>
    );
}
