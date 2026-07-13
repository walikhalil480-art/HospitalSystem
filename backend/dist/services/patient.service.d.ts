import { Prisma } from "@prisma/client";
interface PatientListParams {
    page?: number;
    limit?: number;
    search?: string;
}
export declare const listPatients: ({ page, limit, search }: PatientListParams) => Promise<{
    patients: ({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            phone: string | null;
            isActive: boolean;
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
    })[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
export declare const getPatientById: (id: string) => Promise<{
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        phone: string | null;
    };
    appointments: ({
        doctor: {
            user: {
                firstName: string;
                lastName: string;
            };
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
    medicalRecords: {
        status: import(".prisma/client").$Enums.MedicalRecordStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        patientId: string;
        doctorId: string;
        symptoms: string | null;
        allergies: Prisma.JsonValue | null;
        medicalRecordNumber: string;
        appointmentId: string | null;
        visitDate: Date;
        chiefComplaint: string | null;
        vitalSigns: Prisma.JsonValue | null;
        diagnosis: string | null;
        differentialDiagnosis: string | null;
        treatmentPlan: string | null;
        prescriptions: Prisma.JsonValue | null;
        chronicConditions: Prisma.JsonValue | null;
        immunizations: Prisma.JsonValue | null;
        laboratoryRequests: Prisma.JsonValue | null;
        radiologyRequests: Prisma.JsonValue | null;
        clinicalNotes: string | null;
        followUpDate: Date | null;
        auditTrail: Prisma.JsonValue | null;
    }[];
    invoices: {
        status: import(".prisma/client").$Enums.InvoiceStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        patientId: string;
        notes: string | null;
        invoiceNumber: string;
        subtotal: number;
        tax: number;
        discount: number;
        amount: number;
        dueDate: Date | null;
        paidAt: Date | null;
    }[];
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
}>;
export declare const createPatient: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    bloodGroup?: string;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    allergies?: string;
    insuranceDetails?: string;
    medicalNotes?: string;
}, actorId?: string) => Promise<{
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
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
}>;
export declare const updatePatient: (id: string, payload: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    bloodGroup?: string | null;
    address?: string | null;
    emergencyContact?: string | null;
    emergencyPhone?: string | null;
    allergies?: string | null;
    insuranceDetails?: string | null;
    medicalNotes?: string | null;
}, actorId?: string) => Promise<{
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
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
}>;
export declare const deletePatient: (id: string, actorId?: string) => Promise<boolean>;
export {};
//# sourceMappingURL=patient.service.d.ts.map