import { CreditCard, ReceiptText, TrendingUp } from "lucide-react";

const metrics = [
  { title: "Unpaid invoices", value: "42", description: "Awaiting payment before close of day." },
  { title: "Collected today", value: "$18,420", description: "Payments posted from outpatient collections." },
  { title: "Outstanding claims", value: "9", description: "Insurance claims still pending review." },
];

export default function BillingPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
          <p className="text-sm text-slate-500">Review invoices, payments, and revenue follow-up.</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700">
          <ReceiptText className="mr-2 h-4 w-4" />
          Generate invoice
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <CreditCard className="h-5 w-5" />
            </div>
            <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-700">{item.title}</p>
            <p className="mt-2 text-sm text-slate-500">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900">Revenue outlook</h2>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Monthly collections are tracking ahead of plan. Follow-up reminders are scheduled for the next billing cycle.
        </p>
      </div>
    </div>
  );
}
