import { apiClient } from "@/lib/api-client";
import { TCreateProduct } from "./product.validation";

export const productService = {
  createProduct: async (data: TCreateProduct) => {
    // Transform data to match backend expectations
    const payload = {
      ...data,
      searchKeywords: data.searchKeywords ? data.searchKeywords.split(",").map(s => s.trim()) : [],
      images: data.imageUrl ? [{ url: data.imageUrl, isPrimary: true }] : [],
      // Ensure IDs are null if empty string
      categoryId: data.categoryId || null,
      brandId: data.brandId || null,
      warehouseId: data.warehouseId || null,
    };
    const response = await apiClient.post("/products", payload);
    return response.data;
  },

  getAllProducts: async () => {
    const response = await apiClient.get("/products");
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<TCreateProduct>) => {
    // Transform data
    const payload = {
      ...data,
      searchKeywords: typeof data.searchKeywords === "string" ? (data.searchKeywords as string).split(",").map(s => s.trim()) : data.searchKeywords,
      images: data.imageUrl ? [{ url: data.imageUrl, isPrimary: true }] : undefined,
      categoryId: data.categoryId === "" ? null : data.categoryId,
      brandId: data.brandId === "" ? null : data.brandId,
      warehouseId: data.warehouseId === "" ? null : data.warehouseId,
    };
    const response = await apiClient.patch(`/products/${id}`, payload);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  getPublicProduct: async (tenantSlug: string, productSlug: string) => {
    const response = await apiClient.get(`/products/public/${tenantSlug}/${productSlug}`);
    return response.data;
  },

  getPublicProducts: async (tenantSlug: string) => {
    const response = await apiClient.get(`/products/public/${tenantSlug}`);
    return response.data;
  },
};
