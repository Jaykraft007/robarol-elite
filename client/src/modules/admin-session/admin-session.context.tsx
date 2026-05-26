import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import type { AdminSession } from "@robarol/shared";

import { ApiError } from "../core/api-client";
import {
    fetchAdminSession,
    loginAdmin,
    logoutAdmin,
    signupAdmin,
    subscribeToAdminAuthChanges
} from "./admin-session.service";

interface AdminSessionContextValue {
    session: AdminSession | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<AdminSession>;
    signup: (email: string, password: string, signupSecret?: string) => Promise<AdminSession>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<AdminSession | null>;
}

const AdminSessionContext = createContext<AdminSessionContextValue | null>(null);

export function AdminSessionProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<AdminSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshSession = async () => {
        try {
            const nextSession = await fetchAdminSession();
            setSession(nextSession);
            return nextSession;
        } catch (error) {
            if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 403)) {
                setSession(null);
                return null;
            }

            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshSession().catch((error) => {
            console.error(error);
            setSession(null);
            setIsLoading(false);
        });

        return subscribeToAdminAuthChanges(() => {
            void refreshSession();
        });
    }, []);

    const value: AdminSessionContextValue = {
        session,
        isLoading,
        login: async (email, password) => {
            const nextSession = await loginAdmin(email, password);
            setSession(nextSession);
            return nextSession;
        },
        signup: async (_email, _password, _signupSecret) => signupAdmin(),
        logout: async () => {
            await logoutAdmin();
            setSession(null);
        },
        refreshSession
    };

    return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession() {
    const context = useContext(AdminSessionContext);

    if (!context) {
        throw new Error("useAdminSession must be used within AdminSessionProvider.");
    }

    return context;
}
