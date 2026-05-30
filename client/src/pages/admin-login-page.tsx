import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";

import { useAdminSession } from "../modules/admin-session/admin-session.context";
import { companyProfile } from "../modules/site-data/site-data.data";
import { ApiError } from "../modules/core/api-client";

export function AdminLoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { session, login } = useAdminSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const redirectTarget = (location.state as { from?: string } | null)?.from ?? "/admin/listings";

    if (session) {
        return <Navigate to={redirectTarget} replace />;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate(redirectTarget, { replace: true });
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Unable to sign in right now.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        Admin login
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Sign in to manage listings, uploads, and inquiries.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                        <label className="grid gap-2 text-sm text-slate-700">
                            <span className="text-[13px] font-medium">Email</span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="min-h-12 rounded-[1rem] border border-stone-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8"
                            />
                        </label>
                        <label className="grid gap-2 text-sm text-slate-700">
                            <span className="text-[13px] font-medium">Password</span>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="min-h-12 rounded-[1rem] border border-stone-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8"
                            />
                        </label>

                        {errorMessage ? (
                            <div className="rounded-[1rem] border border-[#e3b4a6] bg-[#fdf1ec] px-4 py-3 text-sm text-[#8f3c28]">
                                {errorMessage}
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center rounded-full bg-[#b54f32] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(181,79,50,0.18)] transition hover:brightness-[0.96] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                    
                </div>
            </div>
        </div>
    );
}
