/**
 * @file src/application/useCases/ManageRosterCrudUseCase.ts
 * @description Caso de Uso de Aplicación para el Rol Administrador (ADMIN):
 * Ejecuta las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) de
 * Estudiantes y Maestros en la base de datos SQLite local.
 */

import { StudentProfile, TeacherProfile } from '../../domain/entities/Role';
import { IRosterRepository } from '../../domain/repositories/IRosterRepository';

export class ManageRosterCrudUseCase {
  constructor(private readonly rosterRepository: IRosterRepository) {}

  // ==================== CRUD ESTUDIANTES ====================

  async listStudents(): Promise<StudentProfile[]> {
    return this.rosterRepository.getAllStudents();
  }

  async upsertStudent(input: {
    id?: string;
    name: string;
    grade: string;
    vereda: string;
    avatarEmoji?: string;
  }): Promise<StudentProfile[]> {
    const cleanName = input.name.trim();
    const cleanGrade = input.grade.trim() || '9°';
    const cleanVereda = input.vereda.trim() || 'Vereda El Roblal';

    if (!cleanName) {
      throw new Error('El nombre del estudiante es obligatorio.');
    }

    const studentId =
      input.id && input.id.trim().length > 0
        ? input.id.trim()
        : `EST-${Math.floor(100 + Math.random() * 900)}`;

    const profile: StudentProfile = {
      id: studentId,
      name: cleanName,
      grade: cleanGrade,
      vereda: cleanVereda,
      avatarEmoji: input.avatarEmoji?.trim() || '🧑🏽‍🎓',
    };

    return this.rosterRepository.saveStudent(profile);
  }

  async removeStudent(studentId: string): Promise<StudentProfile[]> {
    return this.rosterRepository.deleteStudent(studentId);
  }

  // ==================== CRUD MAESTROS ====================

  async listTeachers(): Promise<TeacherProfile[]> {
    return this.rosterRepository.getAllTeachers();
  }

  async upsertTeacher(input: {
    id?: string;
    name: string;
    specialty: string;
    ruralSchool: string;
    avatarEmoji?: string;
    isActive?: boolean;
  }): Promise<TeacherProfile[]> {
    const cleanName = input.name.trim();
    const cleanSpecialty = input.specialty.trim() || 'Multigrado General';
    const cleanSchool = input.ruralSchool.trim() || 'I.E.R. El Roblal';

    if (!cleanName) {
      throw new Error('El nombre del maestro es obligatorio.');
    }

    const teacherId =
      input.id && input.id.trim().length > 0
        ? input.id.trim()
        : `DOC-${Math.floor(10 + Math.random() * 89)}`;

    const profile: TeacherProfile = {
      id: teacherId,
      name: cleanName,
      specialty: cleanSpecialty,
      ruralSchool: cleanSchool,
      avatarEmoji: input.avatarEmoji?.trim() || '👩‍🏫',
      isActive: input.isActive ?? false,
    };

    return this.rosterRepository.saveTeacher(profile);
  }

  async removeTeacher(teacherId: string): Promise<TeacherProfile[]> {
    return this.rosterRepository.deleteTeacher(teacherId);
  }

  async selectActiveTeacher(teacherId: string): Promise<TeacherProfile[]> {
    return this.rosterRepository.setActiveTeacher(teacherId);
  }
}
