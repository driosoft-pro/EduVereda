/**
 * @file src/domain/repositories/ITeacherRepository.ts
 * @description Contrato de Repositorio de Dominio para el consolidado de notas
 * del aula multigrado y protección Anti-Replay (RF-D04 y Sección 5.3).
 */

import {
  ClassroomGradeRecord,
  ClassroomSummaryStats,
} from '../entities/GradeRecord';

export interface ITeacherRepository {
  /**
   * Inicializa la tabla local de calificaciones con restricciones UNIQUE
   * sobre transactionId (tx) y signatureHash (sig).
   */
  initialize(): Promise<void>;

  /**
   * Verifica si un identificador de transacción (tx) o firma ya fue registrado
   * previamente para bloquear ataques de repetición (Anti-Replay).
   */
  existsTransaction(transactionId: string, signatureHash: string): Promise<boolean>;

  /**
   * Inserta una nueva calificación verificada en la tabla SQLite de la docente.
   */
  insertGradeRecord(record: ClassroomGradeRecord): Promise<void>;

  /**
   * Obtiene el listado completo de calificaciones ordenado por fecha más reciente.
   */
  getAllGradeRecords(): Promise<ClassroomGradeRecord[]>;

  /**
   * Calcula las estadísticas descriptivas del grupo escolar en tiempo real.
   */
  getClassroomStats(): Promise<ClassroomSummaryStats>;

  /**
   * Limpia los registros de demostración o carga datos semilla iniciales.
   */
  resetDemoRecords(): Promise<void>;
}
