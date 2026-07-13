import { Prisma, PrismaClient } from "@prisma/client";

export class MedicalRecordRepository {
  constructor(private prisma: PrismaClient) {}

  async list(params: {
    skip: number;
    take: number;
    where: Prisma.MedicalRecordWhereInput;
    orderBy?: Prisma.MedicalRecordOrderByWithRelationInput;
  }) {
    const [records, total] = await Promise.all([
      this.prisma.medicalRecord.findMany({
        where: params.where,
        include: {
          patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
          doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
          appointment: true,
        },
        skip: params.skip,
        take: params.take,
        orderBy: params.orderBy ?? { visitDate: "desc" },
      }),
      this.prisma.medicalRecord.count({ where: params.where }),
    ]);

    return { records, total };
  }

  async findById(id: string) {
    return this.prisma.medicalRecord.findFirst({
      where: { id, deletedAt: null },
      include: {
        patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
        doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
        appointment: true,
      },
    });
  }

  async create(data: Prisma.MedicalRecordCreateInput) {
    return this.prisma.medicalRecord.create({
      data,
      include: {
        patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
        doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
        appointment: true,
      },
    });
  }

  async update(id: string, data: Prisma.MedicalRecordUpdateInput) {
    return this.prisma.medicalRecord.update({
      where: { id },
      data,
      include: {
        patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
        doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
        appointment: true,
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.medicalRecord.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
