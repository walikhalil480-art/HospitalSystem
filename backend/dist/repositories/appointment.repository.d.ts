import { Prisma, PrismaClient } from "@prisma/client";
export declare class AppointmentRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(params: {
        skip: number;
        take: number;
        where: Prisma.AppointmentWhereInput;
        orderBy?: Prisma.AppointmentOrderByWithRelationInput;
    }): Promise<{
        appointments: ({
            patient: {
                user: {
                    id: string;
                    email: string;
                    firstName: string;
                    lastName: string;
                    phone: string | null;
                };
            } & {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                userId: string;
                patientNumber: string;
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                bloodGroup: string | null;
                address: string | null;
                emergencyContact: string | null;
                emergencyPhone: string | null;
                allergies: string | null;
                insuranceDetails: string | null;
                medicalNotes: string | null;
            };
            doctor: {
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
            };
        } & {
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
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
        patient: {
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                phone: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            userId: string;
            patientNumber: string;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            bloodGroup: string | null;
            address: string | null;
            emergencyContact: string | null;
            emergencyPhone: string | null;
            allergies: string | null;
            insuranceDetails: string | null;
            medicalNotes: string | null;
        };
        doctor: {
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
        };
    } & {
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
    }) | null>;
    create(data: Prisma.AppointmentCreateInput): Promise<{
        patient: {
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                phone: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            userId: string;
            patientNumber: string;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            bloodGroup: string | null;
            address: string | null;
            emergencyContact: string | null;
            emergencyPhone: string | null;
            allergies: string | null;
            insuranceDetails: string | null;
            medicalNotes: string | null;
        };
        doctor: {
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
        };
    } & {
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
    }>;
    update(id: string, data: Prisma.AppointmentUpdateInput): Promise<{
        patient: {
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                phone: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            userId: string;
            patientNumber: string;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            bloodGroup: string | null;
            address: string | null;
            emergencyContact: string | null;
            emergencyPhone: string | null;
            allergies: string | null;
            insuranceDetails: string | null;
            medicalNotes: string | null;
        };
        doctor: {
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
        };
    } & {
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
    }>;
    cancel(id: string, actorId?: string): Promise<{
        patient: {
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                phone: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            userId: string;
            patientNumber: string;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            bloodGroup: string | null;
            address: string | null;
            emergencyContact: string | null;
            emergencyPhone: string | null;
            allergies: string | null;
            insuranceDetails: string | null;
            medicalNotes: string | null;
        };
        doctor: {
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
        };
    } & {
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
    }>;
    delete(id: string): Promise<{
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
    }>;
    count(where: Prisma.AppointmentWhereInput): Promise<number>;
    getTodayStats(): Promise<{
        todayAppointments: number;
        upcomingAppointments: number;
        completed: number;
        cancelled: number;
        noShow: number;
    }>;
}
//# sourceMappingURL=appointment.repository.d.ts.map