interface SectionHeadingProps {
    eyebrow: string;
    title: string;
    description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
    return (
        <div className="mb-5 flex flex-col gap-2.5 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                    {eyebrow}
                </p>
                <h2 className="font-display text-[1.72rem] leading-[0.98] text-slate-950 sm:text-[2.55rem] md:text-[3.15rem]">
                    {title}
                </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-[0.98rem] sm:leading-7">
                {description}
            </p>
        </div>
    );
}
