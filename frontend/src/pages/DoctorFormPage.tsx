import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DoctorForm } from "../features/doctor/components/DoctorForm";
import { useCreateDoctor, useUpdateDoctor, useDoctor } from "../features/doctor/hooks/useDoctors";
import api from "../services/api";

export default function DoctorFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const { data: doctor } = useDoctor(id);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    api.get("/departments").then((res) => setDepartments(res.data.data?.departments || []));
  }, []);

  const handleSubmit = (data: any) => {
    const payload = {
      ...data,
      consultationFee: Number(data.consultationFee || 0),
      photoUrl: data.photoUrl || undefined,
    };

    if (isEditing && id) {
      updateDoctor.mutate({ id, payload });
    } else {
      createDoctor.mutate(payload, { onSuccess: () => navigate("/doctors") });
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <button onClick={() => navigate("/doctors")} className="mb-4 inline-flex items-center text-sm font-medium text-blue-600">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to doctors
      </button>
      <h2 className="text-xl font-semibold text-slate-900">{isEditing ? "Edit Doctor" : "Add Doctor"}</h2>
      <p className="mt-1 text-sm text-slate-500">Create or update doctor records with department, specialty, pricing, and availability.</p>
      <div className="mt-6">
        <DoctorForm doctor={doctor} departments={departments} submitting={createDoctor.isPending || updateDoctor.isPending} onSubmit={handleSubmit} onCancel={() => navigate("/doctors")} />
      </div>
    </div>
  );
}
