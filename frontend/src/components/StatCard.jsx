import React from "react";

export default function StatCard({ title, value }) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-card">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-2 text-gray-800">{value}</div>
    </div>
  );
}
