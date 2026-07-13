import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BriefcaseMedical, CalendarDays, DollarSign } from "lucide-react";
import { useDoctor } from "../features/doctor/hooks/useDoctors";

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const { data: doctor, isLoading, isError } = useDoctor(id);

  if (isLoading) return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading doctor details...</div>;
  if (isError || !doctor) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Doctor not found.</div>;

  return (
    <div className="space-y-6">
      <Link to="/doctors" className="inline-flex items-center text-sm font-medium text-blue-600">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to doctors
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900">{doctor.user?.firstName} {doctor.user?.lastName}</h2>
            <p className="text-sm text-slate-500">{doctor.specialization || "General Physician"}</p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{doctor.department?.name || "Unassigned"}</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{doctor.employmentStatus || "ACTIVE"}</span>
              <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">{doctor.availability || "AVAILABLE"}</span>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex items-center gap-2"><BriefcaseMedical className="h-4 w-4 text-blue-600" /> License: {doctor.licenseNumber || "—"}</div>
            <div className="mt-2 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-600" /> Schedule: {doctor.schedule || "—"}</div>
            <div className="mt-2 flex items-center gap-2"><DollarSign className="h-4 w-4 text-blue-600" /> Fee: ${doctor.consultationFee ?? 0}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900">Profile</h3>
            <p className="mt-2 text-sm text-slate-600">{doctor.bio || "No biography provided."}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900">Credentials</h3>
            <p className="mt-2 text-sm text-slate-600">{doctor.qualifications || "No qualifications provided."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
