/**
 * @file src/domain/services/IExportService.ts
 * @description Contrato de Dominio para la Exportación Local de Calificaciones
 * a formatos de datos abiertos CSV y JSON (RF-D05).
 */

import { ClassroomGradeRecord } from '../entities/GradeRecord';

export interface ExportResult {
  success: boolean;
  format: 'CSV' | 'JSON';
  fileName: string;
  contentPreview: string;
  message: string;
}

export interface IExportService {
  /**
   * Exporta los registros del aula a un archivo CSV sanitizado contra CSV Injection.
   */
  exportToCsv(records: ClassroomGradeRecord[]): Promise<ExportResult>;

  /**
   * Exporta los registros del aula a un archivo JSON estructurado con metadatos de integridad.
   */
  exportToJson(records: ClassroomGradeRecord[]): Promise<ExportResult>;
}
