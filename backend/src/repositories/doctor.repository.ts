import { Prisma, PrismaClient } from "@prisma/client";

type PrismaClientLike = PrismaClient | Prisma.TransactionClient;

export class DoctorRepository {
  constructor(private prisma: PrismaClient) {}

  async list(params: {
    skip: number;
    take: number;
    where: Prisma.StaffWhereInput;
    orderBy?: Prisma.StaffOrderByWithRelationInput;
  }) {
    const [doctors, total] = await Promise.all([
      this.prisma.staff.findMany({
        where: params.where,
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, isActive: true },
          },
          department: true,
        },
        skip: params.skip,
        take: params.take,
        orderBy: params.orderBy ?? { createdAt: "desc" },
      }),
      this.prisma.staff.count({ where: params.where }),
    ]);

    return { doctors, total };
  }

  async findById(id: string) {
    return this.prisma.staff.findFirst({
      where: { id, deletedAt: null },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, isActive: true } },
        department: true,
        appointments: { take: 5, orderBy: { appointmentDate: "desc" } },
      },
    });
  }

  async create(data: Prisma.StaffCreateInput, tx?: PrismaClientLike) {
    const client = tx ?? this.prisma;
    return client.staff.create({
      data,
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true } },
        department: true,
      },
    });
  }

  async update(id: string, data: Prisma.StaffUpdateInput, tx?: PrismaClientLike) {
    const client = tx ?? this.prisma;
    return client.staff.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true } },
        department: true,
      },
    });
  }

  async deactivate(id: string, actorId?: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: (await tx.staff.findUniqueOrThrow({ where: { id } })).userId },
        data: { isActive: false, deletedAt: new Date(), updatedBy: actorId },
      });
      return tx.staff.update({
        where: { id },
        data: { deletedAt: new Date(), updatedBy: actorId },
      });
    });
  }
}
