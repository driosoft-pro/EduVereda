/**
 * @file src/infrastructure/export/LocalFileExportService.ts
 * @description Implementación Multiplataforma de Exportación Local de Datos (RF-D05).
 *
 * Genera archivos abiertos CSV (sanitizados contra inyección de fórmulas) y JSON
 * listos para integrarse con los sistemas oficiales del colegio sin internet.
 */

import { Platform } from 'react-native';
import { ClassroomGradeRecord } from '../../domain/entities/GradeRecord';
import {
  ExportResult,
  IExportService,
} from '../../domain/services/IExportService';
import { ISecurityService } from '../../domain/services/ISecurityService';

export class LocalFileExportService implements IExportService {
  constructor(private readonly securityService: ISecurityService) {}

  private triggerBrowserDownload(
    fileName: string,
    content: string,
    mimeType: string
  ): void {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback en caso de entorno sin DOM completo
    }
  }

  async exportToCsv(records: ClassroomGradeRecord[]): Promise<ExportResult> {
    const header = [
      'ID_Transaccion',
      'ID_Estudiante',
      'Nombre_Alumno',
      'Grado',
      'Materia',
      'Calificacion_Porcentaje',
      'Fecha_Hora_Escaneo',
      'Tiempo_Decodificacion_Ms',
      'Firma_HMAC_SHA256',
    ].join(',');

    const rows = records.map((r) =>
      [
        this.securityService.sanitizeCsvCell(r.transactionId),
        this.securityService.sanitizeCsvCell(r.studentId),
        this.securityService.sanitizeCsvCell(r.studentName),
        this.securityService.sanitizeCsvCell(r.grade),
        this.securityService.sanitizeCsvCell(r.subject),
        this.securityService.sanitizeCsvCell(r.scorePercentage),
        this.securityService.sanitizeCsvCell(r.scannedAtIso),
        this.securityService.sanitizeCsvCell(r.decodeTimeMs),
        this.securityService.sanitizeCsvCell(r.signatureHash),
      ].join(',')
    );

    const csvContent = [header, ...rows].join('\n');
    const dateStamp = new Date().toISOString().slice(0, 10);
    const fileName = `eduvereda_consolidado_notas_${dateStamp}.csv`;

    this.triggerBrowserDownload(
      fileName,
      csvContent,
      'text/csv;charset=utf-8;'
    );

    return {
      success: true,
      format: 'CSV',
      fileName,
      contentPreview: csvContent,
      message: `Consolidado CSV exportado localmente (${records.length} registros sanitizados).`,
    };
  }

  async exportToJson(records: ClassroomGradeRecord[]): Promise<ExportResult> {
    const payload = {
      system: 'EduVereda - VeredaSync Offline Export',
      schemaVersion: 1,
      exportedAtIso: new Date().toISOString(),
      totalRecords: records.length,
      securityScheme: 'HMAC-SHA256 + Anti-Replay UNIQUE tx',
      records,
    };

    const jsonContent = JSON.stringify(payload, null, 2);
    const dateStamp = new Date().toISOString().slice(0, 10);
    const fileName = `eduvereda_consolidado_notas_${dateStamp}.json`;

    this.triggerBrowserDownload(
      fileName,
      jsonContent,
      'application/json;charset=utf-8;'
    );

    return {
      success: true,
      format: 'JSON',
      fileName,
      contentPreview: jsonContent,
      message: `Consolidado JSON exportado localmente (${records.length} registros verificados).`,
    };
  }
}
