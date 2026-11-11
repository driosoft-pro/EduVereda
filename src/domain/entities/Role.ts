/**
 * @file src/domain/entities/Role.ts
 * @description Entidades de Dominio para el Manejo de Roles (RBAC) y Perfiles Escolares.
 *
 * Roles del Ecosistema EduVereda:
 *  1. SPLIT_DEMO (Vista Doble): Muestra en paralelo Estudiante y Docente para evaluación.
 *  2. STUDENT (EduVereda App): Resuelve misiones de Matemáticas, Español, Inglés, Química, etc.
 *  3. TEACHER (EduVereda Docente): Escanea QR, registra notas y toma asistencia en el aula.
 *  4. ADMIN (Panel Administrador): Ejecuta los CRUDs de Estudiantes y Maestros en SQLite local.
 */

export type SystemRole = 'SPLIT_DEMO' | 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface RolePermission {
  role: SystemRole;
  label: string;
  badgeText: string;
  description: string;
  canSolveMissions: boolean;
  canGenerateQr: boolean;
  canScanQr: boolean;
  canTakeAttendance: boolean;
  canExportGrades: boolean;
  canManageCrud: boolean;
}

/**
 * Perfil de estudiante rural gestionado en el CRUD de SQLite local.
 */
export interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  vereda: string;
  avatarEmoji: string;
}

/**
 * Perfil de maestro/docente rural gestionado en el CRUD de SQLite local.
 */
export interface TeacherProfile {
  id: string;
  name: string;
  specialty: string;
  ruralSchool: string;
  avatarEmoji: string;
  isActive: boolean;
}

export const ROLE_PERMISSIONS: Record<SystemRole, RolePermission> = {
  SPLIT_DEMO: {
    role: 'SPLIT_DEMO',
    label: 'Vista Doble (Demo)',
    badgeText: 'MODO SPLIT-SCREEN',
    description:
      'Visualiza en simultáneo el smartphone del Estudiante y la tableta horizontal de la Docente (inspirado en design/style-mockups.jpeg).',
    canSolveMissions: true,
    canGenerateQr: true,
    canScanQr: true,
    canTakeAttendance: true,
    canExportGrades: true,
    canManageCrud: false,
  },
  STUDENT: {
    role: 'STUDENT',
    label: 'Rol Estudiante',
    badgeText: 'MÓDULO ESTUDIANTE',
    description:
      'Acceso a cáspulas de Matemáticas, Español, Inglés y Química, aviso de guardado SQLite y generación de QR.',
    canSolveMissions: true,
    canGenerateQr: true,
    canScanQr: false,
    canTakeAttendance: false,
    canExportGrades: false,
    canManageCrud: false,
  },
  TEACHER: {
    role: 'TEACHER',
    label: 'Rol Docente',
    badgeText: 'MÓDULO DOCENTE',
    description:
      'Escáner QR de alta velocidad, registro de notas, toma de asistencia (vía QR o manual) y exportación CSV/JSON.',
    canSolveMissions: false,
    canGenerateQr: false,
    canScanQr: true,
    canTakeAttendance: true,
    canExportGrades: true,
    canManageCrud: false,
  },
  ADMIN: {
    role: 'ADMIN',
    label: 'Rol Administrador',
    badgeText: 'MÓDULO ADMINISTRADOR',
    description:
      'Gestión administrativa Offline: CRUD completo de Estudiantes, CRUD de Maestros, asignación de docente activo y auditoría SQLite.',
    canSolveMissions: false,
    canGenerateQr: false,
    canScanQr: false,
    canTakeAttendance: true,
    canExportGrades: true,
    canManageCrud: true,
  },
};
