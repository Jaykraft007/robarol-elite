import { useState } from "react";
import { NavLink, Outlet } from "react-router";

import { useAdminSession } from "../../modules/admin-session/admin-session.context";
import { useSiteData } from "../../modules/site-data/site-data.context";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, MailIcon, MenuIcon, PlusIcon, RowsIcon } from "../ui/site-icon";

interface AdminNavItem {
    Icon: typeof RowsIcon;
    label: string;
    to: string;
}

const navItems: AdminNavItem[] = [
    { label: "Listings", to: "/admin/listings", Icon: RowsIcon },
    { label: "Inquiries", to: "/admin/inquiries", Icon: MailIcon },
    { label: "Add Listing", to: "/admin/listings/new", Icon: PlusIcon }
];

function navLinkClassName(isActive: boolean, compact: boolean) {
    return [
        "group/nav relative rounded-[0.95rem] text-sm font-semibold transition",
        compact ? "flex h-11 w-11 items-center justify-center" : "flex items-center gap-3 px-3.5 py-2.5",
        isActive ? "bg-[#f7e7e1] text-[#8f3c28]" : "text-slate-700 hover:bg-stone-50 hover:text-slate-950"
    ].join(" ");
}

export function AdminLayout() {
    const { company } = useSiteData();
    const { logout, session } = useAdminSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    if (!company) {
        return null;
    }

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#faf6ee_0%,#f5efe6_50%,#fbfaf7_100%)]">
            <div className="pointer-events-none fixed -left-24 top-0 h-80 w-80 rounded-full bg-[#d87d63]/14 blur-3xl" />
            <div className="pointer-events-none fixed bottom-0 right-[-5rem] h-72 w-72 rounded-full bg-stone-300/40 blur-3xl" />

            <div className="mx-auto flex min-h-screen w-[min(1360px,calc(100%-1rem))] gap-4 py-3 sm:w-[min(1360px,calc(100%-1.5rem))] sm:gap-4 sm:py-4">
                <aside
                    className={[
                        "hidden shrink-0 rounded-[1.6rem] border border-stone-200/80 bg-white/94 shadow-[0_14px_34px_rgba(15,23,42,0.06)] backdrop-blur transition-[width,padding] duration-300 ease-out lg:flex lg:flex-col",
                        isSidebarExpanded ? "w-60 p-4" : "w-[5.4rem] p-3"
                    ].join(" ")}
                >
                    <div className={["flex items-center", isSidebarExpanded ? "justify-between gap-3" : "justify-center"].join(" ")}>
                        <NavLink to="/admin/listings" className="flex min-w-0 items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 font-hero-display text-sm font-bold text-white">
                                RB
                            </span>
                            {isSidebarExpanded ? (
                                <span>
                                    <span className="block text-xs font-extrabold uppercase tracking-[0.18em] text-slate-950">{company.shortName}</span>
                                    <span className="block text-[10px] uppercase tracking-[0.18em] text-stone-500">Admin workspace</span>
                                </span>
                            ) : null}
                        </NavLink>
                        {isSidebarExpanded ? (
                            <button
                                type="button"
                                onClick={() => setIsSidebarExpanded(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                                aria-label="Collapse sidebar"
                                title="Collapse sidebar"
                            >
                                <ChevronLeftIcon className="h-4 w-4" />
                            </button>
                        ) : null}
                    </div>

                    {!isSidebarExpanded ? (
                        <button
                            type="button"
                            onClick={() => setIsSidebarExpanded(true)}
                            className="mt-5 inline-flex h-10 w-10 self-center items-center justify-center rounded-full border border-stone-300 bg-white text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                            aria-label="Expand sidebar"
                            title="Expand sidebar"
                        >
                            <ChevronRightIcon className="h-4 w-4" />
                        </button>
                    ) : null}

                    <nav className={["grid", isSidebarExpanded ? "mt-7 gap-1.5" : "mt-5 gap-2"].join(" ")}>
                        {navItems.map((item) => (
                            <NavLink key={item.to} to={item.to} end={item.to === "/admin/listings"} className={({ isActive }) => navLinkClassName(isActive, !isSidebarExpanded)}>
                                <item.Icon className="h-4 w-4 shrink-0" />
                                {isSidebarExpanded ? <span>{item.label}</span> : null}
                                {!isSidebarExpanded ? (
                                    <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-900 opacity-0 shadow-[0_12px_24px_rgba(15,23,42,0.12)] transition duration-200 group-hover/nav:opacity-100">
                                        {item.label}
                                    </span>
                                ) : null}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                <div className="min-w-0 flex-1">
                    <header className="sticky top-3 z-30 rounded-[1.45rem] border border-stone-200/85 bg-white/94 px-4 py-3.5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur sm:px-5">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsMenuOpen((value) => !value)}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-slate-900 lg:hidden"
                                    aria-label="Toggle admin navigation"
                                    aria-expanded={isMenuOpen}
                                >
                                    {isMenuOpen ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
                                </button>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                                        Admin workspace
                                    </p>
                                    <p className="mt-0.5 text-sm text-slate-700">{session?.email ?? "Inventory manager"}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => logout().catch((error) => console.error(error))}
                                className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                            >
                                Logout
                            </button>
                        </div>

                        <div
                            className={[
                                "overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out lg:hidden",
                                isMenuOpen ? "mt-4 max-h-64 opacity-100" : "pointer-events-none mt-0 max-h-0 opacity-0"
                            ].join(" ")}
                        >
                            <nav className="grid gap-1.5 rounded-[1.15rem] border border-stone-200 bg-stone-50/75 p-2.5">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.to === "/admin/listings"}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={({ isActive }) => navLinkClassName(isActive, false)}
                                    >
                                        <item.Icon className="h-4 w-4 shrink-0" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                    </header>

                    <main className="pt-4 sm:pt-4">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
