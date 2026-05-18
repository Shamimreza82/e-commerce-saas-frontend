import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "./auth.service";
import { TSignIn, TSignUp } from "./auth.validation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => authService.getMe(),
  });
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TSignIn) => authService.login(data),
    onSuccess: (response) => {
      toast.success(response.message || "Login successful");
      queryClient.setQueryData(["user"], response.data.user);
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useGoogleLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idToken: string) => authService.googleLogin(idToken),
    onSuccess: (response) => {
      toast.success(response.message || "Login successful");
      queryClient.setQueryData(["user"], response.data.user);
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TSignUp) => authService.register(data),
    onSuccess: (response) => {
      toast.success(response.message || "Registration successful");
      queryClient.setQueryData(["user"], response.data.user);
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
