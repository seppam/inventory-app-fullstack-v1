import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import UsersPage from "./pages/UsersPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
    <Toaster /> 
    <Routes>
    {/* PUBLIC */}
    <Route path="/login" element={<Login />} />

    {/* USER AREA */}
    <Route
      path="/"
      element={
        <ProtectedRoute allowedRole="user">
          <Home />
        </ProtectedRoute>
      }
    />

    {/* ADMIN AREA */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<DashboardPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="users" element={<UsersPage />} />
    </Route>

  </Routes>
  </>
  );
}

export default App;