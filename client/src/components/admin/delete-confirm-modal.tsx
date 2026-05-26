import { CloseIcon, TrashIcon } from "../ui/site-icon";

interface DeleteConfirmModalProps {
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export function DeleteConfirmModal({ title, message, onCancel, onConfirm }: DeleteConfirmModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm"
            onClick={onCancel}
            role="presentation"
        >
            <div
                role="dialog"
                aria-modal="true"
                className="w-full max-w-md rounded-[1.75rem] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(250,246,238,0.97))] p-5 shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:p-6"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f7e7e1] text-[#8f3c28]">
                        <TrashIcon className="h-4 w-4" />
                    </span>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-slate-900 transition hover:border-slate-950"
                        aria-label="Close delete confirmation"
                    >
                        <CloseIcon className="h-4 w-4" />
                    </button>
                </div>

                <h2 className="font-display mt-5 text-[1.6rem] leading-tight text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{message}</p>

                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex flex-1 items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-stone-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="inline-flex flex-1 items-center justify-center rounded-full bg-[#b54f32] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(181,79,50,0.18)] transition hover:brightness-[0.96]"
                    >
                        Delete Listing
                    </button>
                </div>
            </div>
        </div>
    );
}
