import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    const res = await login(username, password);
    if (res.ok) nav("/");
    else setErr(res.error || "Login failed");
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md mx-4 bg-white p-6 rounded-lg shadow-card">
        <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
        {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
