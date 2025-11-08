import React from "react";
import { BellIcon, Bars3Icon } from "@heroicons/react/24/outline";

export default function Topbar({ onToggleSidebar = () => {} }) {
  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-white border-b sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded hover:bg-gray-100"
          aria-label="Open sidebar"
        >
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-lg font-semibold">Mini Hospital</div>
      </div>

      <div className="flex items-center gap-4">
        <button
          aria-label="notifications"
          className="p-2 rounded hover:bg-gray-100"
        >
          <BellIcon className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="text-sm">Admin</div>
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
