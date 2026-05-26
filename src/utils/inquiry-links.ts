interface InquiryPayload {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    listingName: string;
    price: string;
    message: string;
}

function normalizePhoneNumber(phoneNumber: string) {
    return phoneNumber.replace(/[^\d]/g, "");
}

export function buildWhatsAppLink(phoneNumber: string, message: string) {
    return `https://wa.me/${normalizePhoneNumber(phoneNumber)}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoLink(email: string, subject: string, body: string) {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function createInquiryMessage(payload: InquiryPayload) {
    const interestLine = payload.listingName === "General inquiry"
        ? "I would like to make a general inquiry about your services."
        : payload.price && payload.price !== "Request pricing"
            ? `I am interested in ${payload.listingName} listed at ${payload.price}.`
            : `I am interested in ${payload.listingName}.`;

    return [
        "Hello Robarol,",
        interestLine,
        "",
        `My name: ${payload.fullName}`,
        `Phone: ${payload.phone}`,
        `Email: ${payload.email}`,
        `Location: ${payload.location}`,
        `Message: ${payload.message || "No additional request provided."}`,
        "",
        "Please send me more details."
    ].join("\n");
}
