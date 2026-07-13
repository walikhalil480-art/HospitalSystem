import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../services/api";
import { Pencil, Plus, Search, Trash2, AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PatientModal } from "./PatientModal";

export const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["patients", page, searchTerm],
    queryFn: async () => {
      const res = await api.get("/patients", { params: { page, limit: 10, search: searchTerm } });
      return res.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/patients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete patient");
    },
  });

  const patients = useMemo(() => data?.patients || [], [data]);
  const pagination = data?.pagination;

  const openCreateModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const openEditModal = (patient: any) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleDelete = (patient: any) => {
    if (window.confirm(`Delete ${patient.user.firstName} ${patient.user.lastName}?`)) {
      deleteMutation.mutate(patient.id);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Patients</h2>
          <p className="text-sm text-slate-500">Manage patient profiles, contacts, and medical details.</p>
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
              placeholder="Search by name or email"
              className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button onClick={openCreateModal} className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </button>
        </div>
      </div>

      {isError ? (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          Unable to load patients right now.
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Gender</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Blood Group</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Registered</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">Loading patients...</td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">No patients found.</td>
              </tr>
            ) : (
              patients.map((patient: any) => (
                <tr key={patient.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="text-sm font-medium text-slate-900">{patient.user?.firstName} {patient.user?.lastName}</div>
                    <div className="text-sm text-slate-500">{patient.patientNumber}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="text-sm text-slate-900">{patient.user?.email}</div>
                    <div className="text-sm text-slate-500">{patient.user?.phone || "N/A"}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{patient.gender}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">{patient.bloodGroup || "N/A"}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{new Date(patient.createdAt).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(patient)} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(patient)} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
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
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
            Previous
          </button>
          <span className="text-sm text-slate-600">Page {page} of {pagination.totalPages}</span>
          <button disabled={page === pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
            Next
          </button>
        </div>
      ) : null}

      <PatientModal open={isModalOpen} onClose={() => setIsModalOpen(false)} patient={selectedPatient} />
    </div>
  );
};
