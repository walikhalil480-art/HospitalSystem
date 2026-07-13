import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, FileText, Pencil, Printer, Search, Trash2, Plus } from "lucide-react";
import { useCreateMedicalRecord, useDeleteMedicalRecord, useMedicalRecords, useUpdateMedicalRecord } from "../hooks/useMedicalRecords";
import { MedicalRecordForm } from "./MedicalRecordForm";

export const MedicalRecordList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data, isLoading, isError } = useMedicalRecords({ page, limit: 10, search: searchTerm });
  const createMutation = useCreateMedicalRecord();
  const updateMutation = useUpdateMedicalRecord();
  const deleteMutation = useDeleteMedicalRecord();
  const records = useMemo(() => data?.records || [], [data]);
  const pagination = data?.pagination;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const resetForm = () => {
    setEditingRecord(null);
    setIsCreating(false);
  };

  const handleDelete = (record: any) => {
    if (window.confirm(`Delete ${record.medicalRecordNumber}?`)) {
      deleteMutation.mutate(record.id);
    }
  };

  const handlePrint = (record: any) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<html><body><h2>Medical Record ${record.medicalRecordNumber}</h2><pre>${JSON.stringify(record, null, 2)}</pre></body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleCreate = (payload: Record<string, any>) => {
    createMutation.mutate(payload, { onSuccess: resetForm });
  };

  const handleUpdate = (payload: Record<string, any>) => {
    if (!editingRecord) return;
    updateMutation.mutate({ id: editingRecord.id, payload }, { onSuccess: resetForm });
  };

  const formValues = editingRecord ? {
    patientId: editingRecord.patientId,
    doctorId: editingRecord.doctorId,
    appointmentId: editingRecord.appointmentId || "",
    visitDate: editingRecord.visitDate?.slice(0, 10),
    chiefComplaint: editingRecord.chiefComplaint || "",
    symptoms: editingRecord.symptoms || "",
    diagnosis: editingRecord.diagnosis || "",
    differentialDiagnosis: editingRecord.differentialDiagnosis || "",
    treatmentPlan: editingRecord.treatmentPlan || "",
    clinicalNotes: editingRecord.clinicalNotes || "",
    status: editingRecord.status,
    bloodPressure: editingRecord.vitalSigns?.bloodPressure || "",
    heartRate: editingRecord.vitalSigns?.heartRate?.toString() || "",
    respiratoryRate: editingRecord.vitalSigns?.respiratoryRate?.toString() || "",
    temperature: editingRecord.vitalSigns?.temperature?.toString() || "",
    oxygenSaturation: editingRecord.vitalSigns?.oxygenSaturation?.toString() || "",
    weight: editingRecord.vitalSigns?.weight?.toString() || "",
    height: editingRecord.vitalSigns?.height?.toString() || "",
    bmi: editingRecord.vitalSigns?.bmi?.toString() || "",
    prescriptionsText: editingRecord.prescriptions?.join("\n") || "",
    allergiesText: editingRecord.allergies?.join("\n") || "",
    chronicConditionsText: editingRecord.chronicConditions?.join("\n") || "",
    immunizationsText: editingRecord.immunizations?.join("\n") || "",
    laboratoryRequestsText: editingRecord.laboratoryRequests?.join("\n") || "",
    radiologyRequestsText: editingRecord.radiologyRequests?.join("\n") || "",
  } : undefined;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Medical Records</h2>
          <p className="text-sm text-slate-500">Search and manage electronic medical records.</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => {
                setPage(1);
                setSearchTerm(e.target.value);
              }}
              placeholder="Search records"
              className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <button onClick={() => { setEditingRecord(null); setIsCreating(true); }} className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> New Record
          </button>
        </div>
      </div>

      {isError ? (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> Unable to load medical records right now.
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Record</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Doctor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">Loading records...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">No medical records found.</td></tr>
            ) : records.map((record: any) => (
              <tr key={record.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="text-sm font-medium text-slate-900">{record.medicalRecordNumber}</div>
                  <div className="text-sm text-slate-500">{record.chiefComplaint || "No chief complaint"}</div>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{record.patient?.user?.firstName} {record.patient?.user?.lastName}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">Dr. {record.doctor?.user?.firstName} {record.doctor?.user?.lastName}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{record.status}</td>
                <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/emr/${record.id}`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600"><FileText className="h-4 w-4" /></Link>
                    <Link to={`/emr/history/${record.patientId}`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-violet-600"><Search className="h-4 w-4" /></Link>
                    <button onClick={() => { setEditingRecord(record); setIsCreating(false); }} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handlePrint(record)} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600"><Printer className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(record)} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 ? (
        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
          <span className="text-sm text-slate-600">Page {page} of {pagination.totalPages}</span>
          <button disabled={page === pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">Next</button>
        </div>
      ) : null}

      {(isCreating || editingRecord) ? (
        <div className="mt-6 rounded-lg border border-slate-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{editingRecord ? "Edit Record" : "Create Record"}</h3>
            <button onClick={resetForm} className="text-sm text-slate-500">Close</button>
          </div>
          <MedicalRecordForm initialValues={formValues} onSubmit={editingRecord ? handleUpdate : handleCreate} submitting={isSubmitting} onCancel={resetForm} />
        </div>
      ) : null}
    </div>
  );
};
