import { Prisma, PrismaClient } from "@prisma/client";

export class DepartmentRepository {
  constructor(private prisma: PrismaClient) {}

  async list(params: {
    skip: number;
    take: number;
    where: Prisma.DepartmentWhereInput;
    orderBy?: Prisma.DepartmentOrderByWithRelationInput;
  }) {
    const [departments, total] = await Promise.all([
      this.prisma.department.findMany({
        where: params.where,
        include: {
          _count: { select: { staff: true } },
          staff: {
            select: {
              id: true,
              user: { select: { id: true, firstName: true, lastName: true, email: true } },
            },
          },
        },
        skip: params.skip,
        take: params.take,
        orderBy: params.orderBy ?? { name: "asc" },
      }),
      this.prisma.department.count({ where: params.where }),
    ]);

    return { departments, total };
  }

  async findById(id: string) {
    return this.prisma.department.findFirst({
      where: { id, deletedAt: null },
      include: {
        _count: { select: { staff: true } },
        staff: {
          select: {
            id: true,
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });
  }

  async create(data: Prisma.DepartmentCreateInput) {
    return this.prisma.department.create({
      data,
      include: {
        _count: { select: { staff: true } },
      },
    });
  }

  async update(id: string, data: Prisma.DepartmentUpdateInput) {
    return this.prisma.department.update({
      where: { id },
      data,
      include: {
        _count: { select: { staff: true } },
      },
    });
  }

  async deactivate(id: string, actorId?: string) {
    return this.prisma.department.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date(), updatedBy: actorId },
    });
  }

  async assignDoctor(departmentId: string, doctorId: string) {
    return this.prisma.staff.update({
      where: { id: doctorId },
      data: { departmentId },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true },
    });
  }
}
