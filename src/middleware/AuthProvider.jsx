import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // user info (admin or customer)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/auth/check`, {
                    credentials: "include", // send HTTP-only cookie
                });
                if (!res.ok) throw new Error("Not authenticated");

                const data = await res.json();
                setUser(data.user); // Will include 'type' field: 'admin' or 'customer'
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setUser(null);
        }
    };

    // Helper functions to check user type
    const isAdmin = user?.type === 'admin';
    const isCustomer = user?.type === 'customer';

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser, 
            loading, 
            logout,
            isAdmin,
            isCustomer 
        }}>
            {children}
        </AuthContext.Provider>
    );
}