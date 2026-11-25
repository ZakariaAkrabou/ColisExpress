import { api } from "../../services/api";
import { storage } from "../../services/storage";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface LogoutResponse {
  message: string;
}

export const login = async ( data: LoginRequest ): Promise<LoginResponse> => {

  const response = await api.post<LoginResponse>(
    "/auth/login",
    data
  );


  return response.data;
};

export const logout = async ( token?: string ): Promise<LogoutResponse> => {
  const authToken = token || (await storage.getToken());

  const headers: Record<string, string> = {};
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await api.post<LogoutResponse>(
    "/auth/logout",
    {},
    { headers }
  );

  return response.data;
};

