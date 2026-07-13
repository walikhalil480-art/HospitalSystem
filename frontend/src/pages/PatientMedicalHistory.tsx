import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePatientMedicalHistory } from "../features/emr/hooks/useMedicalRecords";

export default function PatientMedicalHistoryPage() {
  const { patientId } = useParams();
  const { data, isLoading, isError } = usePatientMedicalHistory(patientId);

  if (isLoading) return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading patient history...</div>;
  if (isError || !data) return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-red-600">Unable to load patient history.</div>;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/emr" className="rounded-md p-2 text-slate-600 hover:bg-slate-100"><ArrowLeft className="h-4 w-4" /></Link>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Patient Medical History</h2>
          <p className="text-sm text-slate-500">Visit history and prior records.</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-500">No prior records found.</div>
      ) : (
        <div className="space-y-3">
          {data.map((record: any) => (
            <div key={record.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{record.medicalRecordNumber}</p>
                  <p className="text-sm text-slate-500">{record.chiefComplaint || "No complaint recorded"}</p>
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{record.status}</span>
              </div>
              <div className="mt-3 text-sm text-slate-600">{record.diagnosis || "No diagnosis recorded"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
