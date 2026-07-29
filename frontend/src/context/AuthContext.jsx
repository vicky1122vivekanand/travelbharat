import { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI } from "../api/services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tb_admin_token");
    if (!token) {
      setLoading(false);
      return;
    }
    AuthAPI.me()
      .then(setAdmin)
      .catch(() => localStorage.removeItem("tb_admin_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await AuthAPI.login({ email, password });
    localStorage.setItem("tb_admin_token", data.token);
    setAdmin(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("tb_admin_token");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
