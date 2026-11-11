/**
 * @file src/domain/repositories/IStudentRepository.ts
 * @description Contrato de Repositorio de Dominio para la persistencia local
 * del progreso académico del estudiante en SQLite (RF-E04).
 */

import { StudentMissionProgress } from '../entities/StudentMission';

export interface IStudentRepository {
  /**
   * Inicializa las tablas necesarias en la base de datos SQLite local.
   */
  initialize(): Promise<void>;

  /**
   * Obtiene el progreso guardado de un estudiante en una misión específica.
   */
  getProgress(
    studentId: string,
    missionId: string
  ): Promise<StudentMissionProgress | null>;

  /**
   * Guarda de forma transaccional el avance del estudiante ante cada respuesta,
   * protegiendo los datos frente a apagados repentinos del teléfono (RF-E04).
   */
  saveProgress(progress: StudentMissionProgress): Promise<void>;

  /**
   * Reinicia el progreso de una misión específica para permitir repetir la cápsula.
   */
  resetProgress(studentId: string, missionId: string): Promise<void>;

  /**
   * Obtiene el historial de sentencias SQL ejecutadas para inspección en la Demo.
   */
  getRecentSqlLogs(): string[];
}
