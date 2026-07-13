import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../services/api";
import toast from "react-hot-toast";

export const useDoctors = (params?: Record<string, string | number | undefined>) => {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: async () => {
      const res = await api.get("/doctors", { params });
      return res.data.data;
    },
  });
};

export const useDoctor = (id?: string) => {
  return useQuery({
    queryKey: ["doctors", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/doctors/${id}`);
      return res.data.data.doctor;
    },
    enabled: Boolean(id),
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => api.post("/doctors", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast.success("Doctor created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create doctor");
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => api.put(`/doctors/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast.success("Doctor updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update doctor");
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/doctors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast.success("Doctor deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete doctor");
    },
  });
};
