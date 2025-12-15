import axios from "axios";
import { HOST } from "../utils/constant";

const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const isAuthRoute = config.url.includes("/api/auth/login") || config.url.includes("/api/auth/register");

    if (!isAuthRoute) {
      
      const token = getCookie("Admin_access");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export { apiClient };
