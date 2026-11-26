//services/api.ts
import axios from "axios";
import { storage } from "./storage";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    console.log('[api] request interceptor start');
    try {
      const token = await storage.getToken();
      if (token) {
        if (config.headers) {
          if (typeof (config.headers as any).set === "function") {
            (config.headers as any).set("Authorization", `Bearer ${token}`);
          } else {
            (config.headers as any)["Authorization"] = `Bearer ${token}`;
          }
        }
      }
    } catch (err) {
      console.warn("api interceptor warning:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);