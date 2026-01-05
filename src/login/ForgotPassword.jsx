import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setInfo("");

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to send reset email.");
            }

            setInfo(
                data.message ||
                "If an account exists for this email, a password reset link has been sent."
            );
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
                        theblushculture
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
                        Reset your password
                    </h1>
                    <p className="mt-2 text-sm text-slate-300/80">
                        Enter your email and we will send you a reset link
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <input
                            type="email"
                            autoFocus
                            placeholder="Email"
                            className="w-full rounded-3xl px-4 py-3 bg-white/10 border border-white/10 placeholder:text-slate-400 text-slate-100 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            disabled={loading}
                            className="w-full py-3 rounded-3xl font-semibold bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-sm shadow-lg active:scale-[0.995] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Sending link…" : "Send reset link"}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
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
