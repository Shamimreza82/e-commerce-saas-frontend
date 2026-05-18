import { apiClient } from "@/lib/api-client";
import { TUpdateStore } from "./tenant.validation";

export const tenantService = {
  getMyTenant: async () => {
    const response = await apiClient.get("/tenants/me");
    return response.data;
  },

  updateTenant: async (data: TUpdateStore) => {
    const response = await apiClient.patch("/tenants/me", data);
    return response.data;
  },

  getTenantBySlug: async (slug: string) => {
    const response = await apiClient.get(`/tenants/${slug}`);
    return response.data;
  },
};
