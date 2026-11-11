/**
 * @file src/domain/repositories/IAttendanceRepository.ts
 * @description Contrato de Dominio para Toma de Asistencia en SQLite local.
 */

import {
  AttendanceRecord,
  AttendanceSource,
  AttendanceStatus,
  AttendanceSummaryStats,
} from '../entities/AttendanceRecord';
import { StudentProfile } from '../entities/Role';

export interface IAttendanceRepository {
  initialize(): Promise<void>;

  /**
   * Obtiene los registros de asistencia del día actual.
   */
  getTodayAttendance(): Promise<AttendanceRecord[]>;

  /**
   * Registra o actualiza la asistencia de un estudiante (vía QR o manual).
   */
  markStudentAttendance(params: {
    student: StudentProfile;
    status: AttendanceStatus;
    source: AttendanceSource;
    teacherName: string;
  }): Promise<AttendanceRecord[]>;

  /**
   * Marca a todos los estudiantes de la nómina como PRESENTE en un solo paso.
   */
  markAllStudentsPresent(
    students: StudentProfile[],
    teacherName: string
  ): Promise<AttendanceRecord[]>;

  /**
   * Calcula las estadísticas de asistencia del día frente a la nómina total.
   */
  calculateStats(
    students: StudentProfile[],
    records: AttendanceRecord[]
  ): AttendanceSummaryStats;
}
