import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Card, PageHeader, EmptyState, LoadingSpinner } from "../components/ui";
import { Tag, Plus, Pencil, Trash2, Search, X, Edit2 } from "lucide-react";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data.data);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, { name });
        toast.success("Category updated");
      } else {
        await api.post("/categories", { name });
        toast.success("Category created");
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Categories"
          subtitle={`${categories.length} categories`}
        />
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <Card padding="p-4" className="mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input pl-9"
          />
        </div>
      </Card>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Tag}
            title="No categories found"
            description={
              searchInput
                ? "No categories match your search."
                : "Create your first category to organize products."
            }
            action={
              !searchInput && (
                <button onClick={openCreate} className="btn-primary">
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              )
            }
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((cat) => (
            <Card key={cat._id} padding="p-4" className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <Tag className="w-4 h-4 text-brand-500" />
                </div>
                <p className="text-sm font-medium text-slate-800 truncate">{cat.name}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => openEdit(cat)}
                  className="btn-ghost p-1.5 text-slate-400 hover:text-brand-600"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="btn-ghost p-1.5 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-card-lg w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">
                {editingId ? "Edit Category" : "New Category"}
              </h2>
              <button onClick={() => setShowModal(false)} className="btn-ghost p-1.5">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electronics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                  {submitting ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
