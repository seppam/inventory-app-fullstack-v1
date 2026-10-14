import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import UsersPage from "./pages/UsersPage";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            fontSize: "13px",
            borderRadius: "0.5rem",
          },
        }}
      />
      <ErrorBoundary>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER AREA */}
        <Route
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
        </Route>

        {/* ADMIN AREA */}
        <Route
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" end element={<DashboardPage />} />
          <Route path="/admin/products" element={<ProductsPage />} />
          <Route path="/admin/categories" element={<CategoriesPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
        </Route>
      </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;
