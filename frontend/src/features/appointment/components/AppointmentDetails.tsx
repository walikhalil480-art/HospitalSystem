import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock3, Stethoscope, UserRound } from "lucide-react";
import api from "../../../services/api";

export const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/appointments/${id}`);
      setAppointment(res.data.data.appointment);
    };
    load();
  }, [id]);

  if (!appointment) return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">Loading...</div>;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <button onClick={() => navigate("/appointments")} className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600">
        <ArrowLeft className="h-4 w-4" /> Back to appointments
      </button>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{appointment.appointmentNumber}</h2>
          <p className="text-sm text-slate-500">Queue #{appointment.queueNumber}</p>
        </div>
        <div className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">{appointment.status}</div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-700"><UserRound className="h-4 w-4" /> Patient</div>
          <p className="mt-2 font-medium text-slate-900">{appointment.patient?.user?.firstName} {appointment.patient?.user?.lastName}</p>
          <p className="text-sm text-slate-500">{appointment.patient?.user?.email}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-700"><Stethoscope className="h-4 w-4" /> Doctor</div>
          <p className="mt-2 font-medium text-slate-900">Dr. {appointment.doctor?.user?.firstName} {appointment.doctor?.user?.lastName}</p>
          <p className="text-sm text-slate-500">{appointment.department?.name}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-700"><CalendarDays className="h-4 w-4" /> Appointment Date</div>
          <p className="mt-2 font-medium text-slate-900">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-700"><Clock3 className="h-4 w-4" /> Time</div>
          <p className="mt-2 font-medium text-slate-900">{appointment.startTime} - {appointment.endTime}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-900">Visit Details</h3>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <p><span className="font-medium text-slate-800">Reason:</span> {appointment.reasonForVisit || "—"}</p>
          <p><span className="font-medium text-slate-800">Symptoms:</span> {appointment.symptoms || "—"}</p>
          <p><span className="font-medium text-slate-800">Notes:</span> {appointment.notes || "—"}</p>
          <p><span className="font-medium text-slate-800">Priority:</span> {appointment.priority}</p>
          <p><span className="font-medium text-slate-800">Consultation type:</span> {appointment.consultationType}</p>
        </div>
      </div>
    </div>
  );
};
