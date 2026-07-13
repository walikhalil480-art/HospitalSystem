"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRepository = void 0;
const client_1 = require("@prisma/client");
class AppointmentRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(params) {
        const [appointments, total] = await Promise.all([
            this.prisma.appointment.findMany({
                where: params.where,
                include: {
                    patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
                    doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
                    department: true,
                },
                skip: params.skip,
                take: params.take,
                orderBy: params.orderBy ?? { appointmentDate: "asc" },
            }),
            this.prisma.appointment.count({ where: params.where }),
        ]);
        return { appointments, total };
    }
    async findById(id) {
        return this.prisma.appointment.findFirst({
            where: { id, deletedAt: null },
            include: {
                patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
                doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
                department: true,
            },
        });
    }
    async create(data) {
        return this.prisma.appointment.create({
            data,
            include: {
                patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
                doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
                department: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.appointment.update({
            where: { id },
            data,
            include: {
                patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
                doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
                department: true,
            },
        });
    }
    async cancel(id, actorId) {
        return this.prisma.appointment.update({
            where: { id },
            data: {
                status: client_1.AppointmentStatus.CANCELLED,
                ...(actorId ? { updatedByUser: { connect: { id: actorId } } } : {}),
            },
            include: {
                patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
                doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
                department: true,
            },
        });
    }
    async delete(id) {
        return this.prisma.appointment.delete({ where: { id } });
    }
    async count(where) {
        return this.prisma.appointment.count({ where });
    }
    async getTodayStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [todayAppointments, upcomingAppointments, completed, cancelled, noShow] = await Promise.all([
            this.prisma.appointment.count({ where: { appointmentDate: { gte: today, lt: tomorrow }, deletedAt: null } }),
            this.prisma.appointment.count({ where: { appointmentDate: { gte: new Date() }, deletedAt: null, status: { in: [client_1.AppointmentStatus.SCHEDULED, client_1.AppointmentStatus.CONFIRMED] } } }),
            this.prisma.appointment.count({ where: { status: client_1.AppointmentStatus.COMPLETED, deletedAt: null } }),
            this.prisma.appointment.count({ where: { status: client_1.AppointmentStatus.CANCELLED, deletedAt: null } }),
            this.prisma.appointment.count({ where: { status: client_1.AppointmentStatus.NO_SHOW, deletedAt: null } }),
        ]);
        return { todayAppointments, upcomingAppointments, completed, cancelled, noShow };
    }
}
exports.AppointmentRepository = AppointmentRepository;
//# sourceMappingURL=appointment.repository.js.map