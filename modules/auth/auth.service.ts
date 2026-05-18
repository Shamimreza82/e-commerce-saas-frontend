import { apiClient } from "@/lib/api-client";
import { TSignIn, TSignUp } from "./auth.validation";

export const authService = {
  login: async (data: TSignIn) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  register: async (data: TSignUp) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  googleLogin: async (idToken: string) => {
    const response = await apiClient.post("/auth/oauth/google", { idToken });
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};
