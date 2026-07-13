import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useDoctors, useDeleteDoctor } from "../hooks/useDoctors";

export const DoctorList = () => {
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState("");
  const [availability, setAvailability] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useDoctors({ page, limit: 10, search, departmentId, status, availability });
  const deleteDoctor = useDeleteDoctor();

  const doctors = useMemo(() => data?.doctors || [], [data]);
  const pagination = data?.pagination;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Doctors</h2>
          <p className="text-sm text-slate-500">Manage doctors, departments, availability, and profiles.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/doctors/new" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Add Doctor
          </Link>
        </div>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} placeholder="Search by name or email" className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm" />
        </div>
        <select value={departmentId} onChange={(e) => { setPage(1); setDepartmentId(e.target.value); }} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">All departments</option>
          <option value="1">General Medicine</option>
        </select>
        <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="ON_LEAVE">On Leave</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
        <select value={availability} onChange={(e) => { setPage(1); setAvailability(e.target.value); }} className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-1">
          <option value="">All availability</option>
          <option value="AVAILABLE">Available</option>
          <option value="BUSY">Busy</option>
          <option value="OFFLINE">Offline</option>
        </select>
      </div>

      {isError ? (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> Unable to load doctors.
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Doctor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Department</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Specialization</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Availability</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">Loading doctors...</td></tr>
            ) : doctors.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">No doctors found.</td></tr>
            ) : (
              doctors.map((doctor: any) => (
                <tr key={doctor.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="text-sm font-medium text-slate-900">{doctor.user?.firstName} {doctor.user?.lastName}</div>
                    <div className="text-sm text-slate-500">{doctor.user?.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{doctor.department?.name || "Unassigned"}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{doctor.specialization || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{doctor.availability || "AVAILABLE"}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/doctors/${doctor.id}`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600"><Eye className="h-4 w-4" /></Link>
                      <Link to={`/doctors/${doctor.id}/edit`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => { if (window.confirm("Delete this doctor?")) deleteDoctor.mutate(doctor.id); }} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
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
