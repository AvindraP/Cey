import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RegisterPage() {
    const [prefName, setPrefName] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setInfo("");

        try {
            const res = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pref_name: prefName, full_name: fullName, email, password }),
                credentials: "include"
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong");
            } else {
                setInfo("Account created. Please verify your email.");
            }
        } catch (err) {
            setError("Network error.");
        }

        setLoading(false);
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-slate-100 relative overflow-hidden p-6">
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-white/3 blur-3xl" />
            </div>

            <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl p-8">
                <h1 className="text-3xl font-semibold tracking-tight">Create Account</h1>
                <p className="mt-2 text-sm text-slate-300/80">Fill out your details</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <input
                        type="text"
                        placeholder="Preferred name"
                        className="w-full rounded-3xl px-4 py-3 bg-white/10 border border-white/10 placeholder:text-slate-400 text-slate-100 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm"
                        value={prefName}
                        onChange={(e) => setPrefName(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Full name"
                        className="w-full rounded-3xl px-4 py-3 bg-white/10 border border-white/10 placeholder:text-slate-400 text-slate-100 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full rounded-3xl px-4 py-3 bg-white/10 border border-white/10 placeholder:text-slate-400 text-slate-100 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full rounded-3xl px-4 py-3 bg-white/10 border border-white/10 placeholder:text-slate-400 text-slate-100 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                        {loading ? "Creating…" : "Create account"}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                    <a href="/login" className="hover:text-slate-200 underline">
                        Already have an account
                    </a>
                </div>
            </section>
        </main>
    );
}
