interface DoctorListParams {
    page?: number;
    limit?: number;
    search?: string;
    departmentId?: string;
    status?: string;
    availability?: string;
}
export declare const listDoctors: ({ page, limit, search, departmentId, status, availability }: DoctorListParams) => Promise<{
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
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
export declare const getDoctorById: (id: string) => Promise<{
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
}>;
export declare const createDoctor: (payload: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    departmentId?: string;
    specialization?: string;
    qualifications?: string;
    licenseNumber?: string;
    schedule?: string;
    consultationFee?: number;
    bio?: string;
    employmentStatus?: string;
    availability?: string;
    photoUrl?: string;
}, actorId?: string) => Promise<{
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
export declare const updateDoctor: (id: string, payload: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    departmentId?: string | null;
    specialization?: string | null;
    qualifications?: string | null;
    licenseNumber?: string | null;
    schedule?: string | null;
    consultationFee?: number | null;
    bio?: string | null;
    employmentStatus?: string | null;
    availability?: string | null;
    photoUrl?: string | null;
}, actorId?: string) => Promise<{
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
export declare const deleteDoctor: (id: string, actorId?: string) => Promise<boolean>;
export {};
//# sourceMappingURL=doctor.service.d.ts.map