import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

client.interceptors.request.use((config) => {
  const isUserRoute = config.url?.startsWith("/users");
  const token = isUserRoute
    ? localStorage.getItem("tb_user_token")
    : localStorage.getItem("tb_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
