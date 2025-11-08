import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const items = [
  { name: "Dashboard", to: "/", icon: HomeIcon },
  { name: "OPD", to: "/opd", icon: UserGroupIcon },
  { name: "Departments", to: "/department", icon: BuildingOffice2Icon },
];

export default function Sidebar({ open = false, onClose = () => {} }) {
  const [depts, setDepts] = useState([]);

  async function loadDepts() {
    try {
      const res = await axios.get(apiBase + "/api/departments/public");
      setDepts(res.data);
    } catch (err) {
      // ignore silently
    }
  }

  useEffect(() => {
    loadDepts();
    const onChanged = () => loadDepts();
    window.addEventListener("departments:changed", onChanged);
    return () => window.removeEventListener("departments:changed", onChanged);
  }, []);
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`${open ? "fixed inset-0 z-30" : "hidden"}`}
        aria-hidden={!open}
      >
        <div className="fixed inset-0 bg-black/40" onClick={onClose}></div>
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r p-4 z-40">
          <div className="flex items-center justify-between mb-6">
            <div className="text-xl font-bold">HMS</div>
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="p-1 rounded hover:bg-gray-100"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <nav className="space-y-1">
            {items.map((i) => {
              const Icon = i.icon;
              return (
                <NavLink
                  key={i.to}
                  to={i.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    "flex items-center gap-3 px-3 py-2 rounded " +
                    (isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-50")
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{i.name}</span>
                </NavLink>
              );
            })}
          </nav>
          <div className="mt-auto pt-6 text-xs text-gray-400">
            © {new Date().getFullYear()} Mini Hospital
          </div>
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:border-r md:bg-white md:py-6 md:px-4">
        <div className="text-xl font-bold mb-6">HMS</div>
        <nav className="flex-1 space-y-1">
          {items.map((i) => {
            const Icon = i.icon;
            return (
              <NavLink
                key={i.to}
                to={i.to}
                className={({ isActive }) =>
                  "flex items-center gap-3 px-3 py-2 rounded " +
                  (isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-50")
                }
              >
                <Icon className="w-5 h-5" />
                <span>{i.name}</span>
              </NavLink>
            );
          })}
        </nav>
        {depts.length > 0 && (
          <div className="mt-6">
            <div className="text-xs text-gray-400 px-3 mb-2">Departments</div>
            <div className="space-y-1 px-2">
              {depts.map((d) => (
                <div
                  key={d._id}
                  className="text-sm text-gray-700 px-3 py-1 rounded hover:bg-gray-50"
                >
                  {d.name}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Mini Hospital
        </div>
      </aside>
    </>
  );
}
