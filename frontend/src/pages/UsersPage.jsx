import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Card, PageHeader, EmptyState, LoadingSpinner, Badge } from "../components/ui";
import { Users, Search, Trash2, ShieldCheck, User } from "lucide-react";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const filtered = users.filter((u) =>
    (u.name || "").toLowerCase().includes(searchInput.toLowerCase()) ||
    u.email.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Users"
          subtitle={`${users.length} registered users`}
        />
      </div>

      {/* Search */}
      <Card padding="p-4" className="mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input pl-9"
          />
        </div>
      </Card>

      {/* Table */}
      <Card padding="p-0">
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description={searchInput ? "No users match your search." : "Users will appear here once they register."}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    User
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Email
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Role
                  </th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          {user.role === "admin" ? (
                            <ShieldCheck className="w-4 h-4 text-brand-500" />
                          ) : (
                            <User className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <span className="font-medium text-slate-900">{user.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">{user.email}</td>
                    <td className="px-6 py-3.5">
                      <Badge variant={user.role === "admin" ? "admin" : "user"}>
                        {user.role === "admin" ? "Admin" : "User"}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="btn-ghost p-2 text-red-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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

export default UsersPage;
