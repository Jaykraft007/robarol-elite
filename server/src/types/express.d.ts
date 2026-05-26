import type { AdminSession } from "@robarol/shared";

declare global {
    namespace Express {
        interface Request {
            adminSession?: AdminSession;
        }
    }
}

export {};
