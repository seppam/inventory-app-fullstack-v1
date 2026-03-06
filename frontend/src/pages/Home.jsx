import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      {user?.role === "admin" && (
        <button
          onClick={() => navigate("/admin")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go to Admin Page
        </button>
      )}
      <button onClick={handleLogout}>Logout</button>
      <h1>Categories</h1>
      {categories.map((cat) => (
        <div key={cat._id}>{cat.name}</div>
      ))}
    </div>
  );
}