export const userRoles = {
    ADMIN: 'admin',
    INSTRUCTOR: 'instructor',
    STUDENT: 'student',
} as const;

export type UserRole = typeof userRoles[keyof typeof userRoles];