import { useEffect, useMemo, useState } from "react";
import type { InquiryStatus } from "@robarol/shared";

import { SearchIcon } from "../components/ui/site-icon";
import { useSiteData } from "../modules/site-data/site-data.context";

type FilterStatus = "all" | InquiryStatus;

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
            if (selectedStatus !== "all" && inquiry.status !== selectedStatus) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

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

    const handleStatusChange = async (inquiryId: string, status: InquiryStatus) => {
        await updateInquiryStatus(inquiryId, status);
    };

    return (
        <>
            <section className="rounded-[1.7rem] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,238,0.98))] px-5 py-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:px-6 sm:py-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="font-display text-[1.8rem] leading-tight text-slate-950">Inquiries</h2>
                        <p className="mt-2 text-sm text-slate-600">Track incoming requests and follow-up status.</p>
                    </div>

                    <div className="flex flex-col gap-3 xl:min-w-[44rem] xl:flex-row">
                        <label className="relative min-w-0 flex-1">
                            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search inquiries"
                                className="h-12 w-full rounded-full border border-stone-200 bg-stone-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-[#b54f32] focus:bg-white focus:ring-4 focus:ring-[#b54f32]/8"
                            />
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(event) => setSelectedStatus(event.target.value as FilterStatus)}
                            className="h-12 rounded-full border border-stone-200 bg-stone-50 px-4 text-sm text-slate-950 outline-none transition focus:border-[#b54f32] focus:bg-white focus:ring-4 focus:ring-[#b54f32]/8"
                        >
                            <option value="all">All status</option>
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>
            </section>

            <section className="mt-5">
                {isInquiriesLoading ? (
                    <div className="rounded-[1.7rem] border border-stone-200 bg-white px-5 py-10 text-center shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:px-6">
                        <p className="text-sm text-slate-600">Loading inquiries...</p>
                    </div>
                ) : filteredInquiries.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredInquiries.map((inquiry) => (
                            <article
                                key={inquiry.id}
                                className="rounded-[1.55rem] border border-stone-200 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)]"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                                                {inquiry.source === "contact_page" ? "Contact page" : "Listing modal"}
                                            </span>
                                            <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                                                {new Date(inquiry.createdAt).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </span>
                                        </div>

                                        <h3 className="mt-3 text-lg font-semibold text-slate-950">{inquiry.fullName}</h3>
                                        <p className="mt-1 text-sm text-slate-600">{inquiry.email} · {inquiry.phone}</p>
                                        <p className="mt-1 text-sm text-slate-600">{inquiry.location}</p>
                                        <p className="mt-3 text-sm font-semibold text-slate-950">
                                            {inquiry.listingTitle ?? "General inquiry"}
                                        </p>
                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                            {inquiry.message}
                                        </p>
                                    </div>

                                    <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                                        <span>Status</span>
                                        <select
                                            value={inquiry.status}
                                            onChange={(event) => handleStatusChange(inquiry.id, event.target.value as InquiryStatus)}
                                            className="h-11 min-w-40 rounded-full border border-stone-200 bg-stone-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#b54f32] focus:bg-white focus:ring-4 focus:ring-[#b54f32]/8"
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </label>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[1.7rem] border border-stone-200 bg-white px-5 py-10 text-center shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:px-6">
                        <h2 className="font-display text-[1.7rem] text-slate-950">No inquiries in this view.</h2>
                        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-600">
                            Try a different search or filter.
                        </p>
                    </div>
                )}
            </section>
        </>
    );
}
