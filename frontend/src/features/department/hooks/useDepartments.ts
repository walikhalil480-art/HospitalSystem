import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../services/api";
import toast from "react-hot-toast";

export const useDepartments = (params?: Record<string, string | number | undefined>) => {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: async () => {
      const res = await api.get("/departments", { params });
      return res.data.data;
    },
  });
};

export const useDepartment = (id?: string) => {
  return useQuery({
    queryKey: ["departments", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/departments/${id}`);
      return res.data.data.department;
    },
    enabled: Boolean(id),
  });
};

export const useDepartmentStats = () => {
  return useQuery({
    queryKey: ["departments-stats"],
    queryFn: async () => {
      const res = await api.get("/departments/stats");
      return res.data.data;
    },
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => api.post("/departments", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments-stats"] });
      toast.success("Department created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create department");
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => api.put(`/departments/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments-stats"] });
      toast.success("Department updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update department");
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/departments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments-stats"] });
      toast.success("Department deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete department");
    },
  });
};

export const useAssignDoctorToDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, doctorId }: { id: string; doctorId: string }) => api.post(`/departments/${id}/assign-doctor`, { doctorId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Doctor assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to assign doctor");
    },
  });
};
