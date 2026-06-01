// services/axiosRequest.ts
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV
    ? "/api"
    : import.meta.env.VITE_BASE_URL ?? "https://backendaijob-1.onrender.com/api");

const axiosRequest = axios.create({
  baseURL,
});

axiosRequest.interceptors.request.use((config : any) => {
  const token = localStorage.getItem("token");
  config.headers = config.headers || {};

  if (token) {
    const cleanToken = token.toString().trim().replace(/^Bearer\s+/i, "");
    if (cleanToken) {
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
  }

  return config;
});

export default axiosRequest;