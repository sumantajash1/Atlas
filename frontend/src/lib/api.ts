import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("user") || "{}")?.token || "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});