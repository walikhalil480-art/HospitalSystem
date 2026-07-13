import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DepartmentForm } from "../features/department/components/DepartmentForm";
import { useCreateDepartment, useDepartment, useUpdateDepartment } from "../features/department/hooks/useDepartments";

export default function DepartmentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const { data: department } = useDepartment(id);

  const handleSubmit = (data: any) => {
    if (isEditing && id) {
      updateDepartment.mutate({ id, payload: data }, { onSuccess: () => navigate("/departments") });
    } else {
      createDepartment.mutate(data, { onSuccess: () => navigate("/departments") });
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <button onClick={() => navigate("/departments")} className="mb-4 inline-flex items-center text-sm font-medium text-blue-600">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to departments
      </button>
      <h2 className="text-xl font-semibold text-slate-900">{isEditing ? "Edit Department" : "Add Department"}</h2>
      <p className="mt-1 text-sm text-slate-500">Create or update department records and assign doctors to the right clinical teams.</p>
      <div className="mt-6">
        <DepartmentForm department={department} submitting={createDepartment.isPending || updateDepartment.isPending} onSubmit={handleSubmit} onCancel={() => navigate("/departments")} />
      </div>
    </div>
  );
}
