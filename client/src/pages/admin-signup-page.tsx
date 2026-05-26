import { Navigate, NavLink } from "react-router";

import { useAdminSession } from "../modules/admin-session/admin-session.context";
import { companyProfile } from "../modules/site-data/site-data.data";

export function AdminSignupPage() {
    const { session } = useAdminSession();

    if (session) {
        return <Navigate to="/admin/listings" replace />;
    }

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#faf6ee_0%,#f5efe6_50%,#fbfaf7_100%)] px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-md">
                <div className="rounded-[1.8rem] border border-stone-200 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)] sm:p-8">
                    <img
                        src="/assets/robarol-logo.png"
                        alt={`${companyProfile.name} logo`}
                        className="h-16 w-auto object-contain"
                    />
                    <h1 className="font-display mt-6 text-[2rem] leading-tight text-slate-950">
                        Admin setup
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        Admin accounts are created manually in Supabase for now. Create the auth user in Supabase Auth,
                        add the same user ID to the <code>admin_users</code> table, then sign in here.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <NavLink
                            to="/admin/login"
                            className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(181,79,50,0.18)] transition hover:brightness-[0.96]"
                        >
                            Go to login
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}
