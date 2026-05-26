import { useState } from "react";
import { NavLink, Outlet } from "react-router";

import { useSiteData } from "../../modules/site-data/site-data.context";
import { CloseIcon, MenuIcon } from "../ui/site-icon";
import { FloatingChatButton } from "./floating-chat-button";

function navLinkClassName(isActive: boolean) {
    return [
        "rounded-full px-4 py-3 text-sm font-medium transition duration-300 ease-out",
        isActive
            ? "bg-[#b54f32]/12 text-[#8f3c28] shadow-[inset_0_0_0_1px_rgba(181,79,50,0.12)]"
            : "text-slate-600 hover:bg-stone-100 hover:text-slate-950"
    ].join(" ");
}

function mobileNavLinkClassName(isActive: boolean) {
    return [
        "rounded-[1rem] px-4 py-3 text-sm font-medium transition duration-300 ease-out",
        isActive ? "bg-[#b54f32]/10 text-[#8f3c28]" : "text-slate-700 hover:bg-stone-50 hover:text-slate-950"
    ].join(" ");
}

export function SiteLayout() {
    const { company, navigation, isLoading } = useSiteData();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (isLoading || !company) {
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
            <div className="pointer-events-none fixed -left-20 top-0 h-72 w-72 rounded-full bg-[#d87d63]/18 blur-3xl" />
            <div className="pointer-events-none fixed bottom-16 right-[-4rem] h-64 w-64 rounded-full bg-stone-300/50 blur-3xl" />

            <header className="sticky top-0 z-40 pt-2 sm:pt-3">
                <div className="mx-auto w-[min(1200px,calc(100%-1rem))] sm:w-[min(1200px,calc(100%-1.5rem))]">
                    <div className="flex items-center justify-between rounded-[1.35rem] border border-stone-200 bg-white/92 px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.07)] backdrop-blur sm:rounded-[2rem] sm:px-6 sm:py-4 sm:shadow-[0_12px_36px_rgba(15,23,42,0.08)]">
                        <NavLink to="/" className="flex min-w-0 items-center" onClick={() => setIsMenuOpen(false)}>
                            <img
                                src="/assets/robarol-logo.png"
                                alt={`${company.name} logo`}
                                className="h-11 w-auto max-w-[11rem] object-contain sm:h-14 sm:max-w-[14rem]"
                            />
                        </NavLink>

                        <div className="flex items-center gap-2 md:hidden">
                            <NavLink
                                to="/contact"
                                onClick={() => setIsMenuOpen(false)}
                                className="rounded-full bg-[#b54f32] px-3.5 py-2 text-[12px] font-bold !text-white visited:!text-white hover:!text-white shadow-[0_10px_22px_rgba(181,79,50,0.18)] transition duration-300 ease-out hover:brightness-[0.96]"
                            >
                                Inquiry
                            </NavLink>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen((value) => !value)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-slate-900"
                                aria-label="Toggle navigation"
                                aria-expanded={isMenuOpen}
                            >
                                {isMenuOpen ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
                            </button>
                        </div>

                        <nav className="hidden md:flex md:items-center md:gap-2">
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
                                className="rounded-full bg-[#b54f32] px-6 py-3.5 text-sm font-bold !text-white visited:!text-white hover:!text-white shadow-[0_12px_30px_rgba(181,79,50,0.22)] transition duration-300 ease-out hover:brightness-[0.96]"
                            >
                                Start Inquiry
                            </NavLink>
                        </nav>
                    </div>

                    <div
                        className={[
                            "overflow-hidden transition-[max-height,opacity,transform,margin] duration-300 ease-out md:hidden",
                            isMenuOpen ? "mt-2 max-h-80 translate-y-0 opacity-100" : "pointer-events-none mt-0 max-h-0 -translate-y-2 opacity-0"
                        ].join(" ")}
                    >
                        <nav className="grid gap-1.5 rounded-[1.35rem] border border-stone-200 bg-white/96 p-2.5 shadow-[0_12px_28px_rgba(15,23,42,0.07)] backdrop-blur">
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
                            <NavLink
                                to="/contact"
                                onClick={() => setIsMenuOpen(false)}
                                className="mt-1 inline-flex items-center justify-center rounded-[1rem] bg-[#b54f32] px-4 py-3 text-sm font-bold !text-white visited:!text-white hover:!text-white shadow-[0_10px_22px_rgba(181,79,50,0.18)] transition duration-300 ease-out hover:brightness-[0.96]"
                            >
                                Start Inquiry
                            </NavLink>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="pb-4 sm:pb-6">
                <Outlet />
            </main>

            <FloatingChatButton phoneNumber={company.whatsappNumber} />

            <footer className="pb-5 pt-4 sm:pb-10 sm:pt-8">
                <div className="mx-auto w-[min(1200px,calc(100%-1rem))] rounded-[1.45rem] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,246,240,0.94))] p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)] sm:w-[min(1200px,calc(100%-1.5rem))] sm:rounded-[1.75rem] sm:p-7 sm:shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
                    <div className="grid gap-5 md:grid-cols-[1.25fr_0.7fr_0.8fr]">
                        <div>
                            <img
                                src="/assets/robarol-logo.png"
                                alt={`${company.name} logo`}
                                className="h-20 w-auto max-w-[18rem] object-contain sm:h-24 sm:max-w-[22rem]"
                            />
                            <p className="mt-4 max-w-xl text-[13px] leading-6 text-slate-600 sm:text-sm sm:leading-7">
                                {company.description}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-5 md:contents">
                            <div>
                                <h4 className="text-[12px] font-bold uppercase tracking-[0.22em] text-stone-500 sm:text-sm">
                                    Menu
                                </h4>
                                <div className="mt-3 grid gap-2.5 text-[13px] text-slate-600 sm:mt-4 sm:gap-3 sm:text-sm">
                                    {navigation.map((link) => (
                                        <NavLink key={link.to} to={link.to} end={link.to === "/"} className="transition hover:text-slate-950">
                                            {link.label}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[12px] font-bold uppercase tracking-[0.22em] text-stone-500 sm:text-sm">
                                    Contact
                                </h4>
                                <div className="mt-3 grid gap-2.5 text-[13px] text-slate-600 sm:mt-4 sm:gap-3 sm:text-sm">
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
                    </div>
                    <div className="mt-5 flex flex-col gap-2 border-t border-stone-200 pt-3 text-[12px] text-stone-500 sm:mt-6 sm:gap-3 sm:pt-4 sm:text-sm sm:flex-row sm:items-center sm:justify-between">
                        <span>&copy; {new Date().getFullYear()} {company.name}. All rights reserved.</span>
                        <span>{company.tagline}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
