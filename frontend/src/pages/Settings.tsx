import { Settings as SettingsIcon, ShieldCheck, BellRing, SlidersHorizontal } from "lucide-react";

const sections = [
  { title: "Security", description: "MFA and access controls remain active for privileged users.", icon: ShieldCheck },
  { title: "Notifications", description: "Appointment, billing, and EMR alerts are configured for the care team.", icon: BellRing },
  { title: "Preferences", description: "Dashboard layout and display defaults are ready for daily operations.", icon: SlidersHorizontal },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage platform configuration, alerts, and access controls.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{section.description}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-slate-700" />
          <h2 className="text-lg font-semibold text-slate-900">System overview</h2>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          The application configuration is synced and ready for daily use. Review these areas regularly to keep operations consistent.
        </p>
      </div>
    </div>
  );
}
