import { Prisma, PrismaClient } from "@prisma/client";

export class LaboratoryRepository {
  constructor(private prisma: PrismaClient) {}

  async listOrders(params: { skip: number; take: number; where: Prisma.LaboratoryOrderWhereInput; orderBy?: Prisma.LaboratoryOrderOrderByWithRelationInput }) {
    const [orders, total] = await Promise.all([
      this.prisma.laboratoryOrder.findMany({
        where: params.where,
        include: {
          patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
          doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
          appointment: true,
          medicalRecord: true,
          laboratoryCategory: true,
          laboratoryTest: true,
          result: true,
        },
        skip: params.skip,
        take: params.take,
        orderBy: params.orderBy ?? { orderedDate: "desc" },
      }),
      this.prisma.laboratoryOrder.count({ where: params.where }),
    ]);

    return { orders, total };
  }

  async findOrderById(id: string) {
    return this.prisma.laboratoryOrder.findFirst({
      where: { id, deletedAt: null },
      include: {
        patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
        doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
        appointment: true,
        medicalRecord: true,
        laboratoryCategory: true,
        laboratoryTest: true,
        result: true,
      },
    });
  }

  async createOrder(data: Prisma.LaboratoryOrderCreateInput) {
    return this.prisma.laboratoryOrder.create({
      data,
      include: {
        patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
        doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
        appointment: true,
        medicalRecord: true,
        laboratoryCategory: true,
        laboratoryTest: true,
        result: true,
      },
    });
  }

  async updateOrder(id: string, data: Prisma.LaboratoryOrderUpdateInput) {
    return this.prisma.laboratoryOrder.update({
      where: { id },
      data,
      include: {
        patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
        doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
        appointment: true,
        medicalRecord: true,
        laboratoryCategory: true,
        laboratoryTest: true,
        result: true,
      },
    });
  }

  async softDeleteOrder(id: string) {
    return this.prisma.laboratoryOrder.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async listCategories(params: { skip: number; take: number; where: Prisma.LaboratoryCategoryWhereInput; orderBy?: Prisma.LaboratoryCategoryOrderByWithRelationInput }) {
    const [categories, total] = await Promise.all([
      this.prisma.laboratoryCategory.findMany({ where: params.where, skip: params.skip, take: params.take, orderBy: params.orderBy ?? { name: "asc" } }),
      this.prisma.laboratoryCategory.count({ where: params.where }),
    ]);
    return { categories, total };
  }

  async createCategory(data: Prisma.LaboratoryCategoryCreateInput) {
    return this.prisma.laboratoryCategory.create({ data });
  }

  async listTests(params: { skip: number; take: number; where: Prisma.LaboratoryTestWhereInput; orderBy?: Prisma.LaboratoryTestOrderByWithRelationInput }) {
    const [tests, total] = await Promise.all([
      this.prisma.laboratoryTest.findMany({ where: params.where, include: { laboratoryCategory: true }, skip: params.skip, take: params.take, orderBy: params.orderBy ?? { name: "asc" } }),
      this.prisma.laboratoryTest.count({ where: params.where }),
    ]);
    return { tests, total };
  }

  async createTest(data: Prisma.LaboratoryTestCreateInput) {
    return this.prisma.laboratoryTest.create({ data, include: { laboratoryCategory: true } });
  }

  async findResultByOrderId(orderId: string) {
    return this.prisma.laboratoryResult.findFirst({ where: { laboratoryOrderId: orderId, deletedAt: null } });
  }

  async createResult(data: Prisma.LaboratoryResultCreateInput) {
    return this.prisma.laboratoryResult.create({ data });
  }

  async updateResult(id: string, data: Prisma.LaboratoryResultUpdateInput) {
    return this.prisma.laboratoryResult.update({ where: { id }, data });
  }
}
