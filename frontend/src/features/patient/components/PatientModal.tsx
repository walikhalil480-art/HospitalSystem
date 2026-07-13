import { useEffect } from "react";
import { X } from "lucide-react";
import { PatientForm } from "./PatientForm";

interface PatientModalProps {
  open: boolean;
  onClose: () => void;
  patient?: any;
}

export const PatientModal = ({ open, onClose, patient }: PatientModalProps) => {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="mx-auto w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{patient ? "Edit Patient" : "Add Patient"}</h3>
            <p className="mt-1 text-sm text-slate-500">{patient ? "Update patient details and account information." : "Create a new patient profile and account."}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">
          <PatientForm patient={patient} onSuccess={onClose} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
};
