import { createContext, useContext, useEffect, useState } from "react";
import { UsersAPI } from "../api/userServices";

const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tb_user_token");
    if (!token) {
      setLoading(false);
      return;
    }
    UsersAPI.me()
      .then(setUser)
      .catch(() => localStorage.removeItem("tb_user_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await UsersAPI.login({ email, password });
    localStorage.setItem("tb_user_token", data.token);
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role) => {
    const data = await UsersAPI.register({ name, email, password, role });
    localStorage.setItem("tb_user_token", data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("tb_user_token");
    setUser(null);
  };

  return (
    <UserAuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export const useUserAuth = () => useContext(UserAuthContext);
