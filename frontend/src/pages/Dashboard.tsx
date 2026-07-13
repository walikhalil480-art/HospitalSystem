import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import {
  Users,
  UserRound,
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalNurses: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointmentsThisMonth: number;
  revenueThisMonth: number;
  revenueGrowthPercent: number;
}

interface AppointmentStatus {
  status: string;
  count: number;
}

interface DashboardData {
  stats: DashboardStats;
  appointmentsByStatus: AppointmentStatus[];
  recentPatients: any[];
  upcomingAppointments: any[];
  medicalRecordsOverview?: {
    recentMedicalRecords: any[];
    followUpPatients: any[];
    openRecords: number;
    closedRecords: number;
    diagnosesByDepartment: Array<{ department: string; count: number }>;
  };
}

const PIE_COLORS: Record<string, string> = {
  SCHEDULED: "#3b82f6",
  CONFIRMED: "#22c55e",
  IN_PROGRESS: "#f59e0b",
  COMPLETED: "#8b5cf6",
  CANCELLED: "#ef4444",
  NO_SHOW: "#6b7280",
};

const mockMonthlyRevenue = [
  { month: "Jan", revenue: 48000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 61000 },
  { month: "Apr", revenue: 55000 },
  { month: "May", revenue: 70000 },
  { month: "Jun", revenue: 66000 },
  { month: "Jul", revenue: 75000 },
];

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/stats");
      return res.data.data;
    },
    refetchInterval: 60_000, // refresh every minute
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
        <p className="font-medium">Failed to load dashboard data</p>
        <p className="text-sm mt-1">Check your API connection</p>
      </div>
    );
  }

  const { stats, appointmentsByStatus, recentPatients, upcomingAppointments, medicalRecordsOverview } = data;

  const statCards = [
    {
      label: "Total Patients",
      value: stats.totalPatients.toLocaleString(),
      icon: Users,
      color: "bg-blue-500",
      light: "bg-blue-50 text-blue-700",
      change: "+12% this month",
      up: true,
    },
    {
      label: "Total Doctors",
      value: stats.totalDoctors.toLocaleString(),
      icon: UserRound,
      color: "bg-emerald-500",
      light: "bg-emerald-50 text-emerald-700",
      change: `+${stats.totalNurses} nurses`,
      up: true,
    },
    {
      label: "Today's Appointments",
      value: stats.todayAppointments.toLocaleString(),
      icon: CalendarCheck,
      color: "bg-violet-500",
      light: "bg-violet-50 text-violet-700",
      change: `${stats.pendingAppointments} pending`,
      up: false,
    },
    {
      label: "Revenue (This Month)",
      value: `$${stats.revenueThisMonth.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-amber-500",
      light: "bg-amber-50 text-amber-700",
      change: `${stats.revenueGrowthPercent >= 0 ? "+" : ""}${stats.revenueGrowthPercent}% vs last month`,
      up: stats.revenueGrowthPercent >= 0,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Real-time overview of hospital operations
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${card.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${card.light}`}>
                  {card.up ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
                  {card.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-sm text-slate-500 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Area Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockMonthlyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: any) => [`$${Number(value ?? 0).toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Appointments by Status Pie */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Appointment Status</h3>
          {appointmentsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={appointmentsByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {appointmentsByStatus.map((entry) => (
                    <Cell key={entry.status} fill={PIE_COLORS[entry.status] || "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any, name: any) => [Number(value ?? 0), String(name)]} contentStyle={{ borderRadius: 8, border: "none" }} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
              No appointment data yet
            </div>
          )}
        </div>
      </div>

      {/* EMR Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">EMR Snapshot</h3>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-sm text-slate-500">Open Records</p>
              <p className="text-2xl font-semibold text-slate-900">{medicalRecordsOverview?.openRecords ?? 0}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-sm text-slate-500">Closed Records</p>
              <p className="text-2xl font-semibold text-slate-900">{medicalRecordsOverview?.closedRecords ?? 0}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {(medicalRecordsOverview?.recentMedicalRecords ?? []).slice(0, 4).map((record: any) => (
              <div key={record.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <div>
                  <p className="font-medium text-slate-800">{record.medicalRecordNumber}</p>
                  <p className="text-slate-500">{record.patient?.user?.firstName} {record.patient?.user?.lastName}</p>
                </div>
                <span className="text-xs text-slate-500">{record.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">Follow-up & Diagnoses</h3>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-3">
            {(medicalRecordsOverview?.followUpPatients ?? []).slice(0, 4).map((record: any) => (
              <div key={record.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <div>
                  <p className="font-medium text-slate-800">{record.patient?.user?.firstName} {record.patient?.user?.lastName}</p>
                  <p className="text-slate-500">Follow-up: {new Date(record.followUpDate).toLocaleDateString()}</p>
                </div>
                <span className="text-xs text-slate-500">{record.status}</span>
              </div>
            ))}
            {(medicalRecordsOverview?.diagnosesByDepartment ?? []).slice(0, 4).map((item) => (
              <div key={item.department} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <span className="text-slate-700">{item.department}</span>
                <span className="font-medium text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">Upcoming Appointments</h3>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          {upcomingAppointments.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No upcoming appointments</p>
          ) : (
            <div className="space-y-2">
              {upcomingAppointments.map((appt: any) => (
                <div key={appt.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
                    {appt.patient?.user?.firstName?.[0]}{appt.patient?.user?.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {appt.patient?.user?.firstName} {appt.patient?.user?.lastName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      Dr. {appt.doctor?.user?.firstName} {appt.doctor?.user?.lastName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-slate-700">
                      {new Date(appt.appointmentDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">Recent Patients</h3>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          {recentPatients.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No patients registered yet</p>
          ) : (
            <div className="space-y-2">
              {recentPatients.map((patient: any) => (
                <div key={patient.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-sm shrink-0">
                    {patient.user?.firstName?.[0]}{patient.user?.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {patient.user?.firstName} {patient.user?.lastName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{patient.user?.email}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
