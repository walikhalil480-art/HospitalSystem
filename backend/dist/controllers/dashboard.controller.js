"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const prisma_1 = require("../lib/prisma");
const getDashboardStats = async (req, res, next) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        const [totalPatients, totalDoctors, totalNurses, todayAppointments, pendingAppointments, completedAppointmentsThisMonth, totalRevenueThisMonth, totalRevenueLastMonth, recentPatients, upcomingAppointments, appointmentsByStatus, recentMedicalRecords, followUpPatients, openMedicalRecords, closedMedicalRecords, medicalRecordAnalytics,] = await Promise.all([
            prisma_1.prisma.patient.count({ where: { deletedAt: null } }),
            prisma_1.prisma.staff.count({ where: { deletedAt: null, user: { role: "DOCTOR" } } }),
            prisma_1.prisma.staff.count({ where: { deletedAt: null, user: { role: "NURSE" } } }),
            prisma_1.prisma.appointment.count({
                where: { appointmentDate: { gte: startOfDay, lte: endOfDay }, deletedAt: null },
            }),
            prisma_1.prisma.appointment.count({
                where: { status: "SCHEDULED", deletedAt: null },
            }),
            prisma_1.prisma.appointment.count({
                where: { status: "COMPLETED", appointmentDate: { gte: startOfMonth }, deletedAt: null },
            }),
            prisma_1.prisma.invoice.aggregate({
                _sum: { amount: true },
                where: { status: "PAID", createdAt: { gte: startOfMonth }, deletedAt: null },
            }),
            prisma_1.prisma.invoice.aggregate({
                _sum: { amount: true },
                where: { status: "PAID", createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }, deletedAt: null },
            }),
            prisma_1.prisma.patient.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                where: { deletedAt: null },
                include: {
                    user: { select: { firstName: true, lastName: true, email: true } },
                },
            }),
            prisma_1.prisma.appointment.findMany({
                take: 5,
                where: { appointmentDate: { gte: new Date() }, status: { in: ["SCHEDULED", "CONFIRMED"] }, deletedAt: null },
                orderBy: { appointmentDate: "asc" },
                include: {
                    patient: { include: { user: { select: { firstName: true, lastName: true } } } },
                    doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
                },
            }),
            prisma_1.prisma.appointment.groupBy({
                by: ["status"],
                _count: { id: true },
                where: { deletedAt: null },
            }),
            prisma_1.prisma.medicalRecord.findMany({
                take: 5,
                where: { deletedAt: null },
                orderBy: { createdAt: "desc" },
                include: {
                    patient: { include: { user: { select: { firstName: true, lastName: true } } } },
                    doctor: { include: { user: { select: { firstName: true, lastName: true } }, department: true } },
                },
            }),
            prisma_1.prisma.medicalRecord.findMany({
                take: 5,
                where: {
                    deletedAt: null,
                    followUpDate: { gte: new Date(), lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
                },
                orderBy: { followUpDate: "asc" },
                include: {
                    patient: { include: { user: { select: { firstName: true, lastName: true } } } },
                },
            }),
            prisma_1.prisma.medicalRecord.count({ where: { deletedAt: null, status: "OPEN" } }),
            prisma_1.prisma.medicalRecord.count({ where: { deletedAt: null, status: "CLOSED" } }),
            prisma_1.prisma.medicalRecord.findMany({
                where: { deletedAt: null, diagnosis: { not: null } },
                include: {
                    doctor: { include: { department: true } },
                },
            }),
        ]);
        const thisMonthRevenue = totalRevenueThisMonth._sum.amount ?? 0;
        const lastMonthRevenue = totalRevenueLastMonth._sum.amount ?? 0;
        const revenueGrowth = lastMonthRevenue > 0
            ? (((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
            : "0";
        const diagnosesByDepartment = medicalRecordAnalytics.reduce((acc, record) => {
            const departmentName = record.doctor?.department?.name ?? "Unassigned";
            const diagnosis = record.diagnosis?.trim();
            if (!diagnosis)
                return acc;
            acc[departmentName] = (acc[departmentName] ?? 0) + 1;
            return acc;
        }, {});
        res.status(200).json({
            success: true,
            message: "Dashboard statistics retrieved",
            data: {
                stats: {
                    totalPatients,
                    totalDoctors,
                    totalNurses,
                    todayAppointments,
                    pendingAppointments,
                    completedAppointmentsThisMonth,
                    revenueThisMonth: thisMonthRevenue,
                    revenueGrowthPercent: parseFloat(revenueGrowth),
                },
                appointmentsByStatus: appointmentsByStatus.map((s) => ({
                    status: s.status,
                    count: s._count.id,
                })),
                recentPatients,
                upcomingAppointments,
                medicalRecordsOverview: {
                    recentMedicalRecords,
                    followUpPatients,
                    openRecords: openMedicalRecords,
                    closedRecords: closedMedicalRecords,
                    diagnosesByDepartment: Object.entries(diagnosesByDepartment).map(([department, count]) => ({ department, count })),
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=dashboard.controller.js.map