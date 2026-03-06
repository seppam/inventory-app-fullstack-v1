import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const checkAuth = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
        setLoading(false);
        return;
        }

        try {
        const res = await api.get("/auth/me");
        setUser(res.data.data);
        } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
        } finally {
        setLoading(false);
        }
    };

    checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });

        const { token, user } = res.data.data;

        localStorage.setItem("token", token);
        setUser(user);

        return user;    
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);