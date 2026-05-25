import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";

import { useSiteData } from "../../modules/site-data/site-data.context";
import { CloseIcon, MenuIcon, PlusIcon } from "../ui/site-icon";

interface AdminNavItem {
    label: string;
    to: string;
}

const navItems: AdminNavItem[] = [
    { label: "Listings", to: "/admin/listings" },
    { label: "Add Listing", to: "/admin/listings/new" }
];

function getPageTitle(pathname: string) {
    if (pathname.endsWith("/new")) {
        return "Add listing";
    }

    if (pathname.includes("/edit")) {
        return "Edit listing";
    }

    return "Listings";
}

function navLinkClassName(isActive: boolean) {
    return [
        "rounded-[1rem] px-4 py-3 text-sm font-semibold transition",
        isActive ? "bg-[#f7e7e1] text-[#8f3c28]" : "text-slate-700 hover:bg-stone-50 hover:text-slate-950"
    ].join(" ");
}

export function AdminLayout() {
    const { company } = useSiteData();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pageTitle = useMemo(() => getPageTitle(location.pathname), [location.pathname]);

    if (!company) {
        return null;
    }

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#faf6ee_0%,#f5efe6_50%,#fbfaf7_100%)]">
            <div className="pointer-events-none fixed -left-24 top-0 h-80 w-80 rounded-full bg-[#d87d63]/14 blur-3xl" />
            <div className="pointer-events-none fixed bottom-0 right-[-5rem] h-72 w-72 rounded-full bg-stone-300/40 blur-3xl" />

            <div className="mx-auto flex min-h-screen w-[min(1400px,calc(100%-1rem))] gap-4 py-3 sm:w-[min(1400px,calc(100%-1.5rem))] sm:gap-5 sm:py-5">
                <aside className="hidden w-72 shrink-0 rounded-[2rem] border border-stone-200 bg-white/94 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.07)] backdrop-blur lg:flex lg:flex-col">
                    <NavLink to="/admin/listings" className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-slate-950 font-display text-sm font-bold text-white">
                            RB
                        </span>
                        <span>
                            <span className="block text-sm font-extrabold uppercase tracking-[0.2em] text-slate-950">{company.shortName}</span>
                            <span className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">Inventory manager</span>
                        </span>
                    </NavLink>

                    <nav className="mt-8 grid gap-2">
                        {navItems.map((item) => (
                            <NavLink key={item.to} to={item.to} end={item.to === "/admin/listings"} className={({ isActive }) => navLinkClassName(isActive)}>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                <div className="min-w-0 flex-1">
                    <header className="sticky top-3 z-30 rounded-[1.65rem] border border-stone-200 bg-white/94 px-4 py-4 shadow-[0_12px_34px_rgba(15,23,42,0.07)] backdrop-blur sm:px-5 lg:px-6">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsMenuOpen((value) => !value)}
                                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 text-slate-900 lg:hidden"
                                    aria-label="Toggle admin navigation"
                                    aria-expanded={isMenuOpen}
                                >
                                    {isMenuOpen ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
                                </button>
                                <div>
                                    <h1 className="font-display text-[1.45rem] leading-tight text-slate-950 sm:text-[1.9rem]">{pageTitle}</h1>
                                    <p className="text-sm text-stone-500">Inventory manager</p>
                                </div>
                            </div>

                            <NavLink
                                to="/admin/listings/new"
                                className="inline-flex items-center gap-2 rounded-full bg-[#b54f32] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(181,79,50,0.18)] transition hover:brightness-[0.96] sm:px-5 sm:py-3"
                            >
                                <PlusIcon className="h-4 w-4" />
                                Add Listing
                            </NavLink>
                        </div>

                        <div
                            className={[
                                "overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out lg:hidden",
                                isMenuOpen ? "mt-4 max-h-64 opacity-100" : "pointer-events-none mt-0 max-h-0 opacity-0"
                            ].join(" ")}
                        >
                            <nav className="grid gap-2 rounded-[1.3rem] border border-stone-200 bg-stone-50/75 p-2.5">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.to === "/admin/listings"}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={({ isActive }) => navLinkClassName(isActive)}
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                    </header>

                    <main className="pt-4 sm:pt-5">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
