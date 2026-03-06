import { useEffect, useState } from "react";
import api from "../api/axios";

function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    search: "",
    category: "",
  });

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
        setLoading(true);

        const params = new URLSearchParams(filters).toString();

        const res = await api.get(`/products?${params}`);

        setProducts(res.data.data.products);
        setPagination(res.data.data.pagination);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data.data);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        setFilters((prev) => ({
        ...prev,
        search: searchInput,
        page: 1,
        }));
    }, 500);

    return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    useEffect(() => {
        fetchCategories();
    }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post("/products", form);
      }

      setForm({ name: "", description: "", price: "", stock: "", categoryId: "" });
      //setFilters({ ...filters });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId?._id || product.categoryId,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    //setFilters((prev) => ({ ...prev }));
    fetchProducts();
  };

  return (
  <div className="space-y-6">

    {/* Header */}
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        Product Management
      </h1>
      <p className="text-gray-500 text-sm">
        Manage your inventory products
      </p>
    </div>

    {/* Filter Section */}
    <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

      <input
        type="text"
        placeholder="Search product..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <div className="flex gap-4 w-full md:w-auto">
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              category: e.target.value,
              page: 1,
            }))
          }
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={filters.sort || "createdAt"}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              sort: e.target.value,
              page: 1,
            }))
          }
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="createdAt">Newest</option>
          <option value="-createdAt">Oldest</option>
          <option value="price">Price Low</option>
          <option value="-price">Price High</option>
        </select>
      </div>
    </div>

    {/* Main Grid */}
    <div className="grid lg:grid-cols-3 gap-6">

      {/* Form Card */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Product" : "Create Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {editingId ? "Update Product" : "Create Product"}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
        <h2 className="text-lg font-semibold mb-4">
          Product List
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="py-2">Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr
                      key={prod._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-2 font-medium">
                        {prod.name}
                      </td>
                      <td>{prod.categoryId?.name}</td>
                      <td>Rp {prod.price}</td>
                      <td>{prod.stock}</td>
                      <td className="space-x-3">
                        <button
                          onClick={() => handleEdit(prod)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={filters.page === 1}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                  }))
                }
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                disabled={filters.page === pagination.totalPages}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                  }))
                }
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  </div>
);
}

export default ProductDashboard;