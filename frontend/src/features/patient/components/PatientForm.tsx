import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../../services/api";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const patientSchema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  dateOfBirth: z.string().min(1, "Required"),
  gender: z.string().min(1, "Required"),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  allergies: z.string().optional(),
  insuranceDetails: z.string().optional(),
  medicalNotes: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface Props {
  patient?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const formatDate = (value?: string) => {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
};

export const PatientForm = ({ patient, onSuccess, onCancel }: Props) => {
  const queryClient = useQueryClient();
  const isEditing = Boolean(patient);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: patient?.user?.firstName || "",
      lastName: patient?.user?.lastName || "",
      email: patient?.user?.email || "",
      phone: patient?.user?.phone || "",
      dateOfBirth: formatDate(patient?.dateOfBirth),
      gender: patient?.gender || "",
      bloodGroup: patient?.bloodGroup || "",
      address: patient?.address || "",
      emergencyContact: patient?.emergencyContact || "",
      emergencyPhone: patient?.emergencyPhone || "",
      allergies: patient?.allergies || "",
      insuranceDetails: patient?.insuranceDetails || "",
      medicalNotes: patient?.medicalNotes || "",
    },
  });

  useEffect(() => {
    reset({
      firstName: patient?.user?.firstName || "",
      lastName: patient?.user?.lastName || "",
      email: patient?.user?.email || "",
      phone: patient?.user?.phone || "",
      dateOfBirth: formatDate(patient?.dateOfBirth),
      gender: patient?.gender || "",
      bloodGroup: patient?.bloodGroup || "",
      address: patient?.address || "",
      emergencyContact: patient?.emergencyContact || "",
      emergencyPhone: patient?.emergencyPhone || "",
      allergies: patient?.allergies || "",
      insuranceDetails: patient?.insuranceDetails || "",
      medicalNotes: patient?.medicalNotes || "",
    });
  }, [patient, reset]);

  const mutation = useMutation({
    mutationFn: (data: PatientFormData) => {
      const payload = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
        email: data.email || undefined,
      };
      if (isEditing && patient?.id) {
        return api.put(`/patients/${patient.id}`, payload);
      }
      return api.post("/patients", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success(isEditing ? "Patient updated successfully!" : "Patient registered successfully!");
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || (isEditing ? "Failed to update patient" : "Failed to register patient"));
    },
  });

  const onSubmit = (data: PatientFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input {...register("firstName")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input {...register("lastName")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" {...register("email")} disabled={isEditing} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100" />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input {...register("phone")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input type="date" {...register("dateOfBirth")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          {errors.dateOfBirth && <span className="text-red-500 text-xs">{errors.dateOfBirth.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select {...register("gender")} className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.gender && <span className="text-red-500 text-xs">{errors.gender.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Blood Group</label>
          <select {...register("bloodGroup")} className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
          <input {...register("emergencyContact")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Emergency Phone</label>
          <input {...register("emergencyPhone")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea {...register("address")} rows={2} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Allergies</label>
          <input {...register("allergies")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Insurance Details</label>
          <input {...register("insuranceDetails")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Medical Notes</label>
          <textarea {...register("medicalNotes")} rows={3} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none">
            Cancel
          </button>
        )}
        <button type="submit" disabled={mutation.isPending} className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none disabled:opacity-50">
          {mutation.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          {isEditing ? "Update Patient" : "Save Patient"}
        </button>
      </div>
    </form>
  );
};
