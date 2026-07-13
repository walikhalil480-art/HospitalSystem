import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import { useCreateAppointment, useUpdateAppointment } from "../hooks/useAppointments";

const schema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  departmentId: z.string().min(1, "Department is required"),
  appointmentDate: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  consultationType: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
  reasonForVisit: z.string().optional(),
  symptoms: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export const AppointmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      consultationType: "IN_PERSON",
      priority: "NORMAL",
      status: "SCHEDULED",
    },
  });

  useEffect(() => {
    const loadOptions = async () => {
      const [patientsRes, doctorsRes, departmentsRes] = await Promise.all([
        api.get("/patients"),
        api.get("/doctors"),
        api.get("/departments"),
      ]);
      setPatients(patientsRes.data.data?.patients || []);
      setDoctors(doctorsRes.data.data?.doctors || []);
      setDepartments(departmentsRes.data.data?.departments || []);
    };

    loadOptions();
  }, []);

  useEffect(() => {
    if (!id) return;
    const loadAppointment = async () => {
      const res = await api.get(`/appointments/${id}`);
      const appointment = res.data.data.appointment;
      reset({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        departmentId: appointment.departmentId,
        appointmentDate: appointment.appointmentDate?.slice(0, 10),
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        consultationType: appointment.consultationType,
        priority: appointment.priority,
        status: appointment.status,
        reasonForVisit: appointment.reasonForVisit || "",
        symptoms: appointment.symptoms || "",
        notes: appointment.notes || "",
      });
    };
    loadAppointment();
  }, [id, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      consultationType: values.consultationType || "IN_PERSON",
      priority: values.priority || "NORMAL",
      status: values.status || "SCHEDULED",
    };

    if (id) {
      updateAppointment.mutate({ id, payload }, { onSuccess: () => navigate("/appointments") });
    } else {
      createAppointment.mutate(payload, { onSuccess: () => navigate("/appointments") });
    }
  };

  const title = useMemo(() => (id ? "Edit Appointment" : "Add Appointment"), [id]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">Create a new appointment or update an existing one.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Patient</label>
          <select {...register("patientId")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="">Select a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>{patient.user?.firstName} {patient.user?.lastName}</option>
            ))}
          </select>
          {errors.patientId ? <p className="mt-1 text-sm text-red-600">{errors.patientId.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Doctor</label>
          <select {...register("doctorId")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>Dr. {doctor.user?.firstName} {doctor.user?.lastName}</option>
            ))}
          </select>
          {errors.doctorId ? <p className="mt-1 text-sm text-red-600">{errors.doctorId.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Department</label>
          <select {...register("departmentId")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="">Select a department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </select>
          {errors.departmentId ? <p className="mt-1 text-sm text-red-600">{errors.departmentId.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
          <input type="date" {...register("appointmentDate")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          {errors.appointmentDate ? <p className="mt-1 text-sm text-red-600">{errors.appointmentDate.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Start Time</label>
          <input type="time" {...register("startTime")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          {errors.startTime ? <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">End Time</label>
          <input type="time" {...register("endTime")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          {errors.endTime ? <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Consultation Type</label>
          <select {...register("consultationType")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="IN_PERSON">In Person</option>
            <option value="ONLINE">Online</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
          <select {...register("priority")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="LOW">Low</option>
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
          <select {...register("status")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Reason for Visit</label>
          <textarea {...register("reasonForVisit")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Symptoms</label>
          <textarea {...register("symptoms")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
          <textarea {...register("notes")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="md:col-span-2 flex justify-end gap-3">
          <button type="button" onClick={() => navigate("/appointments")} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">{isSubmitting ? "Saving..." : title}</button>
        </div>
      </form>
    </div>
  );
};
