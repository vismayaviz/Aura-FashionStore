import api from "../api/axios";
import type { AuthUser } from "../types/user";

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    return response.data;
  },
  me: async () => {
    const response = await api.get<AuthUser>("/auth/me");
    return response.data;
  },
};
