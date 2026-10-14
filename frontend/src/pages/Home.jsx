import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Card, PageHeader, StatCard, EmptyState, LoadingSpinner, Badge } from "../components/ui";
import { Package, Tag, TrendingUp, AlertCircle } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [productRes, catRes] = await Promise.all([
        api.get("/products?limit=100"),
        api.get("/categories"),
      ]);
      setProducts(productRes.data.data.products || []);
      setCategories(catRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const lowStock = products.filter((p) => p.stock <= 5);
  const totalValue = products.reduce((sum, p) => sum + (Number(p.price) * Number(p.stock)), 0);

  return (
    <div>
      <PageHeader
        title={`Good ${getTimeOfDay()}, ${user?.name?.split(" ")[0] || "there"} 👋`}
        subtitle="Here's an overview of your inventory"
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Products"
          value={products.length}
          icon={Package}
          color="brand"
        />
        <StatCard
          label="Categories"
          value={categories.length}
          icon={Tag}
          color="emerald"
        />
        <StatCard
          label="Total Stock Value"
          value={totalValue > 0 ? `Rp ${(totalValue / 1_000_000).toFixed(1)}M` : "—"}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <Card className="mb-6 border-l-4 border-amber-400">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-800 mb-1">
                Low Stock Alert
              </p>
              <p className="text-xs text-slate-500 mb-3">
                {lowStock.length} product{lowStock.length > 1 ? "s" : ""} running low on stock.
              </p>
              <div className="flex flex-wrap gap-2">
                {lowStock.map((p) => (
                  <Badge key={p._id} variant="warning">
                    {p.name} — {p.stock} left
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Products */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-slate-400" />
            My Products
          </h2>
          <span className="text-xs text-slate-400">{products.length} items</span>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products yet"
            description="Products will appear here once an admin adds them."
          />
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                  <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
                  <th className="text-right pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</th>
                  <th className="text-right pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.slice(0, 10).map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-medium text-slate-800">{prod.name}</td>
                    <td className="py-3">
                      <Badge variant="default">{prod.categoryId?.name || "—"}</Badge>
                    </td>
                    <td className="py-3 text-right font-mono text-slate-700">
                      Rp {Number(prod.price).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`font-mono font-medium ${prod.stock <= 5 ? "text-red-500" : "text-slate-700"}`}>
                        {prod.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length > 10 && (
              <p className="text-xs text-slate-400 text-center py-3">
                Showing 10 of {products.length} products
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
