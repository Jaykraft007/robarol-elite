import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";

import { useSiteData } from "../../modules/site-data/site-data.context";
import { CloseIcon, MenuIcon } from "../ui/site-icon";
import { FloatingChatButton } from "./floating-chat-button";

function navLinkClassName(isActive: boolean) {
    return [
        "relative inline-flex items-center px-1 py-2 text-[13px] font-medium tracking-[0.02em] transition duration-300 ease-out after:absolute after:bottom-0 after:left-1 after:right-1 after:h-px after:rounded-full after:transition-colors after:duration-300",
        isActive
            ? "text-slate-950 after:bg-[#b54f32]/55"
            : "text-slate-500 after:bg-transparent hover:text-slate-950"
    ].join(" ");
}

function mobileNavLinkClassName(isActive: boolean) {
    return [
        "rounded-[1rem] px-4 py-3 text-sm font-medium transition duration-300 ease-out",
        isActive
            ? "bg-[#f2e4dc] text-slate-950 shadow-[inset_0_0_0_1px_rgba(181,79,50,0.14)]"
            : "text-slate-700 hover:bg-stone-50 hover:text-slate-950"
    ].join(" ");
}

export function SiteLayout() {
    const { company, navigation } = useSiteData();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;

        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMenuOpen]);

    if (!company) {
        return (
            <div className="flex min-h-screen items-center justify-center px-6">
                <div className="rounded-full border border-stone-200 bg-white px-6 py-3 text-sm uppercase tracking-[0.24em] text-stone-500 shadow-sm">
                    Loading
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <div className="pointer-events-none fixed inset-x-0 top-0 h-[20rem] bg-[radial-gradient(circle_at_top_left,rgba(181,79,50,0.07),transparent_34%),linear-gradient(180deg,rgba(255,249,242,0.8),transparent_70%)]" />

            <header className="font-ui-body sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
                <div className="mx-auto w-[min(1240px,calc(100%-1rem))] sm:w-[min(1240px,calc(100%-1.5rem))]">
                    <div className="flex items-center justify-between rounded-[1.3rem] border border-stone-200/80 bg-[rgba(255,250,244,0.82)] px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur-[10px] sm:rounded-[1.7rem] sm:px-5 sm:py-3.5 lg:px-6">
                        <NavLink to="/" className="flex min-w-0 items-center" onClick={() => setIsMenuOpen(false)}>
                            <img
                                src="/assets/robarol-logo.png"
                                alt={`${company.name} logo`}
                                className="h-12 w-auto max-w-[11.75rem] object-contain sm:h-[3.2rem] sm:max-w-[14rem]"
                            />
                        </NavLink>

                        <div className="flex items-center gap-2 md:hidden">
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen((value) => !value)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300/90 bg-white/92 text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.05)] transition hover:border-stone-400"
                                aria-label="Toggle navigation"
                                aria-expanded={isMenuOpen}
                            >
                                {isMenuOpen ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
                            </button>
                        </div>

                        <nav className="hidden md:flex md:items-center md:gap-8 lg:gap-10">
                            {navigation.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={link.to === "/"}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) => navLinkClassName(isActive)}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                            <NavLink
                                to="/contact"
                                onClick={() => setIsMenuOpen(false)}
                                className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-5 py-3 text-sm font-semibold tracking-[0.01em] !text-white shadow-[0_12px_26px_rgba(181,79,50,0.18)] transition duration-300 ease-out hover:-translate-y-0.5 hover:brightness-[0.98] visited:!text-white"
                            >
                                Start Inquiry
                            </NavLink>
                        </nav>
                    </div>
                </div>
            </header>

            <div
                className={[
                    "fixed inset-0 z-50 bg-slate-950/16 transition-opacity duration-300 md:hidden",
                    isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
                ].join(" ")}
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
            />
            <aside
                className={[
                    "fixed inset-y-0 right-0 z-50 w-[min(22rem,calc(100%-1rem))] border-l border-stone-200 bg-[linear-gradient(180deg,rgba(255,251,246,0.98),rgba(247,242,235,0.98))] px-4 pb-6 pt-4 shadow-[-18px_0_42px_rgba(15,23,42,0.1)] transition-transform duration-300 ease-out md:hidden",
                    isMenuOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
                ].join(" ")}
                aria-hidden={!isMenuOpen}
            >
                <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-4">
                    <img
                        src="/assets/robarol-logo.png"
                        alt={`${company.name} logo`}
                        className="h-11 w-auto max-w-[10.5rem] object-contain"
                    />
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(false)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.05)]"
                        aria-label="Close navigation"
                    >
                        <CloseIcon className="h-4 w-4" />
                    </button>
                </div>

                <nav className="mt-5 grid gap-1.5">
                    {navigation.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === "/"}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) => mobileNavLinkClassName(isActive)}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <NavLink
                    to="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#b54f32] px-4 py-3 text-sm font-semibold !text-white shadow-[0_12px_26px_rgba(181,79,50,0.18)] transition duration-300 ease-out hover:brightness-[0.98] visited:!text-white"
                >
                    Start Inquiry
                </NavLink>
            </aside>

            <main className="pb-4 sm:pb-6">
                <Outlet />
            </main>

            {location.pathname !== "/contact" ? <FloatingChatButton phoneNumber={company.whatsappNumber} /> : null}

            <footer className="pb-4 pt-2.5 sm:pb-7 sm:pt-5">
                <div className="mx-auto w-[min(1200px,calc(100%-1rem))] rounded-[1.35rem] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,246,240,0.95))] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] sm:w-[min(1200px,calc(100%-1.5rem))] sm:rounded-[1.65rem] sm:p-5 sm:shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
                    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.12fr_0.58fr_0.8fr] lg:items-start">
                        <div>
                            <img
                                src="/assets/robarol-logo.png"
                                alt={`${company.name} logo`}
                                className="h-[3.75rem] w-auto max-w-[13rem] object-contain sm:h-[4.35rem] sm:max-w-[16rem]"
                            />
                            <p className="mt-2.5 max-w-lg text-[13px] leading-6 text-slate-600 sm:text-sm sm:leading-6">
                                {company.description}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500 sm:text-[12px]">
                                Menu
                            </h4>
                            <div className="mt-3 grid gap-1.5 text-[13px] text-slate-600 sm:text-sm">
                                {navigation.map((link) => (
                                    <NavLink key={link.to} to={link.to} end={link.to === "/"} className="transition hover:text-slate-950">
                                        {link.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500 sm:text-[12px]">
                                Contact
                            </h4>
                            <div className="mt-3 grid gap-1.5 text-[13px] text-slate-600 sm:text-sm">
                                <a href={`mailto:${company.email}`} className="transition hover:text-slate-950">
                                    {company.email}
                                </a>
                                <a href={`tel:${company.phone.replace(/\s+/g, "")}`} className="transition hover:text-slate-950">
                                    {company.phone}
                                </a>
                                <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="transition hover:text-slate-950">
                                    {company.websiteLabel}
                                </a>
                                <a href={company.instagramUrl} target="_blank" rel="noreferrer" className="transition hover:text-slate-950">
                                    {company.instagramHandle}
                                </a>
                                <a href={company.facebookUrl} target="_blank" rel="noreferrer" className="transition hover:text-slate-950">
                                    Facebook
                                </a>
                                <NavLink to="/contact" className="transition hover:text-slate-950">
                                    Start inquiry
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 border-t border-stone-200 pt-3 text-[12px] text-stone-500 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                        <span>&copy; {new Date().getFullYear()} {company.name}. All rights reserved.</span>
                        <span>{company.tagline}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
