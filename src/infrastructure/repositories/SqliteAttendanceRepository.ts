/**
 * @file src/infrastructure/repositories/SqliteAttendanceRepository.ts
 * @description Implementación de Infraestructura de IAttendanceRepository sobre SQLite local.
 *
 * Gestiona el registro diario de asistencia escolar en el aula multigrado,
 * soportando tanto captura automática por Código QR como marcación manual docente.
 */

import {
  AttendanceRecord,
  AttendanceSource,
  AttendanceStatus,
  AttendanceSummaryStats,
} from '../../domain/entities/AttendanceRecord';
import { StudentProfile } from '../../domain/entities/Role';
import { IAttendanceRepository } from '../../domain/repositories/IAttendanceRepository';
import { SqliteEngine } from '../database/sqliteEngine';

const ATTENDANCE_TABLE_KEY = 'eduvereda_sqlite_attendance_v2';

export class SqliteAttendanceRepository implements IAttendanceRepository {
  constructor(private readonly db: SqliteEngine) {}

  private getTodayKey(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private getNowTimeLabel(): string {
    return new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  async initialize(): Promise<void> {
    this.db.logParameterizedQuery(
      'CREATE TABLE IF NOT EXISTS classroom_attendance (id TEXT PRIMARY KEY, student_id TEXT NOT NULL, student_name TEXT NOT NULL, grade TEXT NOT NULL, date_key TEXT NOT NULL, status TEXT NOT NULL, source TEXT NOT NULL, teacher_name TEXT, updated_time TEXT);'
    );

    const existing =
      await this.db.readTable<AttendanceRecord>(ATTENDANCE_TABLE_KEY);
    if (existing.length === 0) {
      const today = this.getTodayKey();
      const seedAttendance: AttendanceRecord[] = [
        {
          id: `${today}_EST-102`,
          studentId: 'EST-102',
          studentName: 'Sofia R.',
          grade: '9°',
          vereda: 'Vereda La Esperanza',
          dateKey: today,
          updatedTimeLabel: '07:32:10',
          status: 'PRESENTE',
          source: 'QR_OPTICO',
          registeredByTeacher: 'Elena Vargas',
        },
        {
          id: `${today}_EST-103`,
          studentId: 'EST-103',
          studentName: 'Lucas M.',
          grade: '8°',
          vereda: 'Vereda San Isidro',
          dateKey: today,
          updatedTimeLabel: '07:35:44',
          status: 'PRESENTE',
          source: 'QR_OPTICO',
          registeredByTeacher: 'Elena Vargas',
        },
        {
          id: `${today}_EST-104`,
          studentId: 'EST-104',
          studentName: 'Ana P.',
          grade: '8°',
          vereda: 'Vereda El Mirador',
          dateKey: today,
          updatedTimeLabel: '07:48:15',
          status: 'TARDANZA',
          source: 'MANUAL_DOCENTE',
          registeredByTeacher: 'Elena Vargas',
        },
      ];
      await this.db.writeTable(ATTENDANCE_TABLE_KEY, seedAttendance);
    }
  }

  async getTodayAttendance(): Promise<AttendanceRecord[]> {
    const today = this.getTodayKey();
    const all = await this.db.readTable<AttendanceRecord>(ATTENDANCE_TABLE_KEY);
    return all.filter((r) => r.dateKey === today);
  }

  async markStudentAttendance(params: {
    student: StudentProfile;
    status: AttendanceStatus;
    source: AttendanceSource;
    teacherName: string;
  }): Promise<AttendanceRecord[]> {
    const today = this.getTodayKey();
    const recordId = `${today}_${params.student.id}`;
    const timeLabel = this.getNowTimeLabel();

    this.db.logParameterizedQuery(
      'INSERT OR REPLACE INTO classroom_attendance (id, student_id, student_name, grade, date_key, status, source, teacher_name, updated_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
      [
        recordId,
        params.student.id,
        params.student.name,
        params.student.grade,
        today,
        params.status,
        params.source,
        params.teacherName,
        timeLabel,
      ]
    );

    const current = await this.getTodayAttendance();
    const newRecord: AttendanceRecord = {
      id: recordId,
      studentId: params.student.id,
      studentName: params.student.name,
      grade: params.student.grade,
      vereda: params.student.vereda,
      dateKey: today,
      updatedTimeLabel: timeLabel,
      status: params.status,
      source: params.source,
      registeredByTeacher: params.teacherName,
    };

    const filtered = current.filter(
      (r) => r.studentId !== params.student.id
    );
    const updated = [newRecord, ...filtered];
    await this.db.writeTable(ATTENDANCE_TABLE_KEY, updated);
    return updated;
  }

  async markAllStudentsPresent(
    students: StudentProfile[],
    teacherName: string
  ): Promise<AttendanceRecord[]> {
    const today = this.getTodayKey();
    const timeLabel = this.getNowTimeLabel();

    this.db.logParameterizedQuery(
      'BEGIN TRANSACTION; -- Marcación masiva de asistencia PRESENTE en aula multigrado',
      [students.length, teacherName]
    );

    const updated: AttendanceRecord[] = students.map((st) => ({
      id: `${today}_${st.id}`,
      studentId: st.id,
      studentName: st.name,
      grade: st.grade,
      vereda: st.vereda,
      dateKey: today,
      updatedTimeLabel: timeLabel,
      status: 'PRESENTE',
      source: 'MANUAL_DOCENTE',
      registeredByTeacher: teacherName,
    }));

    await this.db.writeTable(ATTENDANCE_TABLE_KEY, updated);
    return updated;
  }

  calculateStats(
    students: StudentProfile[],
    records: AttendanceRecord[]
  ): AttendanceSummaryStats {
    const totalRoster = students.length;
    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;

    for (const st of students) {
      const rec = records.find((r) => r.studentId === st.id);
      if (rec?.status === 'PRESENTE') presentCount += 1;
      else if (rec?.status === 'TARDANZA') lateCount += 1;
      else if (rec?.status === 'AUSENTE') absentCount += 1;
    }

    const unmarkedCount = Math.max(
      0,
      totalRoster - (presentCount + lateCount + absentCount)
    );
    const attended = presentCount + lateCount;
    const attendancePercentage =
      totalRoster > 0 ? Math.round((attended / totalRoster) * 100) : 0;

    return {
      totalRoster,
      presentCount,
      lateCount,
      absentCount,
      unmarkedCount,
      attendancePercentage,
    };
  }
}
