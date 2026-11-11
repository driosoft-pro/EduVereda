/**
 * @file src/infrastructure/repositories/SqliteStudentRepository.ts
 * @description Implementación de Infraestructura de IStudentRepository sobre SQLite local.
 * Garantiza que cada respuesta del estudiante quede protegida en memoria no volátil (RF-E04).
 */

import { StudentMissionProgress } from '../../domain/entities/StudentMission';
import { IStudentRepository } from '../../domain/repositories/IStudentRepository';
import { SqliteEngine } from '../database/sqliteEngine';

const STUDENT_PROGRESS_TABLE = 'eduvereda_sqlite_student_progress_v1';

export class SqliteStudentRepository implements IStudentRepository {
  constructor(private readonly db: SqliteEngine) {}

  async initialize(): Promise<void> {
    this.db.logParameterizedQuery(
      'CREATE TABLE IF NOT EXISTS student_progress (student_id TEXT, mission_id TEXT, subject TEXT, current_index INTEGER, answers_json TEXT, score INTEGER, is_completed INTEGER, tx_id TEXT, updated_at TEXT, PRIMARY KEY (student_id, mission_id));'
    );
  }

  async getProgress(
    studentId: string,
    missionId: string
  ): Promise<StudentMissionProgress | null> {
    this.db.logParameterizedQuery(
      'SELECT * FROM student_progress WHERE student_id = ? AND mission_id = ? LIMIT 1;',
      [studentId, missionId]
    );
    const rows = await this.db.readTable<StudentMissionProgress>(
      STUDENT_PROGRESS_TABLE
    );
    return (
      rows.find(
        (r) => r.studentId === studentId && r.missionId === missionId
      ) ?? null
    );
  }

  async saveProgress(progress: StudentMissionProgress): Promise<void> {
    this.db.logParameterizedQuery(
      'INSERT OR REPLACE INTO student_progress (student_id, mission_id, subject, current_index, score, is_completed, tx_id, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
      [
        progress.studentId,
        progress.missionId,
        progress.subject,
        progress.currentQuestionIndex,
        progress.scorePercentage,
        progress.isCompleted ? 1 : 0,
        progress.lastTransactionId ?? null,
        progress.updatedAtIso,
      ]
    );

    const rows = await this.db.readTable<StudentMissionProgress>(
      STUDENT_PROGRESS_TABLE
    );
    const filtered = rows.filter(
      (r) =>
        !(
          r.studentId === progress.studentId &&
          r.missionId === progress.missionId
        )
    );
    await this.db.writeTable(STUDENT_PROGRESS_TABLE, [progress, ...filtered]);
  }

  async resetProgress(studentId: string, missionId: string): Promise<void> {
    this.db.logParameterizedQuery(
      'DELETE FROM student_progress WHERE student_id = ? AND mission_id = ?;',
      [studentId, missionId]
    );
    const rows = await this.db.readTable<StudentMissionProgress>(
      STUDENT_PROGRESS_TABLE
    );
    const filtered = rows.filter(
      (r) => !(r.studentId === studentId && r.missionId === missionId)
    );
    await this.db.writeTable(STUDENT_PROGRESS_TABLE, filtered);
  }

  getRecentSqlLogs(): string[] {
    return this.db.getAuditLogs();
  }
}
