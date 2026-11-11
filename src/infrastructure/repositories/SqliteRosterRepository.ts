/**
 * @file src/infrastructure/repositories/SqliteRosterRepository.ts
 * @description Implementación de Infraestructura de IRosterRepository sobre SQLite local.
 *
 * Permite al Rol Administrador (y Docente) ejecutar operaciones CRUD completas
 * sobre Estudiantes y Maestros con sentencias parametrizadas auditables.
 */

import { StudentProfile, TeacherProfile } from '../../domain/entities/Role';
import { IRosterRepository } from '../../domain/repositories/IRosterRepository';
import {
  INITIAL_STUDENTS_ROSTER,
  INITIAL_TEACHERS_ROSTER,
} from '../../application/data/ruralMissionsCatalog';
import { SqliteEngine } from '../database/sqliteEngine';

const STUDENTS_TABLE_KEY = 'eduvereda_sqlite_students_roster_v2';
const TEACHERS_TABLE_KEY = 'eduvereda_sqlite_teachers_roster_v2';

export class SqliteRosterRepository implements IRosterRepository {
  constructor(private readonly db: SqliteEngine) {}

  async initialize(): Promise<void> {
    this.db.logParameterizedQuery(
      'CREATE TABLE IF NOT EXISTS students_roster (id TEXT PRIMARY KEY, name TEXT NOT NULL, grade TEXT NOT NULL, vereda TEXT NOT NULL, avatar TEXT);'
    );
    this.db.logParameterizedQuery(
      'CREATE TABLE IF NOT EXISTS teachers_roster (id TEXT PRIMARY KEY, name TEXT NOT NULL, specialty TEXT NOT NULL, rural_school TEXT NOT NULL, avatar TEXT, is_active INTEGER);'
    );

    const existingStudents =
      await this.db.readTable<StudentProfile>(STUDENTS_TABLE_KEY);
    if (existingStudents.length === 0) {
      await this.db.writeTable(STUDENTS_TABLE_KEY, INITIAL_STUDENTS_ROSTER);
    }

    const existingTeachers =
      await this.db.readTable<TeacherProfile>(TEACHERS_TABLE_KEY);
    if (existingTeachers.length === 0) {
      await this.db.writeTable(TEACHERS_TABLE_KEY, INITIAL_TEACHERS_ROSTER);
    }
  }

  // ==================== CRUD ESTUDIANTES ====================

  async getAllStudents(): Promise<StudentProfile[]> {
    const rows = await this.db.readTable<StudentProfile>(STUDENTS_TABLE_KEY);
    return rows.length > 0 ? rows : INITIAL_STUDENTS_ROSTER;
  }

  async saveStudent(student: StudentProfile): Promise<StudentProfile[]> {
    this.db.logParameterizedQuery(
      'INSERT OR REPLACE INTO students_roster (id, name, grade, vereda, avatar) VALUES (?, ?, ?, ?, ?);',
      [
        student.id,
        student.name,
        student.grade,
        student.vereda,
        student.avatarEmoji,
      ]
    );

    const rows = await this.getAllStudents();
    const existsIndex = rows.findIndex((s) => s.id === student.id);
    let updated: StudentProfile[];

    if (existsIndex >= 0) {
      updated = rows.map((s) => (s.id === student.id ? student : s));
    } else {
      updated = [student, ...rows];
    }

    await this.db.writeTable(STUDENTS_TABLE_KEY, updated);
    return updated;
  }

  async deleteStudent(studentId: string): Promise<StudentProfile[]> {
    this.db.logParameterizedQuery(
      'DELETE FROM students_roster WHERE id = ?;',
      [studentId]
    );

    const rows = await this.getAllStudents();
    const updated = rows.filter((s) => s.id !== studentId);
    await this.db.writeTable(STUDENTS_TABLE_KEY, updated);
    return updated;
  }

  // ==================== CRUD MAESTROS ====================

  async getAllTeachers(): Promise<TeacherProfile[]> {
    const rows = await this.db.readTable<TeacherProfile>(TEACHERS_TABLE_KEY);
    return rows.length > 0 ? rows : INITIAL_TEACHERS_ROSTER;
  }

  async saveTeacher(teacher: TeacherProfile): Promise<TeacherProfile[]> {
    this.db.logParameterizedQuery(
      'INSERT OR REPLACE INTO teachers_roster (id, name, specialty, rural_school, avatar, is_active) VALUES (?, ?, ?, ?, ?, ?);',
      [
        teacher.id,
        teacher.name,
        teacher.specialty,
        teacher.ruralSchool,
        teacher.avatarEmoji,
        teacher.isActive ? 1 : 0,
      ]
    );

    const rows = await this.getAllTeachers();
    const existsIndex = rows.findIndex((t) => t.id === teacher.id);
    let updated: TeacherProfile[];

    if (existsIndex >= 0) {
      updated = rows.map((t) => (t.id === teacher.id ? teacher : t));
    } else {
      updated = [teacher, ...rows];
    }

    if (!updated.some((t) => t.isActive) && updated.length > 0) {
      updated[0].isActive = true;
    }

    await this.db.writeTable(TEACHERS_TABLE_KEY, updated);
    return updated;
  }

  async deleteTeacher(teacherId: string): Promise<TeacherProfile[]> {
    this.db.logParameterizedQuery(
      'DELETE FROM teachers_roster WHERE id = ?;',
      [teacherId]
    );

    const rows = await this.getAllTeachers();
    const updated = rows.filter((t) => t.id !== teacherId);
    if (!updated.some((t) => t.isActive) && updated.length > 0) {
      updated[0].isActive = true;
    }

    await this.db.writeTable(TEACHERS_TABLE_KEY, updated);
    return updated;
  }

  async setActiveTeacher(teacherId: string): Promise<TeacherProfile[]> {
    this.db.logParameterizedQuery(
      'UPDATE teachers_roster SET is_active = CASE WHEN id = ? THEN 1 ELSE 0 END;',
      [teacherId]
    );

    const rows = await this.getAllTeachers();
    const updated = rows.map((t) => ({
      ...t,
      isActive: t.id === teacherId,
    }));

    await this.db.writeTable(TEACHERS_TABLE_KEY, updated);
    return updated;
  }
}
