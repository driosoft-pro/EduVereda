/**
 * @file src/application/useCases/ManageAttendanceUseCase.ts
 * @description Caso de Uso de Aplicación para Toma de Asistencia Escolar
 * en el Aula Multigrado (Manual por el Docente o Automática vía Escaneo QR).
 */

import {
  AttendanceRecord,
  AttendanceSource,
  AttendanceStatus,
  AttendanceSummaryStats,
} from '../../domain/entities/AttendanceRecord';
import { StudentProfile } from '../../domain/entities/Role';
import { IAttendanceRepository } from '../../domain/repositories/IAttendanceRepository';

export class ManageAttendanceUseCase {
  constructor(private readonly attendanceRepository: IAttendanceRepository) {}

  async getTodayAttendanceList(): Promise<AttendanceRecord[]> {
    return this.attendanceRepository.getTodayAttendance();
  }

  async recordStudentAttendance(params: {
    student: StudentProfile;
    status: AttendanceStatus;
    source: AttendanceSource;
    teacherName: string;
  }): Promise<AttendanceRecord[]> {
    return this.attendanceRepository.markStudentAttendance(params);
  }

  async markEntireClassPresent(
    students: StudentProfile[],
    teacherName: string
  ): Promise<AttendanceRecord[]> {
    return this.attendanceRepository.markAllStudentsPresent(
      students,
      teacherName
    );
  }

  computeSummary(
    students: StudentProfile[],
    records: AttendanceRecord[]
  ): AttendanceSummaryStats {
    return this.attendanceRepository.calculateStats(students, records);
  }
}
