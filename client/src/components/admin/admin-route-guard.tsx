import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router";

import { useAdminSession } from "../../modules/admin-session/admin-session.context";

export function AdminRouteGuard({ children }: PropsWithChildren) {
    const { isLoading, session } = useAdminSession();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center px-6">
                <div className="rounded-full border border-stone-200 bg-white px-6 py-3 text-sm uppercase tracking-[0.24em] text-stone-500 shadow-sm">
                    Loading
                </div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
    }

    return <>{children}</>;
}
