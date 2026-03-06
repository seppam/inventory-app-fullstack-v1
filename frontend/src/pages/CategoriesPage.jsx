import { useEffect, useState } from "react";
import api from "../api/axios";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const [form, setForm] = useState({
    name: "",
  });

  // ==============================
  // Fetch Categories
  // ==============================
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==============================
  // Create / Update
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post("/categories", form);
      }

      setForm({ name: "" });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  // ==============================
  // Edit
  // ==============================
  const handleEdit = (category) => {
    setEditingId(category._id);
    setForm({ name: category.name });
  };

  // ==============================
  // Delete
  // ==============================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // ==============================
  // Filter
  // ==============================
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Category Management
        </h1>
        <p className="text-gray-500 text-sm">
          Manage your product categories
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow">
        <input
          type="text"
          placeholder="Search category..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* ================= FORM ================= */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Category" : "Create Category"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Category name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
              required
            />
            <button
              type="submit"
              className={`w-full py-2 text-white rounded-lg transition ${
                editingId
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editingId ? "Update" : "Create"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "" });
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Category List
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="py-3">Name</th>
                    <th className="py-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td
                        colSpan="2"
                        className="text-center py-6 text-gray-400"
                      >
                        No categories found
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((cat) => (
                      <tr
                        key={cat._id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-3 font-medium">
                          {cat.name}
                        </td>

                        <td className="py-3 text-right space-x-4">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default CategoriesPage;