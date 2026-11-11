/**
 * @file src/domain/entities/GradeRecord.ts
 * @description Entidades de Dominio para el Contrato Óptico QR (VeredaSync)
 * y el Consolidado de Calificaciones del Módulo B (EduVereda Docente).
 *
 * Cubre RF-E06 (Generación de QR Dinámico), RF-D02 (Decodificación veloz),
 * RF-D04 (Consolidado Automático del Aula) y la Sección 5.2 / 5.3 de Seguridad.
 */

/**
 * Contrato compacto JSON codificado dentro del Código QR (Sección 5.2).
 * Sus llaves de una o dos letras minimizan la densidad de módulos del QR
 * permitiendo lectura óptica en menos de 1.8 segundos en cámaras de gama baja.
 */
export interface VeredaSyncQrPayload {
  /** Versión del protocolo VeredaSync (1) */
  v: number;
  /** Nonce único de transacción (Anti-Replay) */
  tx: string;
  /** ID local del estudiante (ej. "EST-104") */
  id: string;
  /** Nombre del estudiante (ej. "Mateo Gómez") */
  n: string;
  /** Grado escolar (ej. "9°") */
  g: string;
  /** Materia o cápsula evaluada (ej. "Estadística Rural") */
  m: string;
  /** Calificación porcentual obtenida (0 a 100) */
  s: number;
  /** Marca de tiempo Unix en segundos */
  ts: number;
  /** Firma criptográfica HMAC-SHA256 sobre v|tx|id|n|g|m|s|ts */
  sig: string;
}

/**
 * Registro estructurado en la tabla SQLite local de la docente (RF-D04).
 */
export interface ClassroomGradeRecord {
  transactionId: string;
  studentId: string;
  studentName: string;
  grade: string;
  subject: string;
  scorePercentage: number;
  scannedAtIso: string;
  missionTimestamp: number;
  signatureHash: string;
  decodeTimeMs: number;
}

/**
 * Resultado del procesamiento y validación de seguridad de un Código QR escaneado.
 */
export interface QrScanVerificationResult {
  success: boolean;
  statusCode:
    | 'VERIFIED_AND_SAVED'
    | 'INVALID_JSON_FORMAT'
    | 'SCHEMA_VALIDATION_FAILED'
    | 'SIGNATURE_TAMPERED'
    | 'REPLAY_ATTACK_DETECTED';
  message: string;
  decodeDurationMs: number;
  record?: ClassroomGradeRecord;
}

/**
 * Resumen estadístico en tiempo real del aula multigrado.
 */
export interface ClassroomSummaryStats {
  totalRecords: number;
  uniqueStudents: number;
  averageScore: number;
  highestScore: number;
  averageDecodeMs: number;
}
