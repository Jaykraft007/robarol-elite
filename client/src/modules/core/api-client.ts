export class ApiError extends Error {
    readonly statusCode: number;
    readonly details?: unknown;
    readonly requestId?: string;

    constructor(statusCode: number, message: string, details?: unknown, requestId?: string) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.details = details;
        this.requestId = requestId;
    }
}
