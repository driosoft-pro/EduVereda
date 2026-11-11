/**
 * @file src/infrastructure/repositories/SqliteTeacherRepository.ts
 * @description Implementación de Infraestructura de ITeacherRepository sobre SQLite local.
 *
 * Incluye los registros semilla que aparecen en el mockup de alta fidelidad
 * design/style-mockups.jpeg (Sofia R. 95%, Lucas M. 88%, Ana P. 92%, Diego T. 76%, Clara G. 81%)
 * y restricción UNIQUE sobre transactionId (tx) y signatureHash (sig) Anti-Replay.
 */

import {
  ClassroomGradeRecord,
  ClassroomSummaryStats,
} from '../../domain/entities/GradeRecord';
import { ITeacherRepository } from '../../domain/repositories/ITeacherRepository';
import { SqliteEngine } from '../database/sqliteEngine';

const TEACHER_GRADES_TABLE = 'eduvereda_sqlite_classroom_grades_v2';

const INITIAL_SEED_RECORDS: ClassroomGradeRecord[] = [
  {
    transactionId: 'a1c9-40b1',
    studentId: 'EST-102',
    studentName: 'Sofia R.',
    grade: '9°',
    subject: 'Matemáticas',
    scorePercentage: 95,
    scannedAtIso: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    missionTimestamp: Math.floor((Date.now() - 1000 * 60 * 26) / 1000),
    signatureHash:
      '8f3a129c4d7e6b5a9012c34d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e41',
    decodeTimeMs: 390,
  },
  {
    transactionId: 'b2d8-51c2',
    studentId: 'EST-103',
    studentName: 'Lucas M.',
    grade: '8°',
    subject: 'Español',
    scorePercentage: 88,
    scannedAtIso: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    missionTimestamp: Math.floor((Date.now() - 1000 * 60 * 21) / 1000),
    signatureHash:
      '7e2b119c4d7e6b5a9012c34d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e42',
    decodeTimeMs: 410,
  },
  {
    transactionId: 'c3e7-62d3',
    studentId: 'EST-104',
    studentName: 'Ana P.',
    grade: '8°',
    subject: 'Química',
    scorePercentage: 92,
    scannedAtIso: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    missionTimestamp: Math.floor((Date.now() - 1000 * 60 * 16) / 1000),
    signatureHash:
      '6d1c109c4d7e6b5a9012c34d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e43',
    decodeTimeMs: 360,
  },
  {
    transactionId: 'd4f6-73e4',
    studentId: 'EST-105',
    studentName: 'Diego T.',
    grade: '7°',
    subject: 'Inglés',
    scorePercentage: 76,
    scannedAtIso: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    missionTimestamp: Math.floor((Date.now() - 1000 * 60 * 11) / 1000),
    signatureHash:
      '5c0d099c4d7e6b5a9012c34d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e44',
    decodeTimeMs: 440,
  },
  {
    transactionId: 'e5a5-84f5',
    studentId: 'EST-106',
    studentName: 'Clara G.',
    grade: '9°',
    subject: 'Estadística Rural',
    scorePercentage: 81,
    scannedAtIso: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    missionTimestamp: Math.floor((Date.now() - 1000 * 60 * 6) / 1000),
    signatureHash:
      '4b9e089c4d7e6b5a9012c34d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e45',
    decodeTimeMs: 375,
  },
];

export class SqliteTeacherRepository implements ITeacherRepository {
  constructor(private readonly db: SqliteEngine) {}

  async initialize(): Promise<void> {
    this.db.logParameterizedQuery(
      'CREATE TABLE IF NOT EXISTS classroom_grades (tx_id TEXT PRIMARY KEY UNIQUE, student_id TEXT NOT NULL, student_name TEXT NOT NULL, grade TEXT NOT NULL, subject TEXT NOT NULL, score INTEGER NOT NULL CHECK(score >= 0 AND score <= 100), sig_hash TEXT UNIQUE NOT NULL, decode_ms INTEGER, scanned_at TEXT NOT NULL);'
    );

    const existing = await this.db.readTable<ClassroomGradeRecord>(
      TEACHER_GRADES_TABLE
    );
    if (existing.length === 0) {
      await this.db.writeTable(TEACHER_GRADES_TABLE, INITIAL_SEED_RECORDS);
    }
  }

  async existsTransaction(
    transactionId: string,
    signatureHash: string
  ): Promise<boolean> {
    this.db.logParameterizedQuery(
      'SELECT COUNT(1) FROM classroom_grades WHERE tx_id = ? OR sig_hash = ?;',
      [transactionId, signatureHash.slice(0, 12) + '...']
    );
    const records = await this.db.readTable<ClassroomGradeRecord>(
      TEACHER_GRADES_TABLE
    );
    return records.some(
      (r) =>
        r.transactionId === transactionId || r.signatureHash === signatureHash
    );
  }

  async insertGradeRecord(record: ClassroomGradeRecord): Promise<void> {
    this.db.logParameterizedQuery(
      'INSERT INTO classroom_grades (tx_id, student_id, student_name, grade, subject, score, sig_hash, decode_ms, scanned_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
      [
        record.transactionId,
        record.studentId,
        record.studentName,
        record.grade,
        record.subject,
        record.scorePercentage,
        record.signatureHash.slice(0, 12) + '...',
        record.decodeTimeMs,
        record.scannedAtIso,
      ]
    );

    const records = await this.db.readTable<ClassroomGradeRecord>(
      TEACHER_GRADES_TABLE
    );
    await this.db.writeTable(TEACHER_GRADES_TABLE, [record, ...records]);
  }

  async getAllGradeRecords(): Promise<ClassroomGradeRecord[]> {
    const records = await this.db.readTable<ClassroomGradeRecord>(
      TEACHER_GRADES_TABLE
    );
    return records.sort(
      (a, b) =>
        new Date(b.scannedAtIso).getTime() - new Date(a.scannedAtIso).getTime()
    );
  }

  async getClassroomStats(): Promise<ClassroomSummaryStats> {
    const records = await this.getAllGradeRecords();
    if (records.length === 0) {
      return {
        totalRecords: 0,
        uniqueStudents: 0,
        averageScore: 0,
        highestScore: 0,
        averageDecodeMs: 0,
      };
    }

    const uniqueStudents = new Set(records.map((r) => r.studentId)).size;
    const totalScore = records.reduce((acc, r) => acc + r.scorePercentage, 0);
    const highestScore = Math.max(...records.map((r) => r.scorePercentage));
    const totalDecodeMs = records.reduce((acc, r) => acc + r.decodeTimeMs, 0);

    return {
      totalRecords: records.length,
      uniqueStudents,
      averageScore: Math.round(totalScore / records.length),
      highestScore,
      averageDecodeMs: Math.round(totalDecodeMs / records.length),
    };
  }

  async resetDemoRecords(): Promise<void> {
    this.db.logParameterizedQuery('DELETE FROM classroom_grades; -- Reset Demo');
    await this.db.writeTable(TEACHER_GRADES_TABLE, INITIAL_SEED_RECORDS);
  }
}
