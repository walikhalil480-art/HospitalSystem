import { Prisma, PrismaClient } from "@prisma/client";
export declare class DepartmentRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(params: {
        skip: number;
        take: number;
        where: Prisma.DepartmentWhereInput;
        orderBy?: Prisma.DepartmentOrderByWithRelationInput;
    }): Promise<{
        departments: ({
            _count: {
                staff: number;
            };
            staff: {
                user: {
                    id: string;
                    email: string;
                    firstName: string;
                    lastName: string;
                };
                id: string;
            }[];
        } & {
            code: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            description: string | null;
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
        _count: {
            staff: number;
        };
        staff: {
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            id: string;
        }[];
    } & {
        code: string | null;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        description: string | null;
    }) | null>;
    create(data: Prisma.DepartmentCreateInput): Promise<{
        _count: {
            staff: number;
        };
    } & {
        code: string | null;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        description: string | null;
    }>;
    update(id: string, data: Prisma.DepartmentUpdateInput): Promise<{
        _count: {
            staff: number;
        };
    } & {
        code: string | null;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        description: string | null;
    }>;
    deactivate(id: string, actorId?: string): Promise<{
        code: string | null;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        description: string | null;
    }>;
    assignDoctor(departmentId: string, doctorId: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        department: {
            code: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            description: string | null;
        } | null;
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        departmentId: string | null;
        userId: string;
        staffNumber: string;
        specialization: string | null;
        qualifications: string | null;
        licenseNumber: string | null;
        schedule: string | null;
        consultationFee: number | null;
        bio: string | null;
        employmentStatus: import(".prisma/client").$Enums.EmploymentStatus;
        availability: import(".prisma/client").$Enums.AvailabilityStatus;
        photoUrl: string | null;
    }>;
}
//# sourceMappingURL=department.repository.d.ts.map