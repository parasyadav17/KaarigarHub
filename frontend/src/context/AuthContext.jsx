import React, { createContext, useContext, useState, useEffect } from "react";
import { login as loginService, signup as signupService } from "../services/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in (e.g., check localStorage or cookie)
        // For now, let's assume if there's a token in user object or localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await loginService(email, password);
        if (data.success) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user)); // Simple peristence
        }
        return data;
    };

    const signup = async (userData) => {
        const data = await signupService(userData);
        // Usually signup doesn't auto-login or it does. API returns user.
        // If API returns token/user, we can set it.
        // userController signUp returns `user` object but no token (it returns success message). 
        // Login returns token. So user must login after signup.
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
