import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Card, PageHeader, EmptyState, LoadingSpinner, Badge } from "../components/ui";
import { Package, Plus, Pencil, Trash2, Search, X, ChevronLeft, ChevronRight } from "lucide-react";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 8,
    search: "",
    category: "",
    sort: "-createdAt",
  });

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        limit: undefined,
        page: filters.page,
        search: filters.search,
        category: filters.category,
        sort: filters.sort,
      });
      params.set("limit", filters.limit);
      const res = await api.get(`/products?${params}`);
      setProducts(res.data.data.products);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", description: "", price: "", stock: "", categoryId: "" });
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId?._id || product.categoryId || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const totalPages = pagination.totalPages || 1;
  const currentPage = pagination.currentPage || 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Products"
          subtitle={`${pagination.total || 0} products total`}
        />
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <Card padding="p-4" className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input pl-9"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={filters.category}
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value, page: 1 }))}
              className="input w-auto"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <select
              value={filters.sort}
              onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value, page: 1 }))}
              className="input w-auto"
            >
              <option value="-createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
              <option value="price">Price ↑</option>
              <option value="-price">Price ↓</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="p-0">
        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products found"
            description="Add your first product to start managing inventory."
            action={
              <button onClick={openCreate} className="btn-primary">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3.5">
                        <div>
                          <p className="font-medium text-slate-900">{prod.name}</p>
                          {prod.description && (
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{prod.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge variant="default">{prod.categoryId?.name || "—"}</Badge>
                      </td>
                      <td className="px-6 py-3.5 text-right font-mono text-slate-700">
                        Rp {Number(prod.price).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <span className={`font-mono font-medium ${prod.stock <= 5 ? "text-red-600" : "text-slate-700"}`}>
                          {prod.stock}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(prod)} className="btn-ghost p-2">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(prod._id)} className="btn-ghost p-2 text-red-500 hover:bg-red-50">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                    className="btn-secondary px-3 py-1.5 text-xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                    className="btn-secondary px-3 py-1.5 text-xs"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-card-lg w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="btn-ghost p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Wireless Mouse"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Description</label>
                <textarea
                  placeholder="Optional description..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="input resize-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Price (Rp)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="input font-mono"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Stock</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    className="input font-mono"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  className="input"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1"
                >
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

export default ProductsPage;
