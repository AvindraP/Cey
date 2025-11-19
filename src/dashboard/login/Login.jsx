import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../middleware/AuthProvider";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useContext(AuthContext);

    // Determine redirect based on referrer or default
    const from = location.state?.from?.pathname || null;

    // Show timeout message if redirected after session expiry
    useEffect(() => {
        if (location.state?.message) {
            setInfo(location.state.message);
            // Clear the message after 5 seconds
            const timer = setTimeout(() => setInfo(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setInfo("");

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const d = await response.json();

            if (!response.ok) {
                throw new Error(d.message || "Login failed");
            }

            // Fetch user info right after login
            const check = await fetch(`${API_BASE_URL}/auth/check`, {
                credentials: "include",
            });

            const data = await check.json();

            if (!check.ok) {
                throw new Error(data.message || "Auth failed");
            }

            setUser(data.user);

            // Redirect based on user type and referrer
            let redirectPath = '/';
            
            if (data.user.type === 'admin') {
                // Admin users go to dashboard
                redirectPath = from || '/dashboard';
            } else {
                // Customers go to homepage or the page they came from
                redirectPath = from || '/account';
            }

            navigate(redirectPath, { replace: true });
        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-slate-100 relative overflow-hidden p-6">
            {/* Background glow */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-white/3 blur-3xl" />
            </div>

            {/* Glass login card */}
            <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl p-8">
                <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
                <p className="mt-2 text-sm text-slate-300/80">
                    Sign in to your account
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                    <a href="/register" className="hover:text-slate-200 underline">
                        Create account
                    </a>
                    <a href="#resetPw" className="hover:text-slate-200 underline">
                        Forgot password?
                    </a>
                </div>

            </section>
        </main>
    );
}