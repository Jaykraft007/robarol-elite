import { useEffect, useMemo, useState } from "react";
import type { InquiryStatus } from "@robarol/shared";

import { SearchIcon } from "../components/ui/site-icon";
import { useSiteData } from "../modules/site-data/site-data.context";

type FilterStatus = "all" | InquiryStatus;

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function buildWhatsAppLink(phone?: string) {
    if (!phone) return "#";

    const cleaned = phone.replace(/[^\d]/g, "");
    return cleaned ? `https://wa.me/${cleaned}` : "#";
}

export function AdminInquiriesPage() {
    const { inquiries, isInquiriesLoading, loadAdminInquiries, updateInquiryStatus } = useSiteData();
    const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadAdminInquiries().catch((error) => {
            console.error(error);
        });
    }, [loadAdminInquiries]);

    const filteredInquiries = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return inquiries.filter((inquiry) => {
            if (selectedStatus !== "all" && inquiry.status !== selectedStatus) return false;
            if (!normalizedSearch) return true;

            return [
                inquiry.fullName,
                inquiry.email,
                inquiry.phone,
                inquiry.location,
                inquiry.listingTitle ?? "",
                inquiry.message,
                inquiry.source
            ]
                .join(" ")
                .toLowerCase()
                .includes(normalizedSearch);
        });
    }, [inquiries, searchTerm, selectedStatus]);

    const counts = useMemo(() => {
        return {
            total: inquiries.length,
            new: inquiries.filter((item) => item.status === "new").length,
            contacted: inquiries.filter((item) => item.status === "contacted").length,
            closed: inquiries.filter((item) => item.status === "closed").length
        };
    }, [inquiries]);

    const handleStatusChange = async (inquiryId: string, status: InquiryStatus) => {
        await updateInquiryStatus(inquiryId, status);
    };

    return (
        <>
            <section className="rounded-[1.6rem] border border-stone-200 bg-white/90 px-5 py-5 shadow-[0_14px_38px_rgba(15,23,42,0.05)] sm:px-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <h2 className="font-display text-[1.85rem] leading-tight text-slate-950">
                            Inquiries
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Manage requests and follow up faster.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <button
                            type="button"
                            onClick={() => setSelectedStatus("all")}
                            className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                                selectedStatus === "all"
                                    ? "border-[#b54f32] bg-[#b54f32] text-white"
                                    : "border-stone-200 bg-stone-50 text-slate-600 hover:bg-white"
                            }`}
                        >
                            {counts.total} total
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedStatus("new")}
                            className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                                selectedStatus === "new"
                                    ? "border-[#b54f32] bg-[#b54f32] text-white"
                                    : "border-stone-200 bg-stone-50 text-slate-600 hover:bg-white"
                            }`}
                        >
                            {counts.new} new
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedStatus("contacted")}
                            className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                                selectedStatus === "contacted"
                                    ? "border-[#b54f32] bg-[#b54f32] text-white"
                                    : "border-stone-200 bg-stone-50 text-slate-600 hover:bg-white"
                            }`}
                        >
                            {counts.contacted} contacted
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedStatus("closed")}
                            className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                                selectedStatus === "closed"
                                    ? "border-[#b54f32] bg-[#b54f32] text-white"
                                    : "border-stone-200 bg-stone-50 text-slate-600 hover:bg-white"
                            }`}
                        >
                            {counts.closed} closed
                        </button>
                    </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 lg:flex-row">
                    <label className="relative min-w-0 flex-1">
                        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search by name, email, phone, listing or message"
                            className="h-12 w-full rounded-full border border-stone-200 bg-stone-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-[#b54f32] focus:bg-white focus:ring-4 focus:ring-[#b54f32]/10"
                        />
                    </label>

                    <select
                        value={selectedStatus}
                        onChange={(event) => setSelectedStatus(event.target.value as FilterStatus)}
                        className="h-12 rounded-full border border-stone-200 bg-stone-50 px-4 text-sm text-slate-950 outline-none transition focus:border-[#b54f32] focus:bg-white focus:ring-4 focus:ring-[#b54f32]/10"
                    >
                        <option value="all">All status</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </section>

            <section className="mt-5">
                {isInquiriesLoading ? (
                    <div className="rounded-[1.6rem] border border-stone-200 bg-white px-5 py-10 text-center shadow-[0_14px_38px_rgba(15,23,42,0.05)]">
                        <p className="text-sm text-slate-600">Loading inquiries...</p>
                    </div>
                ) : filteredInquiries.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredInquiries.map((inquiry) => {
                            const isListingInquiry = Boolean(inquiry.listingTitle);
                            const whatsappLink = buildWhatsAppLink(inquiry.phone);

                            return (
                                <article
                                    key={inquiry.id}
                                    className="rounded-[1.6rem] border border-stone-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)] sm:p-5"
                                >
                                    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr_14rem]">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
                                                    {inquiry.source === "contact_page" ? "Contact page" : "Listing inquiry"}
                                                </span>
                                                <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                                                    {formatDate(inquiry.createdAt)}
                                                </span>
                                            </div>

                                            <h3 className="mt-3 text-lg font-semibold text-slate-950">
                                                {inquiry.fullName}
                                            </h3>

                                            <div className="mt-2 grid gap-1 text-sm text-slate-600">
                                                <p>{inquiry.email}</p>
                                                <p>{inquiry.phone}</p>
                                                <p>{inquiry.location}</p>
                                            </div>
                                        </div>

                                        <div className="min-w-0">
                                            <div className="rounded-[1.2rem] border border-stone-200 bg-stone-50/70 p-4">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                                                    Interested in
                                                </p>
                                                <h4 className="mt-2 text-sm font-semibold text-slate-950">
                                                    {isListingInquiry ? inquiry.listingTitle : "General inquiry"}
                                                </h4>

                                                <div className="mt-4 border-t border-stone-200 pt-4">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                                                        Message
                                                    </p>
                                                    <p className="mt-2 line-clamp-6 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                                        {inquiry.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 xl:items-end">
                                            <label className="grid w-full gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 xl:max-w-[12rem]">
                                                <span>Status</span>
                                                <select
                                                    value={inquiry.status}
                                                    onChange={(event) =>
                                                        handleStatusChange(inquiry.id, event.target.value as InquiryStatus)
                                                    }
                                                    className="h-11 rounded-full border border-stone-200 bg-stone-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#b54f32] focus:bg-white focus:ring-4 focus:ring-[#b54f32]/10"
                                                >
                                                    <option value="new">New</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="closed">Closed</option>
                                                </select>
                                            </label>

                                            <div className="grid w-full gap-2 xl:max-w-[12rem]">
                                                <a
                                                    href={`mailto:${inquiry.email}`}
                                                    className="rounded-full border border-stone-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 transition hover:border-[#b54f32]/30 hover:bg-stone-50"
                                                >
                                                    Reply email
                                                </a>

                                                <a
                                                    href={whatsappLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded-full bg-[#b54f32] px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_12px_24px_rgba(181,79,50,0.22)] transition hover:-translate-y-0.5 hover:bg-[#a7462b]"
                                                >
                                                    Open WhatsApp
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-[1.6rem] border border-stone-200 bg-white px-5 py-10 text-center shadow-[0_14px_38px_rgba(15,23,42,0.05)]">
                        <h2 className="font-display text-[1.6rem] text-slate-950">
                            No inquiries in this view.
                        </h2>
                        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-600">
                            Try another search term or status filter.
                        </p>
                    </div>
                )}
            </section>
        </>
    );
}
