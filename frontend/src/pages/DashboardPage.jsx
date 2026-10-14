import { useEffect, useState } from "react";
import api from "../api/axios";
import { Card, PageHeader, StatCard, EmptyState, LoadingSpinner, Badge } from "../components/ui";
import { Users, Package, Tag, ShieldCheck, Activity, AlertCircle, RefreshCw } from "lucide-react";

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, activityRes] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/dashboard/recent-activity"),
      ]);
      setSummary(summaryRes.data.data);
      setActivities(activityRes.data.data);
    } catch (err) {
      console.error("[Dashboard] fetch error:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8"><LoadingSpinner text="Loading dashboard..." /></div>;

  if (error) {
    return (
      <div className="p-8">
        <PageHeader title="Dashboard" subtitle="System overview and recent activity" />
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Dashboard failed to load</h3>
          <p className="text-xs text-slate-500 mb-4 max-w-xs">{error}</p>
          <button onClick={fetchDashboard} className="btn-primary">
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="System overview and recent activity" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={summary?.totalUsers} icon={Users} color="brand" />
        <StatCard label="Products" value={summary?.totalProducts} icon={Package} color="emerald" />
        <StatCard label="Categories" value={summary?.totalCategories} icon={Tag} color="amber" />
        <StatCard label="Administrators" value={summary?.adminCount} icon={ShieldCheck} color="red" />
      </div>

      {/* Activity Log */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            Recent Activity
          </h2>
          <button onClick={fetchDashboard} className="btn-ghost p-1.5" title="Refresh">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {activities.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No activity yet"
            description="System activity will appear here once users start interacting."
          />
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                  <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Entity</th>
                  <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Performed By</th>
                  <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activities.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-medium text-slate-800">{log.action}</td>
                    <td className="py-3 text-slate-500">{log.entity}</td>
                    <td className="py-3 text-slate-500">
                      {log.performedBy?.name}
                      <span className="text-slate-400 ml-1">({log.performedBy?.email})</span>
                    </td>
                    <td className="py-3 text-slate-400 text-xs font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default DashboardPage;
