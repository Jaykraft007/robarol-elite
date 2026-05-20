import { NavLink } from "react-router";

export function NotFoundPage() {
    return (
        <section className="flex min-h-[70vh] items-center justify-center px-6 py-20">
            <div className="w-full max-w-2xl rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-[0_16px_44px_rgba(15,23,42,0.06)] sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">404</p>
                <h1 className="font-display mt-4 text-5xl leading-none text-slate-950 sm:text-6xl">
                    Page not found.
                </h1>
                <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
                    Return home or continue browsing the active listings.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <NavLink
                        to="/"
                        className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(181,79,50,0.22)] transition hover:bg-[#8f3c28]"
                    >
                        Go Home
                    </NavLink>
                    <NavLink
                        to="/inventory"
                        className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-4 text-sm font-semibold text-slate-900 transition hover:border-slate-950"
                    >
                        View Listings
                    </NavLink>
                </div>
            </div>
        </section>
    );
}
