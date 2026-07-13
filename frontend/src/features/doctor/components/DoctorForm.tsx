import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const doctorSchema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  departmentId: z.string().optional(),
  specialization: z.string().optional(),
  qualifications: z.string().optional(),
  licenseNumber: z.string().optional(),
  schedule: z.string().optional(),
  consultationFee: z.coerce.number().min(0).optional(),
  bio: z.string().optional(),
  employmentStatus: z.string().optional(),
  availability: z.string().optional(),
  photoUrl: z.string().optional(),
});

type DoctorFormData = z.infer<typeof doctorSchema>;

interface Props {
  doctor?: any;
  departments?: any[];
  submitting?: boolean;
  onSubmit: (data: DoctorFormData) => void;
  onCancel?: () => void;
}

export const DoctorForm = ({ doctor, departments = [], submitting = false, onSubmit, onCancel }: Props) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema) as any,
    defaultValues: {
      firstName: doctor?.user?.firstName || "",
      lastName: doctor?.user?.lastName || "",
      email: doctor?.user?.email || "",
      phone: doctor?.user?.phone || "",
      departmentId: doctor?.departmentId || "",
      specialization: doctor?.specialization || "",
      qualifications: doctor?.qualifications || "",
      licenseNumber: doctor?.licenseNumber || "",
      schedule: doctor?.schedule || "",
      consultationFee: doctor?.consultationFee ?? 0,
      bio: doctor?.bio || "",
      employmentStatus: doctor?.employmentStatus || "ACTIVE",
      availability: doctor?.availability || "AVAILABLE",
      photoUrl: doctor?.photoUrl || "",
    },
  });

  useEffect(() => {
    reset({
      firstName: doctor?.user?.firstName || "",
      lastName: doctor?.user?.lastName || "",
      email: doctor?.user?.email || "",
      phone: doctor?.user?.phone || "",
      departmentId: doctor?.departmentId || "",
      specialization: doctor?.specialization || "",
      qualifications: doctor?.qualifications || "",
      licenseNumber: doctor?.licenseNumber || "",
      schedule: doctor?.schedule || "",
      consultationFee: doctor?.consultationFee ?? 0,
      bio: doctor?.bio || "",
      employmentStatus: doctor?.employmentStatus || "ACTIVE",
      availability: doctor?.availability || "AVAILABLE",
      photoUrl: doctor?.photoUrl || "",
    });
  }, [doctor, reset]);

  const handleFormSubmit: SubmitHandler<DoctorFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">First Name</label>
          <input {...register("firstName")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
          {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Last Name</label>
          <input {...register("lastName")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
          {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input type="email" {...register("email")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <input {...register("phone")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Department</label>
          <select {...register("departmentId")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Specialization</label>
          <input {...register("specialization")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Qualifications</label>
          <input {...register("qualifications")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">License Number</label>
          <input {...register("licenseNumber")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Schedule</label>
          <input {...register("schedule")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Mon-Fri 09:00-17:00" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Consultation Fee</label>
          <input type="number" step="0.01" {...register("consultationFee")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Employment Status</label>
          <select {...register("employmentStatus")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Availability</label>
          <select {...register("availability")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
            <option value="AVAILABLE">Available</option>
            <option value="BUSY">Busy</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Photo URL</label>
          <input {...register("photoUrl")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="https://..." />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Bio</label>
          <textarea rows={3} {...register("bio")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel ? (
          <button type="button" onClick={onCancel} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
            Cancel
          </button>
        ) : null}
        <button type="submit" disabled={submitting} className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {doctor ? "Update Doctor" : "Create Doctor"}
        </button>
      </div>
    </form>
  );
};
