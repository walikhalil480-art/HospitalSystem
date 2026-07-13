import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CalendarDays, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useAppointments, useCancelAppointment, useDeleteAppointment } from "../hooks/useAppointments";

const statusStyles: Record<string, string> = {
  SCHEDULED: "bg-sky-100 text-sky-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-violet-100 text-violet-700",
  CANCELLED: "bg-rose-100 text-rose-700",
  NO_SHOW: "bg-slate-100 text-slate-700",
};

export const AppointmentList = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAppointments({ page, limit: 10, search, status, date });
  const cancelAppointment = useCancelAppointment();
  const deleteAppointment = useDeleteAppointment();

  const appointments = useMemo(() => data?.appointments || [], [data]);
  const pagination = data?.pagination;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Appointments</h2>
          <p className="text-sm text-slate-500">Manage appointments, queue numbers, and visit details.</p>
        </div>
        <Link to="/appointments/new" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Add Appointment
        </Link>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <div className="relative md:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} placeholder="Search by patient, doctor, or reason" className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm" />
        </div>
        <input type="date" value={date} onChange={(e) => { setPage(1); setDate(e.target.value); }} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="NO_SHOW">No Show</option>
        </select>
      </div>

      {isError ? (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> Unable to load appointments.
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Appointment</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Doctor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date/Time</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">Loading appointments...</td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">No appointments found.</td></tr>
            ) : (
              appointments.map((appointment: any) => (
                <tr key={appointment.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="text-sm font-medium text-slate-900">{appointment.appointmentNumber}</div>
                    <div className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{appointment.queueNumber}</div>
                    <div className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusStyles[appointment.status] || "bg-slate-100 text-slate-700"}`}>{appointment.status}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{appointment.patient?.user?.firstName} {appointment.patient?.user?.lastName}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{appointment.doctor?.user?.firstName} {appointment.doctor?.user?.lastName}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-slate-400" />{new Date(appointment.appointmentDate).toLocaleString()}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/appointments/${appointment.id}`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600"><Eye className="h-4 w-4" /></Link>
                      <Link to={`/appointments/${appointment.id}/edit`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => { if (window.confirm("Cancel this appointment?")) cancelAppointment.mutate(appointment.id); }} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-amber-600">Cancel</button>
                      <button onClick={() => { if (window.confirm("Delete this appointment?")) deleteAppointment.mutate(appointment.id); }} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 ? (
        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:opacity-50">Previous</button>
          <span className="text-sm text-slate-600">Page {page} of {pagination.totalPages}</span>
          <button disabled={page === pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:opacity-50">Next</button>
        </div>
      ) : null}
    </div>
  );
};
