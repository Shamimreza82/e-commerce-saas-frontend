import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tenantService } from "./tenant.service";
import { TUpdateStore } from "./tenant.validation";
import { toast } from "sonner";

export const useMyTenant = () => {
  return useQuery({
    queryKey: ["my-tenant"],
    queryFn: () => tenantService.getMyTenant(),
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TUpdateStore) => tenantService.updateTenant(data),
    onSuccess: (response) => {
      toast.success(response.message || "Store updated successfully");
      queryClient.invalidateQueries({ queryKey: ["my-tenant"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
