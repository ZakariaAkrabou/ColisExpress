import { useState } from "react";
import { login, logout, LoginRequest } from "../features/auth/auth.api";
import { storage } from "../services/storage";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);

      const result = await login(data);
      if (result.token) {
        await storage.setToken(result.token);
      }

      return result;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Something went wrong";

      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    login: handleLogin,
    loading,
    error,
  };
};

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await storage.getToken();
      await logout(token || undefined);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Une erreur est survenue lors de la déconnexion";
      setError(message);
      console.warn("Logout error:", message);
    } finally {
      await storage.removeToken();
      setLoading(false);
    }
  };

  return {
    logout: handleLogout,
    loading,
    error,
  };
};

