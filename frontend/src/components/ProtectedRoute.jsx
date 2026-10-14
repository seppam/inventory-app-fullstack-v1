import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" />;

  if (allowedRole === "admin" && !isAdmin) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;