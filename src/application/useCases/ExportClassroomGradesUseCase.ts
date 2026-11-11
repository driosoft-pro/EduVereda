/**
 * @file src/application/useCases/ExportClassroomGradesUseCase.ts
 * @description Caso de Uso de Aplicación: Exportación Local Segura de Calificaciones (RF-D05).
 *
 * Permite a la docente exportar el consolidado del aula multigrado a archivos
 * abiertos CSV o JSON almacenados en la memoria del dispositivo.
 */

import { ITeacherRepository } from '../../domain/repositories/ITeacherRepository';
import {
  ExportResult,
  IExportService,
} from '../../domain/services/IExportService';

export class ExportClassroomGradesUseCase {
  constructor(
    private readonly teacherRepository: ITeacherRepository,
    private readonly exportService: IExportService
  ) {}

  async execute(format: 'CSV' | 'JSON'): Promise<ExportResult> {
    const records = await this.teacherRepository.getAllGradeRecords();

    if (format === 'CSV') {
      return this.exportService.exportToCsv(records);
    }

    return this.exportService.exportToJson(records);
  }
}
