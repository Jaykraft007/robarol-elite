import { buildWhatsAppLink } from "../../utils/inquiry-links";
import { WhatsappIcon } from "../ui/site-icon";

interface FloatingChatButtonProps {
    phoneNumber: string;
}

export function FloatingChatButton({ phoneNumber }: FloatingChatButtonProps) {
    const href = buildWhatsAppLink(
        phoneNumber,
        "Hello Robarol, I would like to make an inquiry."
    );

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-[rgba(255,250,244,0.94)] px-2.5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_14px_28px_rgba(15,23,42,0.08)] backdrop-blur-[10px] transition duration-300 ease-out hover:-translate-y-0.5 hover:border-emerald-300/70 hover:bg-white sm:bottom-6 sm:right-6 sm:gap-2.5 sm:px-3.5 lg:bottom-7 lg:right-7"
            aria-label="Chat with Robarol on WhatsApp"
        >
            <span className="inline-flex h-[2.125rem] w-[2.125rem] items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_10px_20px_rgba(22,163,74,0.22)] sm:h-[2.375rem] sm:w-[2.375rem]">
                <WhatsappIcon className="h-4 w-4" />
            </span>
            <span className="hidden text-[13px] md:inline">WhatsApp</span>
        </a>
    );
}
