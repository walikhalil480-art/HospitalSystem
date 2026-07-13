import { Package, Pill, ShieldCheck } from "lucide-react";

const highlights = [
  { title: "Inventory", value: "184 items", description: "Stock is healthy across critical medications." },
  { title: "Dispensing", value: "27 today", description: "Pending fulfillment for inpatients and outpatients." },
  { title: "Compliance", value: "98%", description: "Medication safety checks are current and complete." },
];

export default function PharmacyPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pharmacy</h1>
          <p className="text-sm text-slate-500">Track inventory, prescriptions, and dispensing workflows.</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700">
          <Pill className="mr-2 h-4 w-4" />
          New medication request
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <Package className="h-5 w-5" />
            </div>
            <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-700">{item.title}</p>
            <p className="mt-2 text-sm text-slate-500">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-slate-900">Medication safety</h2>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          The pharmacy queue is currently stable. Expiring stock and allergy checks are monitored daily.
        </p>
      </div>
    </div>
  );
}
