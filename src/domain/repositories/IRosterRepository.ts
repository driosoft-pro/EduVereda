/**
 * @file src/domain/repositories/IRosterRepository.ts
 * @description Contrato de Dominio para el CRUD de Estudiantes y Maestros en SQLite local.
 */

import { StudentProfile, TeacherProfile } from '../entities/Role';

export interface IRosterRepository {
  initialize(): Promise<void>;

  // CRUD de Estudiantes
  getAllStudents(): Promise<StudentProfile[]>;
  saveStudent(student: StudentProfile): Promise<StudentProfile[]>;
  deleteStudent(studentId: string): Promise<StudentProfile[]>;

  // CRUD de Maestros
  getAllTeachers(): Promise<TeacherProfile[]>;
  saveTeacher(teacher: TeacherProfile): Promise<TeacherProfile[]>;
  deleteTeacher(teacherId: string): Promise<TeacherProfile[]>;
  setActiveTeacher(teacherId: string): Promise<TeacherProfile[]>;
}
