import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../../services/api";

interface MedicalRecordFilters {
  page?: number;
  limit?: number;
  search?: string;
  patientId?: string;
  doctorId?: string;
  date?: string;
  status?: string;
}

const fetchMedicalRecords = async (filters: MedicalRecordFilters = {}) => {
  const res = await api.get("/medical-records", { params: filters });
  return res.data.data;
};

const fetchMedicalRecordById = async (id: string) => {
  const res = await api.get(`/medical-records/${id}`);
  return res.data.data.medicalRecord;
};

const fetchPatientMedicalHistory = async (patientId: string) => {
  const res = await api.get(`/medical-records/history/${patientId}`);
  return res.data.data.history;
};

export const useMedicalRecords = (filters: MedicalRecordFilters = {}) => {
  return useQuery({
    queryKey: ["medical-records", filters],
    queryFn: () => fetchMedicalRecords(filters),
  });
};

export const useMedicalRecord = (id?: string) => {
  return useQuery({
    queryKey: ["medical-record", id],
    queryFn: () => fetchMedicalRecordById(id as string),
    enabled: Boolean(id),
  });
};

export const usePatientMedicalHistory = (patientId?: string) => {
  return useQuery({
    queryKey: ["medical-history", patientId],
    queryFn: () => fetchPatientMedicalHistory(patientId as string),
    enabled: Boolean(patientId),
  });
};

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/medical-records", payload);
      return res.data.data.medicalRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-records"] });
      toast.success("Medical record created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Unable to create medical record");
    },
  });
};

export const useUpdateMedicalRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await api.put(`/medical-records/${id}`, payload);
      return res.data.data.medicalRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-records"] });
      toast.success("Medical record updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Unable to update medical record");
    },
  });
};

export const useDeleteMedicalRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/medical-records/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-records"] });
      toast.success("Medical record deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Unable to delete medical record");
    },
  });
};
