import { AppointmentStatus, ConsultationType, AppointmentPriority } from "@prisma/client";
interface AppointmentListParams {
    page?: number;
    limit?: number;
    search?: string;
    doctorId?: string;
    patientId?: string;
    departmentId?: string;
    date?: string;
    status?: AppointmentStatus;
    today?: boolean;
}
export declare const listAppointments: ({ page, limit, search, doctorId, patientId, departmentId, date, status, today }: AppointmentListParams) => Promise<{
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
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
export declare const getAppointmentById: (id: string) => Promise<{
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
export declare const createAppointment: (payload: {
    patientId: string;
    doctorId: string;
    departmentId: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    consultationType?: ConsultationType;
    priority?: AppointmentPriority;
    reasonForVisit?: string;
    symptoms?: string;
    notes?: string;
}, actorId?: string) => Promise<{
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
export declare const updateAppointment: (id: string, payload: {
    patientId?: string;
    doctorId?: string;
    departmentId?: string;
    appointmentDate?: string;
    startTime?: string;
    endTime?: string;
    consultationType?: ConsultationType;
    priority?: AppointmentPriority;
    status?: AppointmentStatus;
    reasonForVisit?: string | null;
    symptoms?: string | null;
    notes?: string | null;
}, actorId?: string) => Promise<{
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
export declare const cancelAppointment: (id: string, actorId?: string) => Promise<{
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
export declare const deleteAppointment: (id: string) => Promise<{
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
export declare const getAppointmentStats: () => Promise<{
    todayAppointments: number;
    upcomingAppointments: number;
    completed: number;
    cancelled: number;
    noShow: number;
}>;
export {};
//# sourceMappingURL=appointment.service.d.ts.map