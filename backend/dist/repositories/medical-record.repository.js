"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordRepository = void 0;
class MedicalRecordRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(params) {
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
    async findById(id) {
        return this.prisma.medicalRecord.findFirst({
            where: { id, deletedAt: null },
            include: {
                patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
                doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
                appointment: true,
            },
        });
    }
    async create(data) {
        return this.prisma.medicalRecord.create({
            data,
            include: {
                patient: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } } },
                doctor: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true } },
                appointment: true,
            },
        });
    }
    async update(id, data) {
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
    async softDelete(id) {
        return this.prisma.medicalRecord.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
exports.MedicalRecordRepository = MedicalRecordRepository;
//# sourceMappingURL=medical-record.repository.js.map