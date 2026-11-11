/**
 * @file src/domain/entities/AttendanceRecord.ts
 * @description Entidades de Dominio para Toma de Asistencia Escolar en Aula Multigrado.
 *
 * Permite registrar la asistencia tanto de forma automática al escanear el
 * Código QR del estudiante (QR_OPTICO) como de forma manual por el docente.
 */

export type AttendanceStatus = 'PRESENTE' | 'TARDANZA' | 'AUSENTE';

export type AttendanceSource = 'QR_OPTICO' | 'MANUAL_DOCENTE';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  vereda: string;
  dateKey: string; // YYYY-MM-DD
  updatedTimeLabel: string; // HH:MM:SS
  status: AttendanceStatus;
  source: AttendanceSource;
  registeredByTeacher: string;
}

export interface AttendanceSummaryStats {
  totalRoster: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  unmarkedCount: number;
  attendancePercentage: number;
}
