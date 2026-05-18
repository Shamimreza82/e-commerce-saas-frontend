"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export const brandService = {
  getAll: async () => {
    const response = await apiClient.get("/brands");
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post("/brands", data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.patch(`/brands/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/brands/${id}`);
    return response.data;
  },
};

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => brandService.getAll(),
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => brandService.create(data),
    onSuccess: () => {
      toast.success("Brand created");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => brandService.update(id, data),
    onSuccess: () => {
      toast.success("Brand updated");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => brandService.delete(id),
    onSuccess: () => {
      toast.success("Brand deleted");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
};
