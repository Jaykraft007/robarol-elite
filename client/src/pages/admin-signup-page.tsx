import { useState, type FormEvent } from "react";
import { Navigate, NavLink, useNavigate } from "react-router";

import { useAdminSession } from "../modules/admin-session/admin-session.context";
import { ApiError } from "../modules/core/api-client";
import { companyProfile } from "../modules/site-data/site-data.data";

export function AdminSignupPage() {
    const navigate = useNavigate();
    const { session, signup } = useAdminSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signupSecret, setSignupSecret] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (session) {
        return <Navigate to="/admin/listings" replace />;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            await signup(email, password, signupSecret);
            navigate("/admin/listings", { replace: true });
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorMessage([
                    error.message,
                    error.requestId ? `Request ID: ${error.requestId}.` : null
                ].filter(Boolean).join(" "));
            } else {
                setErrorMessage("Unable to create admin right now.");
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
                        Create admin
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Create the first admin account and continue to the dashboard.
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
                                minLength={8}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="min-h-12 rounded-[1rem] border border-stone-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#b54f32] focus:ring-4 focus:ring-[#b54f32]/8"
                            />
                        </label>
                        <label className="grid gap-2 text-sm text-slate-700">
                            <span className="text-[13px] font-medium">Signup secret</span>
                            <input
                                type="text"
                                value={signupSecret}
                                onChange={(event) => setSignupSecret(event.target.value)}
                                placeholder="Only if configured"
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
                            {isSubmitting ? "Creating..." : "Create admin"}
                        </button>
                    </form>

                    <p className="mt-5 text-sm text-slate-600">
                        Already have an admin account?{" "}
                        <NavLink to="/admin/login" className="font-semibold text-[#b54f32] transition hover:text-[#8f3c28]">
                            Sign in
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
}
