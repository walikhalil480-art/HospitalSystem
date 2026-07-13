import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
  code: z.string().optional(),
  description: z.string().optional(),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface Props {
  department?: any;
  submitting?: boolean;
  onSubmit: (data: DepartmentFormData) => void;
  onCancel?: () => void;
}

export const DepartmentForm = ({ department, submitting = false, onSubmit, onCancel }: Props) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema) as any,
    defaultValues: {
      name: department?.name || "",
      code: department?.code || "",
      description: department?.description || "",
    },
  });

  useEffect(() => {
    reset({
      name: department?.name || "",
      code: department?.code || "",
      description: department?.description || "",
    });
  }, [department, reset]);

  const handleFormSubmit: SubmitHandler<DepartmentFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-slate-700">Department Name</label>
        <input {...register("name")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Code</label>
        <input {...register("code")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Description</label>
        <textarea rows={4} {...register("description")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div className="flex justify-end gap-3">
        {onCancel ? (
          <button type="button" onClick={onCancel} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Cancel</button>
        ) : null}
        <button type="submit" disabled={submitting} className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {department ? "Update Department" : "Create Department"}
        </button>
      </div>
    </form>
  );
};
