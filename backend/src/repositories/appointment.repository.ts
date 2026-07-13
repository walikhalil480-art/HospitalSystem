import { Prisma, PrismaClient, AppointmentStatus } from "@prisma/client";

export class AppointmentRepository {
  constructor(private prisma: PrismaClient) {}

  async list(params: {
    skip: number;
    take: number;
    where: Prisma.AppointmentWhereInput;
    orderBy?: Prisma.AppointmentOrderByWithRelationInput;
  }) {
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

  async findById(id: string) {
    return this.prisma.appointment.findFirst({
      where: { id, deletedAt: null },
      include: {
        patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
        doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
        department: true,
      },
    });
  }

  async create(data: Prisma.AppointmentCreateInput) {
    return this.prisma.appointment.create({
      data,
      include: {
        patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
        doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
        department: true,
      },
    });
  }

  async update(id: string, data: Prisma.AppointmentUpdateInput) {
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

  async cancel(id: string, actorId?: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CANCELLED,
        ...(actorId ? { updatedByUser: { connect: { id: actorId } } } : {}),
      },
      include: {
        patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
        doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
        department: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.appointment.delete({ where: { id } });
  }

  async count(where: Prisma.AppointmentWhereInput) {
    return this.prisma.appointment.count({ where });
  }

  async getTodayStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayAppointments, upcomingAppointments, completed, cancelled, noShow] = await Promise.all([
      this.prisma.appointment.count({ where: { appointmentDate: { gte: today, lt: tomorrow }, deletedAt: null } }),
      this.prisma.appointment.count({ where: { appointmentDate: { gte: new Date() }, deletedAt: null, status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] } } }),
      this.prisma.appointment.count({ where: { status: AppointmentStatus.COMPLETED, deletedAt: null } }),
      this.prisma.appointment.count({ where: { status: AppointmentStatus.CANCELLED, deletedAt: null } }),
      this.prisma.appointment.count({ where: { status: AppointmentStatus.NO_SHOW, deletedAt: null } }),
    ]);

    return { todayAppointments, upcomingAppointments, completed, cancelled, noShow };
  }
}
