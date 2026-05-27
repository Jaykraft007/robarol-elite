import type { ReactNode, SVGProps } from "react";

type SiteIconProps = SVGProps<SVGSVGElement>;

function BaseIcon({ children, ...props }: SiteIconProps & { children: ReactNode }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            {children}
        </svg>
    );
}

export function CarIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M5 16l1.5-4.5A2 2 0 0 1 8.4 10h7.2a2 2 0 0 1 1.9 1.5L19 16" />
            <path d="M4 16h16v3a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1V18h-9v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3Z" />
            <circle cx="7.5" cy="16.5" r="1" />
            <circle cx="16.5" cy="16.5" r="1" />
        </BaseIcon>
    );
}

export function YachtIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M4 16.5 9 13V5l6 3.5V12l4 1.5v3" />
            <path d="M3 18c1 .9 2 .9 3 0s2-.9 3 0 2 .9 3 0 2-.9 3 0 2 .9 3 0 2-.9 3 0" />
        </BaseIcon>
    );
}

export function PropertyIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M4 11.5 12 5l8 6.5" />
            <path d="M6.5 10.5V19h11v-8.5" />
            <path d="M10 19v-5h4v5" />
        </BaseIcon>
    );
}

export function BriefcaseIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <rect x="4" y="7" width="16" height="12" rx="2.5" />
            <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
            <path d="M4 11.5h16" />
        </BaseIcon>
    );
}

export function WalletIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M5 8.5h12.5A1.5 1.5 0 0 1 19 10v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18V8.5Z" />
            <path d="M5 8.5V7A2 2 0 0 1 7 5h9" />
            <path d="M19 12.5h-4a1.5 1.5 0 0 0 0 3h4" />
        </BaseIcon>
    );
}

export function GlobeIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <circle cx="12" cy="12" r="8" />
            <path d="M4.5 9.5h15" />
            <path d="M4.5 14.5h15" />
            <path d="M12 4c2 2.2 3 5 3 8s-1 5.8-3 8c-2-2.2-3-5-3-8s1-5.8 3-8Z" />
        </BaseIcon>
    );
}

export function ArrowUpRightIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M7 17 17 7" />
            <path d="M9 7h8v8" />
        </BaseIcon>
    );
}

export function CheckIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="m5.5 12.5 4 4L18.5 7.5" />
        </BaseIcon>
    );
}

export function RowsIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M5 7.5h14" />
            <path d="M5 12h14" />
            <path d="M5 16.5h14" />
        </BaseIcon>
    );
}

export function PlusIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M12 5v14" />
            <path d="M5 12h14" />
        </BaseIcon>
    );
}

export function MapPinIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M12 21s6-4.5 6-10a6 6 0 1 0-12 0c0 5.5 6 10 6 10Z" />
            <circle cx="12" cy="11" r="2.5" />
        </BaseIcon>
    );
}

export function PhoneIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M6.7 3.5h3l1.2 3.8-1.7 1.9a14 14 0 0 0 5 5l1.9-1.7 3.8 1.2v3a1.5 1.5 0 0 1-1.6 1.5A16.8 16.8 0 0 1 5.2 5.1 1.5 1.5 0 0 1 6.7 3.5Z" />
        </BaseIcon>
    );
}

export function MailIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m4 7 8 6 8-6" />
        </BaseIcon>
    );
}

export function InstagramIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <rect x="4" y="4" width="16" height="16" rx="4" />
            <circle cx="12" cy="12" r="3.5" />
            <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
        </BaseIcon>
    );
}

export function FacebookIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M14.5 8H17V4.5h-2.5c-3 0-4.5 1.8-4.5 4.7V12H7v3.5h3V20h3.8v-4.5H17L17.6 12h-3.8V9.6c0-1 .3-1.6 1.7-1.6Z" />
        </BaseIcon>
    );
}

export function SearchIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
        </BaseIcon>
    );
}

export function EyeIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle cx="12" cy="12" r="2.8" />
        </BaseIcon>
    );
}

export function EyeOffIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M3 3 21 21" />
            <path d="M10.6 5.3A10.8 10.8 0 0 1 12 5.2c6 0 9.5 6 9.5 6a18.6 18.6 0 0 1-3.3 3.9" />
            <path d="M6.2 6.3A18.8 18.8 0 0 0 2.5 12s3.5 6 9.5 6c1.2 0 2.3-.2 3.4-.6" />
            <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </BaseIcon>
    );
}

export function StarIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="m12 4 2.5 5 5.5.8-4 3.8 1 5.4-5-2.6-5 2.6 1-5.4-4-3.8 5.5-.8L12 4Z" />
        </BaseIcon>
    );
}

export function CopyIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <rect x="9" y="9" width="10" height="10" rx="2" />
            <rect x="5" y="5" width="10" height="10" rx="2" />
        </BaseIcon>
    );
}

export function PencilIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="m14 5 5 5" />
            <path d="M4 20h5l10-10a1.8 1.8 0 0 0 0-2.5l-2.5-2.5a1.8 1.8 0 0 0-2.5 0L4 15v5Z" />
        </BaseIcon>
    );
}

export function TrashIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M4 7h16" />
            <path d="M9 7V4h6v3" />
            <path d="m6 7 1 13h10l1-13" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
        </BaseIcon>
    );
}

export function UploadIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M12 16V6" />
            <path d="m8.5 9.5 3.5-3.5 3.5 3.5" />
            <path d="M5 18.5v1a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-1" />
        </BaseIcon>
    );
}

export function ChevronDownIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="m6 9 6 6 6-6" />
        </BaseIcon>
    );
}

export function ChevronLeftIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="m15 6-6 6 6 6" />
        </BaseIcon>
    );
}

export function ChevronRightIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="m9 6 6 6-6 6" />
        </BaseIcon>
    );
}

export function WhatsappIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M20 11.2A8.2 8.2 0 0 1 8 18.4L4 20l1.7-3.8A8.2 8.2 0 1 1 20 11.2Z" />
            <path d="M9.4 8.8c.2-.4.5-.4.7-.4h.6c.2 0 .4 0 .5.4l.7 1.8c.1.2 0 .4-.1.6l-.5.6a5.8 5.8 0 0 0 2.9 2.8l.7-.5c.1-.1.4-.2.6-.1l1.7.7c.4.2.4.4.4.6v.6c0 .2-.1.5-.5.7-.5.3-1.2.5-1.9.3a8.9 8.9 0 0 1-5.3-5.3c-.2-.7 0-1.4.3-1.8Z" />
        </BaseIcon>
    );
}

export function MenuIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
        </BaseIcon>
    );
}

export function CloseIcon(props: SiteIconProps) {
    return (
        <BaseIcon {...props}>
            <path d="m6 6 12 12" />
            <path d="m18 6-12 12" />
        </BaseIcon>
    );
}
