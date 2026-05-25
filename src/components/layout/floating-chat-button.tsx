import { buildWhatsAppLink } from "../../utils/inquiry-links";
import { WhatsappIcon } from "../ui/site-icon";

interface FloatingChatButtonProps {
    phoneNumber: string;
}

export function FloatingChatButton({ phoneNumber }: FloatingChatButtonProps) {
    const href = buildWhatsAppLink(
        phoneNumber,
        "Hello Robarol, I would like to learn more about your available listings."
    );

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-2.5 right-2.5 z-40 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/96 px-2.5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_12px_28px_rgba(15,23,42,0.1)] backdrop-blur transition duration-300 ease-out hover:-translate-y-0.5 hover:border-emerald-300 hover:brightness-[1.02] sm:bottom-5 sm:right-5 sm:gap-3 sm:px-4 lg:bottom-6 lg:right-6"
            aria-label="Chat with Robarol on WhatsApp"
        >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[inset_0_-4px_10px_rgba(0,0,0,0.12)] sm:h-10 sm:w-10">
                <WhatsappIcon className="h-4 w-4" />
            </span>
            <span className="hidden md:inline">WhatsApp</span>
        </a>
    );
}
