import { Prisma, PrismaClient } from "@prisma/client";
type PrismaClientLike = PrismaClient | Prisma.TransactionClient;
export declare class DoctorRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(params: {
        skip: number;
        take: number;
        where: Prisma.StaffWhereInput;
        orderBy?: Prisma.StaffOrderByWithRelationInput;
    }): Promise<{
        doctors: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.Role;
                phone: string | null;
                isActive: boolean;
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
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            phone: string | null;
            isActive: boolean;
        };
        appointments: {
            status: import(".prisma/client").$Enums.AppointmentStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            appointmentNumber: string;
            patientId: string;
            doctorId: string;
            departmentId: string;
            appointmentDate: Date;
            startTime: string;
            endTime: string;
            durationMinutes: number;
            consultationType: import(".prisma/client").$Enums.ConsultationType;
            priority: import(".prisma/client").$Enums.AppointmentPriority;
            reasonForVisit: string | null;
            symptoms: string | null;
            notes: string | null;
            queueNumber: number;
        }[];
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
    }) | null>;
    create(data: Prisma.StaffCreateInput, tx?: PrismaClientLike): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            phone: string | null;
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
    update(id: string, data: Prisma.StaffUpdateInput, tx?: PrismaClientLike): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            phone: string | null;
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
    deactivate(id: string, actorId?: string): Promise<{
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
export {};
//# sourceMappingURL=doctor.repository.d.ts.map