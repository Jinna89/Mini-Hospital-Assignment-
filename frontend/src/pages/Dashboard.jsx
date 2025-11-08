import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

export default function Dashboard() {
  const [stats, setStats] = useState({ departments: 0, patients: 0 });

  async function fetchStats() {
    try {
      const res = await axios.get(apiBase + "/api/stats");
      setStats(res.data);
    } catch (e) {
      /* ignore for now */
    }
  }

  useEffect(() => {
    fetchStats();
    const t = setInterval(fetchStats, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Patients" value={stats.patients} />
        <StatCard title="Today OPD" value={"—"} />
        <StatCard title="Departments" value={stats.departments} />
      </div>
    </div>
  );
}
