"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentRepository = void 0;
class DepartmentRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(params) {
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
    async findById(id) {
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
    async create(data) {
        return this.prisma.department.create({
            data,
            include: {
                _count: { select: { staff: true } },
            },
        });
    }
    async update(id, data) {
        return this.prisma.department.update({
            where: { id },
            data,
            include: {
                _count: { select: { staff: true } },
            },
        });
    }
    async deactivate(id, actorId) {
        return this.prisma.department.update({
            where: { id },
            data: { isActive: false, deletedAt: new Date(), updatedBy: actorId },
        });
    }
    async assignDoctor(departmentId, doctorId) {
        return this.prisma.staff.update({
            where: { id: doctorId },
            data: { departmentId },
            include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, department: true },
        });
    }
}
exports.DepartmentRepository = DepartmentRepository;
//# sourceMappingURL=department.repository.js.map