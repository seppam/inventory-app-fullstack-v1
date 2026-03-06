import { useEffect, useState } from "react";
import api from "../api/axios";

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [summaryRes, activityRes] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/dashboard/recent-activity"),
      ]);

      setSummary(summaryRes.data.data);
      setActivities(activityRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          System overview and recent activity
        </p>
      </div>

      {/* Summary Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-6">
          System Summary
        </h2>

        {loading || !summary ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SummaryCard title="Total Users" value={summary.totalUsers} />
            <SummaryCard title="Total Products" value={summary.totalProducts} />
            <SummaryCard title="Total Categories" value={summary.totalCategories} />
            <SummaryCard title="Admin Users" value={summary.adminCount} />
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Recent Activity
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="py-2">Action</th>
                  <th>Entity</th>
                  <th>Performed By</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((log) => (
                  <tr
                    key={log._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-2 font-medium">
                      {log.action}
                    </td>
                    <td>{log.entity}</td>
                    <td>
                      {log.performedBy?.name} ({log.performedBy?.email})
                    </td>
                    <td>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-2 text-gray-800">
        {value}
      </h3>
    </div>
  );
}

export default DashboardPage;