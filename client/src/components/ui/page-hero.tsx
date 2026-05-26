import type { ReactNode } from "react";

interface PageHeroProps {
    eyebrow: string;
    title: string;
    description: string;
    actions?: ReactNode;
}

export function PageHero({ eyebrow, title, description, actions }: PageHeroProps) {
    return (
        <section className="pt-2.5 sm:pt-5">
            <div className="mx-auto w-[min(1200px,calc(100%-1rem))] overflow-hidden rounded-[1.45rem] border border-stone-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.99),rgba(250,246,238,0.94))] px-4 py-4 shadow-[0_12px_34px_rgba(17,24,39,0.05)] sm:w-[min(1200px,calc(100%-1.5rem))] sm:rounded-[1.8rem] sm:px-7 sm:py-6 sm:shadow-[0_14px_42px_rgba(17,24,39,0.06)]">
                <div className="pointer-events-none absolute" />
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                    {eyebrow}
                </p>
                <h1 className="font-display max-w-4xl text-[1.75rem] leading-[1] text-slate-950 sm:text-[2.55rem] md:text-[3.2rem]">
                    {title}
                </h1>
                <p className="mt-2.5 max-w-3xl text-sm leading-6 text-slate-600 sm:mt-3 sm:text-[0.98rem] sm:leading-6.5">
                    {description}
                </p>
                {actions ? <div className="mt-3.5 flex flex-wrap gap-2.5 sm:mt-4">{actions}</div> : null}
            </div>
        </section>
    );
}
