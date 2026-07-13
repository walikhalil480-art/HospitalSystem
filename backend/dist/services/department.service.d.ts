interface DepartmentListParams {
    page?: number;
    limit?: number;
    search?: string;
}
export declare const listDepartments: ({ page, limit, search }: DepartmentListParams) => Promise<{
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
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
export declare const getDepartmentById: (id: string) => Promise<{
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
}>;
export declare const createDepartment: (payload: {
    name: string;
    description?: string;
    code?: string;
}, actorId?: string) => Promise<{
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
export declare const updateDepartment: (id: string, payload: {
    name?: string;
    description?: string | null;
    code?: string | null;
}, actorId?: string) => Promise<{
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
export declare const deleteDepartment: (id: string, actorId?: string) => Promise<boolean>;
export declare const assignDoctorToDepartment: (departmentId: string, doctorId: string, actorId?: string) => Promise<{
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
export declare const getDepartmentStats: () => Promise<{
    totalDepartments: number;
    activeDepartments: number;
    departments: {
        name: string;
        id: string;
        _count: {
            staff: number;
        };
    }[];
}>;
export {};
//# sourceMappingURL=department.service.d.ts.map