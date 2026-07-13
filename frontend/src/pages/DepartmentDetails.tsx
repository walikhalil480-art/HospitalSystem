import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, UserRound } from "lucide-react";
import { useDepartment, useDepartmentStats } from "../features/department/hooks/useDepartments";

export default function DepartmentDetailsPage() {
  const { id } = useParams();
  const { data: department, isLoading, isError } = useDepartment(id);
  const { data: stats } = useDepartmentStats();

  if (isLoading) return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading department details...</div>;
  if (isError || !department) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Department not found.</div>;

  return (
    <div className="space-y-6">
      <Link to="/departments" className="inline-flex items-center text-sm font-medium text-blue-600">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to departments
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{department.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{department.description || "No description provided."}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-blue-600" /> Code: {department.code || "—"}</div>
            <div className="mt-2 flex items-center gap-2"><UserRound className="h-4 w-4 text-blue-600" /> Doctors: {department._count?.staff ?? 0}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900">Department statistics</h3>
            <p className="mt-2 text-sm text-slate-600">Total departments: {stats?.totalDepartments ?? 0}</p>
            <p className="text-sm text-slate-600">Active departments: {stats?.activeDepartments ?? 0}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900">Assigned doctors</h3>
            {department.staff?.length ? (
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {department.staff.map((doctor: any) => (
                  <li key={doctor.id} className="rounded-md bg-slate-50 px-3 py-2">
                    {doctor.user?.firstName} {doctor.user?.lastName} ({doctor.user?.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-600">No doctors assigned yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
