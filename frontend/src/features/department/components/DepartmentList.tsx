import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Eye, Pencil, Plus, Search, Trash2, UserPlus } from "lucide-react";
import { useAssignDoctorToDepartment, useDeleteDepartment, useDepartments } from "../hooks/useDepartments";

export const DepartmentList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useDepartments({ page, limit: 10, search });
  const deleteDepartment = useDeleteDepartment();
  const assignDoctor = useAssignDoctorToDepartment();

  const departments = useMemo(() => data?.departments || [], [data]);
  const pagination = data?.pagination;

  const handleAssign = (departmentId: string) => {
    const doctorId = window.prompt("Enter doctor staff ID to assign:");
    if (doctorId) assignDoctor.mutate({ id: departmentId, doctorId });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Departments</h2>
          <p className="text-sm text-slate-500">Manage departments, doctor assignments, and department-level metrics.</p>
        </div>
        <Link to="/departments/new" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Link>
      </div>

      <div className="mb-4 relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} placeholder="Search by department name or code" className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm" />
      </div>

      {isError ? (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> Unable to load departments.
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Department</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Doctors</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Code</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {isLoading ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">Loading departments...</td></tr>
            ) : departments.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">No departments found.</td></tr>
            ) : (
              departments.map((department: any) => (
                <tr key={department.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="text-sm font-medium text-slate-900">{department.name}</div>
                    <div className="text-sm text-slate-500">{department.description || "No description"}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{department._count?.staff ?? 0}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{department.code || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/departments/${department.id}`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600"><Eye className="h-4 w-4" /></Link>
                      <Link to={`/departments/${department.id}/edit`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => handleAssign(department.id)} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600"><UserPlus className="h-4 w-4" /></button>
                      <button onClick={() => { if (window.confirm("Delete this department?")) deleteDepartment.mutate(department.id); }} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
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
