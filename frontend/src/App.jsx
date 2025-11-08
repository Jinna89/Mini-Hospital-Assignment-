import React, { useState } from "react";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import OPD from "./pages/OPD";
import Department from "./pages/Department";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function Protected({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 flex flex-col min-h-screen">
            <Topbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />
            <main className="p-6 max-w-7xl w-full mx-auto">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <Protected>
                      <Dashboard />
                    </Protected>
                  }
                />
                <Route
                  path="/opd"
                  element={
                    <Protected>
                      <OPD />
                    </Protected>
                  }
                />
                <Route
                  path="/department"
                  element={
                    <Protected>
                      <Department />
                    </Protected>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
