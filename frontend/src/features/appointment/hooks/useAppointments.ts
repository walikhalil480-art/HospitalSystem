import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../../services/api";

interface AppointmentFilters {
  page?: number;
  limit?: number;
  search?: string;
  doctorId?: string;
  patientId?: string;
  departmentId?: string;
  date?: string;
  status?: string;
  today?: boolean;
}

const fetchAppointments = async (filters: AppointmentFilters = {}) => {
  const res = await api.get("/appointments", { params: filters });
  return res.data.data;
};

export const useAppointments = (filters: AppointmentFilters = {}) => {
  return useQuery({
    queryKey: ["appointments", filters],
    queryFn: () => fetchAppointments(filters),
  });
};

export const useAppointmentSummary = () => {
  return useQuery({
    queryKey: ["appointments-summary"],
    queryFn: async () => {
      const res = await api.get("/appointments/summary");
      return res.data.data;
    },
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/appointments", payload);
      return res.data.data.appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments-summary"] });
      toast.success("Appointment created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Unable to create appointment");
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await api.put(`/appointments/${id}`, payload);
      return res.data.data.appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments-summary"] });
      toast.success("Appointment updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Unable to update appointment");
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/appointments/${id}/cancel`);
      return res.data.data.appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments-summary"] });
      toast.success("Appointment cancelled successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Unable to cancel appointment");
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments-summary"] });
      toast.success("Appointment deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Unable to delete appointment");
    },
  });
};
