import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token.");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setInfo("");

        if (!password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Password reset failed.");
            }

            setInfo(data.message || "Password reset successful. You may now sign in.");

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2000);

        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleHomeRedirect = () => {
        window.location.href = '/';
    };

    return (
        <>
            <header className="left-0 w-full z-50 transition-all duration-1500">
                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-white">
                    {/* Logo */}
                    <a
                        href="#"
                        onClick={handleHomeRedirect}
                        className="text-2xl md:text-3xl font-bold tracking-widest uppercase hover:text-zinc-300 transition-colors"
                    >
                        INKVERSE
                    </a>
                </div>
            </header>
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-slate-100 relative overflow-hidden p-6">
                {/* Background glow */}
                <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
                    <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-white/3 blur-3xl" />
                </div>

                {/* Glass card */}
                <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl p-8">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Set a new password
                    </h1>
                    <p className="mt-2 text-sm text-slate-300/80">
                        Enter and confirm your new password
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <input
                            type="password"
                            autoFocus
                            placeholder="New password"
                            className="w-full rounded-3xl px-4 py-3 bg-white/10 border border-white/10 placeholder:text-slate-400 text-slate-100 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={!token}
                        />

                        <input
                            type="password"
                            placeholder="Confirm new password"
                            className="w-full rounded-3xl px-4 py-3 bg-white/10 border border-white/10 placeholder:text-slate-400 text-slate-100 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={!token}
                        />

                        {info && (
                            <div className="text-sm text-blue-300 bg-blue-900/20 px-3 py-2 rounded-md border border-blue-900/30">
                                {info}
                            </div>
                        )}

                        {error && (
                            <div className="text-sm text-rose-400 bg-rose-900/20 px-3 py-2 rounded-md border border-rose-900/30">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !token}
                            className="w-full py-3 rounded-3xl font-semibold bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-sm shadow-lg active:scale-[0.995] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Resetting password…" : "Reset password"}
                        </button>
                    </form>

                    <div className="mt-6 text-xs text-slate-400 text-center">
                        <button
                            onClick={() => navigate("/login")}
                            className="hover:text-slate-200 underline"
                        >
                            Back to sign in
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
