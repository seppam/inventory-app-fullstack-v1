import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Tag,
  Users,
  LogOut,
  Boxes,
} from "lucide-react";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItem = (to, iconEl, label) => (
    <NavLink
      key={to}
      to={to}
      end={to === "/admin"}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
          isActive
            ? "bg-brand-50 text-brand-700"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        }`
      }
    >
      {iconEl}
      {label}
    </NavLink>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
              <Boxes className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">Inventory</h1>
              <p className="text-[11px] text-slate-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItem("/admin", <LayoutDashboard className="w-4 h-4" />, "Dashboard")}
          {navItem("/admin/products", <Package className="w-4 h-4" />, "Products")}
          {navItem("/admin/categories", <Tag className="w-4 h-4" />, "Categories")}
          {navItem("/admin/users", <Users className="w-4 h-4" />, "Users")}
        </nav>

        {/* User Section */}
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-brand-600">
                {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-800 truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-400 truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Admin Dashboard</h2>
            <p className="text-xs text-slate-400">Manage your inventory system</p>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
