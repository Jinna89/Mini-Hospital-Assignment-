import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// default to local backend when VITE_API_BASE_URL is not set (useful for local dev)
const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function Department() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "active",
  });
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");

  async function fetchList() {
    setLoading(true);
    try {
      // use public endpoint so sidebar can read departments without auth
      const res = await axios.get(apiBase + "/api/departments/public");
      setList(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    try {
      const res = await axios.post(apiBase + "/api/departments", form, {
        headers: authHeaders(),
      });
      setList((l) => [res.data, ...l]);
      setForm({ name: "", description: "", status: "active" });
      Swal.fire({
        icon: "success",
        title: "Added",
        text: "Department added successfully",
        timer: 1400,
        showConfirmButton: false,
      });
      window.dispatchEvent(new CustomEvent("departments:changed"));
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e?.response?.data?.message || e.message,
      });
      console.error(e);
    }
  }

  function startEdit(d) {
    setEditingId(d._id);
    setForm({
      name: d.name || "",
      description: d.description || "",
      status: d.status || "active",
    });
  }

  async function saveEdit(e) {
    e.preventDefault();
    try {
      const res = await axios.put(
        apiBase + "/api/departments/" + editingId,
        form,
        { headers: authHeaders() }
      );
      setList((l) => l.map((x) => (x._id === editingId ? res.data : x)));
      setEditingId(null);
      setForm({ name: "", description: "", status: "active" });
      Swal.fire({
        icon: "success",
        title: "Saved",
        text: "Department updated",
        timer: 1200,
        showConfirmButton: false,
      });
      window.dispatchEvent(new CustomEvent("departments:changed"));
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e?.response?.data?.message || e.message,
      });
      console.error(e);
    }
  }

  async function handleDelete(id) {
    const result = await Swal.fire({
      title: "Delete department?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(apiBase + "/api/departments/" + id, {
        headers: authHeaders(),
      });
      setList((l) => l.filter((x) => x._id !== id));
      Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1100,
        showConfirmButton: false,
      });
      window.dispatchEvent(new CustomEvent("departments:changed"));
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e?.response?.data?.message || e.message,
      });
      console.error(e);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Departments</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <form
          onSubmit={editingId ? saveEdit : handleAdd}
          className="bg-white p-4 rounded shadow-card"
        >
          <h2 className="font-semibold mb-3">
            {editingId ? "Edit Department" : "Add Department"}
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Name</label>
              <input
                className="w-full p-2 border rounded"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Description
              </label>
              <textarea
                className="w-full p-2 border rounded"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Status</label>
              <select
                className="p-2 border rounded"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                {editingId ? "Save" : "Add"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: "", description: "", status: "active" });
                  }}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded shadow-card">
            <h2 className="font-semibold mb-3">Department List</h2>
            <div className="overflow-x-auto">
              <div className="mb-4">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search departments..."
                  className="w-full p-2 border rounded"
                />
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-600">
                    <th className="py-2">Name</th>
                    <th className="py-2 hidden md:table-cell">Description</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={4} className="py-4 text-sm text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  )}
                  {!loading && list.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-sm text-gray-500">
                        No departments yet.
                      </td>
                    </tr>
                  )}
                  {list
                    .filter(
                      (d) =>
                        (d.name || "")
                          .toLowerCase()
                          .includes(query.toLowerCase()) ||
                        (d.description || "")
                          .toLowerCase()
                          .includes(query.toLowerCase())
                    )
                    .map((d) => (
                      <tr key={d._id} className="border-t">
                        <td className="py-2 align-top">{d.name}</td>
                        <td className="py-2 hidden md:table-cell align-top">
                          {d.description}
                        </td>
                        <td className="py-2 align-top">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              d.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="py-2 align-top">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(d)}
                              className="px-3 py-1 rounded border text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(d._id)}
                              className="px-3 py-1 rounded border text-sm text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
