import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import { useMedicalRecord } from "../features/emr/hooks/useMedicalRecords";

export default function MedicalRecordDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useMedicalRecord(id);

  if (isLoading) return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading medical record...</div>;
  if (isError || !data) return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-red-600">Unable to load medical record.</div>;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<html><body><h2>Medical Record ${data.medicalRecordNumber}</h2><pre>${JSON.stringify(data, null, 2)}</pre></body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/emr" className="rounded-md p-2 text-slate-600 hover:bg-slate-100"><ArrowLeft className="h-4 w-4" /></Link>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{data.medicalRecordNumber}</h2>
            <p className="text-sm text-slate-500">{data.chiefComplaint || "No chief complaint recorded"}</p>
          </div>
        </div>
        <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
          <Printer className="h-4 w-4" /> Print
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Patient</h3>
          <p className="mt-2 text-sm text-slate-600">{data.patient?.user?.firstName} {data.patient?.user?.lastName}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Doctor</h3>
          <p className="mt-2 text-sm text-slate-600">Dr. {data.doctor?.user?.firstName} {data.doctor?.user?.lastName}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Visit</h3>
          <p className="mt-2 text-sm text-slate-600">{new Date(data.visitDate).toLocaleDateString()}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Status</h3>
          <p className="mt-2 text-sm text-slate-600">{data.status}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Diagnosis</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{data.diagnosis || "Not recorded"}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Treatment Plan</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{data.treatmentPlan || "Not recorded"}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Clinical Notes</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{data.clinicalNotes || "Not recorded"}</p>
        </div>
      </div>
    </div>
  );
}
