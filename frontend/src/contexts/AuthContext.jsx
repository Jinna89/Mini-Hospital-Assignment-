import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // In real app, validate token / fetch profile
      setUser({ name: "Admin" });
    }
  }, []);

  async function login(identifier, password) {
    // identifier can be username or email
    setLoading(true);
    try {
      // Local hardcoded credential for quick dev/testing
      if (identifier === "admin" && password === "admin123") {
        const fakeToken = "local-dev-token";
        localStorage.setItem("token", fakeToken);
        setUser({ name: "Admin", role: "admin" });
        return { ok: true };
      }

      // If VITE_API_BASE_URL is set, fall back to real backend auth
      if (import.meta.env.VITE_API_BASE_URL) {
        const res = await axios.post(
          import.meta.env.VITE_API_BASE_URL + "/api/auth/login",
          { identifier, password }
        );
        const token = res.data.token;
        localStorage.setItem("token", token);
        setUser(res.data.user || { name: "Admin" });
        return { ok: true };
      }

      return { ok: false, error: "Invalid credentials" };
    } catch (e) {
      return { ok: false, error: e.response?.data?.message || e.message };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
