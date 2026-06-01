// services/axiosRequest.ts
import axios from "axios";

const axiosRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosRequest.interceptors.request.use((config : any) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosRequest;