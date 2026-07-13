import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FlaskConical, ClipboardList, Microscope, Search, CheckCircle2, FileText } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const initialForm = {
  patientId: "",
  doctorId: "",
  appointmentId: "",
  medicalRecordId: "",
  laboratoryCategoryId: "",
  laboratoryTestId: "",
  priority: "NORMAL",
  status: "PENDING",
  clinicalNotes: "",
};

const initialResultForm = {
  resultValue: "",
  referenceRange: "",
  interpretation: "",
  technicianNotes: "",
  status: "ENTERED",
};

export default function LaboratoryPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [resultForm, setResultForm] = useState(initialResultForm);
  const [submitting, setSubmitting] = useState(false);
  const [resultSubmitting, setResultSubmitting] = useState(false);

  const { data: ordersData, isLoading: loadingOrders, refetch } = useQuery({
    queryKey: ["laboratory-orders", searchTerm, page],
    queryFn: async () => {
      const res = await api.get("/laboratory", { params: { page, limit: 8, search: searchTerm || undefined } });
      return res.data.data;
    },
  });

  const { data: patientsResponse } = useQuery({
    queryKey: ["laboratory-patients"],
    queryFn: async () => {
      const res = await api.get("/patients", { params: { limit: 100 } });
      return res.data.data;
    },
  });

  const { data: doctorsResponse } = useQuery({
    queryKey: ["laboratory-doctors"],
    queryFn: async () => {
      const res = await api.get("/doctors", { params: { limit: 100 } });
      return res.data.data;
    },
  });

  const { data: appointmentsResponse } = useQuery({
    queryKey: ["laboratory-appointments"],
    queryFn: async () => {
      const res = await api.get("/appointments", { params: { limit: 100 } });
      return res.data.data;
    },
  });

  const { data: medicalRecordsResponse } = useQuery({
    queryKey: ["laboratory-medical-records"],
    queryFn: async () => {
      const res = await api.get("/medical-records", { params: { limit: 100 } });
      return res.data.data;
    },
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ["laboratory-categories"],
    queryFn: async () => {
      const res = await api.get("/laboratory/categories", { params: { limit: 100 } });
      return res.data.data;
    },
  });

  const { data: testsResponse } = useQuery({
    queryKey: ["laboratory-tests"],
    queryFn: async () => {
      const res = await api.get("/laboratory/tests", { params: { limit: 100 } });
      return res.data.data;
    },
  });

  const patients = Array.isArray(patientsResponse?.patients) ? patientsResponse.patients : [];
  const doctors = Array.isArray(doctorsResponse?.doctors) ? doctorsResponse.doctors : [];
  const appointments = Array.isArray(appointmentsResponse?.appointments) ? appointmentsResponse.appointments : [];
  const medicalRecords = Array.isArray(medicalRecordsResponse?.medicalRecords) ? medicalRecordsResponse.medicalRecords : [];
  const categories = Array.isArray(categoriesResponse?.categories) ? categoriesResponse.categories : [];
  const tests = Array.isArray(testsResponse?.tests) ? testsResponse.tests : [];
  const orders = Array.isArray(ordersData?.orders) ? ordersData.orders : [];
  const pagination = ordersData?.pagination;

  const matchingAppointments = useMemo(() => {
    return appointments.filter((appointment: any) => {
      const matchesPatient = !form.patientId || appointment.patientId === form.patientId;
      const matchesDoctor = !form.doctorId || appointment.doctorId === form.doctorId;
      return matchesPatient && matchesDoctor;
    });
  }, [appointments, form.patientId, form.doctorId]);

  const matchingMedicalRecords = useMemo(() => {
    return medicalRecords.filter((record: any) => {
      const matchesPatient = !form.patientId || record.patientId === form.patientId;
      const matchesDoctor = !form.doctorId || record.doctorId === form.doctorId;
      const matchesAppointment = !form.appointmentId || record.appointmentId === form.appointmentId;
      return matchesPatient && matchesDoctor && matchesAppointment;
    });
  }, [medicalRecords, form.patientId, form.doctorId, form.appointmentId]);

  const filteredTests = useMemo(() => {
    return tests.filter((test: any) => !form.laboratoryCategoryId || test.laboratoryCategoryId === form.laboratoryCategoryId);
  }, [tests, form.laboratoryCategoryId]);

  const resetForms = () => {
    setForm(initialForm);
    setResultForm(initialResultForm);
    setEditingOrder(null);
    setSelectedOrder(null);
  };

  const openCreateModal = () => {
    resetForms();
    setShowModal(true);
  };

  const openEditModal = (order: any) => {
    setEditingOrder(order);
    setForm({
      patientId: order.patientId,
      doctorId: order.doctorId,
      appointmentId: order.appointmentId,
      medicalRecordId: order.medicalRecordId,
      laboratoryCategoryId: order.laboratoryCategoryId,
      laboratoryTestId: order.laboratoryTestId,
      priority: order.priority,
      status: order.status,
      clinicalNotes: order.clinicalNotes || "",
    });
    setShowModal(true);
  };

  const openResultModal = (order: any) => {
    setSelectedOrder(order);
    setResultForm({
      resultValue: order.result?.resultValue || "",
      referenceRange: order.result?.referenceRange || "",
      interpretation: order.result?.interpretation || "",
      technicianNotes: order.result?.technicianNotes || "",
      status: order.result?.status || "ENTERED",
    });
    setShowResultModal(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.patientId || !form.doctorId || !form.appointmentId || !form.medicalRecordId || !form.laboratoryCategoryId || !form.laboratoryTestId) {
      toast.error("Please complete every required field before saving.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingOrder) {
        await api.put(`/laboratory/${editingOrder.id}`, form);
        toast.success("Laboratory order updated successfully");
      } else {
        await api.post("/laboratory", form);
        toast.success("Laboratory order created successfully");
      }
      setShowModal(false);
      resetForms();
      queryClient.invalidateQueries({ queryKey: ["laboratory-orders"] });
      await refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to save the laboratory order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResultSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedOrder) return;

    try {
      setResultSubmitting(true);
      await api.post(`/laboratory/${selectedOrder.id}/result`, resultForm);
      toast.success("Laboratory result saved successfully");
      setShowResultModal(false);
      setSelectedOrder(null);
      queryClient.invalidateQueries({ queryKey: ["laboratory-orders"] });
      await refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to save the laboratory result");
    } finally {
      setResultSubmitting(false);
    }
  };

  const verifyResult = async (order: any) => {
    try {
      await api.put(`/laboratory/${order.id}/result`, { status: "VERIFIED" });
      toast.success("Laboratory result verified");
      queryClient.invalidateQueries({ queryKey: ["laboratory-orders"] });
      await refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to verify the laboratory result");
    }
  };

  const deleteOrder = async (order: any) => {
    if (!window.confirm(`Delete ${order.orderNumber}?`)) return;

    try {
      await api.delete(`/laboratory/${order.id}`);
      toast.success("Laboratory order removed");
      queryClient.invalidateQueries({ queryKey: ["laboratory-orders"] });
      await refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to delete the laboratory order");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laboratory</h1>
          <p className="text-sm text-slate-500">Coordinate diagnostic tests, results, and specimen tracking.</p>
        </div>
        <button onClick={openCreateModal} className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700">
          <FlaskConical className="mr-2 h-4 w-4" />
          New lab order
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
            <Microscope className="h-5 w-5" />
          </div>
          <p className="text-2xl font-semibold text-slate-900">{orders.length}</p>
          <p className="mt-1 text-sm font-medium text-slate-700">Orders</p>
          <p className="mt-2 text-sm text-slate-500">Active laboratory requests in the workflow.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-2xl font-semibold text-slate-900">{orders.filter((order: any) => order.status === "COMPLETED" || order.status === "VERIFIED").length}</p>
          <p className="mt-1 text-sm font-medium text-slate-700">Completed</p>
          <p className="mt-2 text-sm text-slate-500">Orders with a completed or verified result.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
            <ClipboardList className="h-5 w-5" />
          </div>
          <p className="text-2xl font-semibold text-slate-900">{categories.length}</p>
          <p className="mt-1 text-sm font-medium text-slate-700">Categories</p>
          <p className="mt-2 text-sm text-slate-500">Configured lab categories and test suites.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-900">Lab orders</h2>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              placeholder="Search order number or notes"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none ring-0"
            />
          </div>
        </div>

        {loadingOrders ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Loading laboratory orders…</div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            No laboratory orders yet. Create the first order to begin tracking samples.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order: any) => (
              <div key={order.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{order.orderNumber}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{order.priority}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{order.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {order.patient?.user?.firstName} {order.patient?.user?.lastName} • {order.laboratoryCategory?.name} / {order.laboratoryTest?.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{order.clinicalNotes || "No clinical notes provided."}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => openEditModal(order)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">Edit</button>
                    <button onClick={() => openResultModal(order)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">Result</button>
                    {order.result?.status && order.result.status !== "VERIFIED" ? (
                      <button onClick={() => verifyResult(order)} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700">Verify</button>
                    ) : null}
                    <button onClick={() => deleteOrder(order)} className="rounded-lg border border-rose-200 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 ? (
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-lg border border-slate-200 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
              <button disabled={page >= pagination.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-slate-200 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
            </div>
          </div>
        ) : null}
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{editingOrder ? "Edit lab order" : "Create lab order"}</h3>
                <p className="text-sm text-slate-500">Select the patient, appointment, and diagnostic test to save a new order.</p>
              </div>
              <button onClick={() => { setShowModal(false); resetForms(); }} className="text-sm text-slate-500">Close</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-slate-700">Patient</span>
                  <select value={form.patientId} onChange={(event) => setForm((current) => ({ ...current, patientId: event.target.value, appointmentId: "", medicalRecordId: "" }))} className="w-full rounded-lg border border-slate-200 px-3 py-2" required>
                    <option value="">Select a patient</option>
                    {patients.map((patient: any) => (
                      <option key={patient.id} value={patient.id}>{patient.user?.firstName} {patient.user?.lastName}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-slate-700">Doctor</span>
                  <select value={form.doctorId} onChange={(event) => setForm((current) => ({ ...current, doctorId: event.target.value, appointmentId: "", medicalRecordId: "" }))} className="w-full rounded-lg border border-slate-200 px-3 py-2" required>
                    <option value="">Select a doctor</option>
                    {doctors.map((doctor: any) => (
                      <option key={doctor.id} value={doctor.id}>{doctor.user?.firstName} {doctor.user?.lastName}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-slate-700">Appointment</span>
                  <select value={form.appointmentId} onChange={(event) => setForm((current) => ({ ...current, appointmentId: event.target.value, medicalRecordId: "" }))} className="w-full rounded-lg border border-slate-200 px-3 py-2" required>
                    <option value="">Select an appointment</option>
                    {matchingAppointments.map((appointment: any) => (
                      <option key={appointment.id} value={appointment.id}>{appointment.appointmentNumber} • {appointment.appointmentDate?.slice(0, 10)}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-slate-700">Medical record</span>
                  <select value={form.medicalRecordId} onChange={(event) => setForm((current) => ({ ...current, medicalRecordId: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2" required>
                    <option value="">Select a medical record</option>
                    {matchingMedicalRecords.map((record: any) => (
                      <option key={record.id} value={record.id}>{record.medicalRecordNumber}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-slate-700">Category</span>
                  <select value={form.laboratoryCategoryId} onChange={(event) => setForm((current) => ({ ...current, laboratoryCategoryId: event.target.value, laboratoryTestId: "" }))} className="w-full rounded-lg border border-slate-200 px-3 py-2" required>
                    <option value="">Select a category</option>
                    {categories.map((category: any) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-slate-700">Test</span>
                  <select value={form.laboratoryTestId} onChange={(event) => setForm((current) => ({ ...current, laboratoryTestId: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2" required>
                    <option value="">Select a test</option>
                    {filteredTests.map((test: any) => (
                      <option key={test.id} value={test.id}>{test.name}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-slate-700">Priority</span>
                  <select value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2">
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-slate-700">Status</span>
                  <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2">
                    <option value="PENDING">Pending</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COLLECTED">Collected</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="VERIFIED">Verified</option>
                  </select>
                </label>
              </div>
              <label className="block space-y-1 text-sm">
                <span className="font-medium text-slate-700">Clinical notes</span>
                <textarea value={form.clinicalNotes} onChange={(event) => setForm((current) => ({ ...current, clinicalNotes: event.target.value }))} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Add clinical details or ordering reason" />
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setShowModal(false); resetForms(); }} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting ? "Saving…" : editingOrder ? "Update order" : "Create order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showResultModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Laboratory result</h3>
                <p className="text-sm text-slate-500">Enter the latest findings for {selectedOrder?.orderNumber}.</p>
              </div>
              <button onClick={() => { setShowResultModal(false); setSelectedOrder(null); }} className="text-sm text-slate-500">Close</button>
            </div>
            <form onSubmit={handleResultSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-slate-700">Result value</span>
                  <input value={resultForm.resultValue} onChange={(event) => setResultForm((current) => ({ ...current, resultValue: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-slate-700">Reference range</span>
                  <input value={resultForm.referenceRange} onChange={(event) => setResultForm((current) => ({ ...current, referenceRange: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-medium text-slate-700">Status</span>
                  <select value={resultForm.status} onChange={(event) => setResultForm((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2">
                    <option value="ENTERED">Entered</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </label>
              </div>
              <label className="block space-y-1 text-sm">
                <span className="font-medium text-slate-700">Interpretation</span>
                <textarea value={resultForm.interpretation} onChange={(event) => setResultForm((current) => ({ ...current, interpretation: event.target.value }))} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="font-medium text-slate-700">Technician notes</span>
                <textarea value={resultForm.technicianNotes} onChange={(event) => setResultForm((current) => ({ ...current, technicianNotes: event.target.value }))} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setShowResultModal(false); setSelectedOrder(null); }} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">Cancel</button>
                <button type="submit" disabled={resultSubmitting} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60">
                  {resultSubmitting ? "Saving…" : "Save result"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
