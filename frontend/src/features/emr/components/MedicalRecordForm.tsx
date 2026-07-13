import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../../services/api";

const schema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  appointmentId: z.string().min(1, "Appointment is required"),
  visitDate: z.string().min(1, "Visit date is required"),
  chiefComplaint: z.string().optional(),
  symptoms: z.string().optional(),
  diagnosis: z.string().optional(),
  differentialDiagnosis: z.string().optional(),
  treatmentPlan: z.string().optional(),
  clinicalNotes: z.string().optional(),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
  bloodPressure: z.string().optional(),
  heartRate: z.string().optional(),
  respiratoryRate: z.string().optional(),
  temperature: z.string().optional(),
  oxygenSaturation: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  bmi: z.string().optional(),
  prescriptionsText: z.string().optional(),
  allergiesText: z.string().optional(),
  chronicConditionsText: z.string().optional(),
  immunizationsText: z.string().optional(),
  laboratoryRequestsText: z.string().optional(),
  radiologyRequestsText: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface MedicalRecordFormProps {
  initialValues?: Partial<FormValues>;
  onSubmit: (values: Record<string, any>) => void;
  submitting?: boolean;
  onCancel?: () => void;
}

const parseList = (value?: string) => {
  if (!value) return undefined;
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseNumber = (value?: string) => {
  if (!value || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const MedicalRecordForm = ({ initialValues, onSubmit, submitting = false, onCancel }: MedicalRecordFormProps) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "OPEN",
      ...initialValues,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
          api.get("/patients"),
          api.get("/doctors"),
          api.get("/appointments"),
        ]);
        setPatients(patientsRes.data.data?.patients || []);
        setDoctors(doctorsRes.data.data?.doctors || []);
        setAppointments(appointmentsRes.data.data?.appointments || []);
      } catch {
        setPatients([]);
        setDoctors([]);
        setAppointments([]);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (initialValues) reset({ status: "OPEN", ...initialValues });
  }, [initialValues, reset]);

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      vitalSigns: {
        bloodPressure: values.bloodPressure?.trim() || undefined,
        heartRate: parseNumber(values.heartRate),
        respiratoryRate: parseNumber(values.respiratoryRate),
        temperature: parseNumber(values.temperature),
        oxygenSaturation: parseNumber(values.oxygenSaturation),
        weight: parseNumber(values.weight),
        height: parseNumber(values.height),
        bmi: parseNumber(values.bmi),
      },
      prescriptions: parseList(values.prescriptionsText),
      allergies: parseList(values.allergiesText),
      chronicConditions: parseList(values.chronicConditionsText),
      immunizations: parseList(values.immunizationsText),
      laboratoryRequests: parseList(values.laboratoryRequestsText),
      radiologyRequests: parseList(values.radiologyRequestsText),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
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
          <label className="mb-1 block text-sm font-medium text-slate-700">Appointment</label>
          <select {...register("appointmentId")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="">Select an appointment</option>
            {appointments.map((appointment) => (
              <option key={appointment.id} value={appointment.id}>{appointment.appointmentNumber}</option>
            ))}
          </select>
          {errors.appointmentId ? <p className="mt-1 text-sm text-red-600">{errors.appointmentId.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Visit Date</label>
          <input type="date" {...register("visitDate")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          {errors.visitDate ? <p className="mt-1 text-sm text-red-600">{errors.visitDate.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Chief Complaint</label>
          <input {...register("chiefComplaint")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
          <select {...register("status")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Symptoms</label>
          <textarea {...register("symptoms")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Diagnosis</label>
          <textarea {...register("diagnosis")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Differential Diagnosis</label>
          <textarea {...register("differentialDiagnosis")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Treatment Plan</label>
          <textarea {...register("treatmentPlan")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Clinical Notes</label>
          <textarea {...register("clinicalNotes")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>

        <div className="md:col-span-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="mb-3 text-sm font-semibold text-slate-800">Vital Signs</h4>
          <div className="grid gap-3 md:grid-cols-4">
            <input placeholder="Blood Pressure" {...register("bloodPressure")} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder="Heart Rate" {...register("heartRate")} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder="Resp. Rate" {...register("respiratoryRate")} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder="Temperature" {...register("temperature")} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder="O2 Saturation" {...register("oxygenSaturation")} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder="Weight" {...register("weight")} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder="Height" {...register("height")} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder="BMI" {...register("bmi")} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="md:col-span-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="mb-3 text-sm font-semibold text-slate-800">Medications & Tests</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <textarea placeholder="Prescriptions (one per line or comma separated)" {...register("prescriptionsText")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <textarea placeholder="Allergies (one per line or comma separated)" {...register("allergiesText")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <textarea placeholder="Chronic conditions" {...register("chronicConditionsText")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <textarea placeholder="Immunizations" {...register("immunizationsText")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <textarea placeholder="Laboratory requests" {...register("laboratoryRequestsText")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <textarea placeholder="Radiology requests" {...register("radiologyRequestsText")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel ? (
          <button type="button" onClick={onCancel} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Cancel</button>
        ) : null}
        <button type="submit" disabled={submitting} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
          {submitting ? "Saving..." : "Save Medical Record"}
        </button>
      </div>
    </form>
  );
};
