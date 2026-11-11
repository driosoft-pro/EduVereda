/**
 * @file src/application/useCases/ProcessScannedQrUseCase.ts
 * @description Caso de Uso de Aplicación para la Docente (EduVereda Docente / VeredaSync).
 *
 * Orquesta los requerimientos:
 *  - RF-D02: Decodificación asincrónica veloz (< 1.8 a 2.4 segundos) sin red.
 *  - Sección 5.3: Validación Zero-Trust de esquema, verificación HMAC-SHA256 y Anti-Replay.
 *  - RF-D03: Disparo simultáneo de notificación visual, alerta auditiva («¡Pip!») y vibración.
 *  - RF-D04: Registro automático de la nota Y toma automática de asistencia (PRESENTE vía QR).
 */

import {
  ClassroomGradeRecord,
  QrScanVerificationResult,
} from '../../domain/entities/GradeRecord';
import { ITeacherRepository } from '../../domain/repositories/ITeacherRepository';
import { IAttendanceRepository } from '../../domain/repositories/IAttendanceRepository';
import { ISecurityService } from '../../domain/services/ISecurityService';
import { IFeedbackService } from '../../domain/services/IFeedbackService';

export class ProcessScannedQrUseCase {
  constructor(
    private readonly teacherRepository: ITeacherRepository,
    private readonly attendanceRepository: IAttendanceRepository,
    private readonly securityService: ISecurityService,
    private readonly feedbackService: IFeedbackService
  ) {}

  /**
   * Procesa una cadena cruda leída desde un Código QR, aplica todos los controles
   * criptográficos y de integridad, persiste nota + asistencia en SQLite y activa el feedback.
   */
  async execute(
    rawQrString: string,
    activeTeacherName: string
  ): Promise<QrScanVerificationResult> {
    const startPerf = Date.now();

    // 1. Validación Zero-Trust de formato JSON y esquema
    const validation = this.securityService.parseAndValidateQrJson(rawQrString);
    if (!validation.isValid || !validation.payload) {
      await this.feedbackService.triggerErrorAlert();
      const status =
        validation.errorReason?.includes('JSON')
          ? 'INVALID_JSON_FORMAT'
          : 'SCHEMA_VALIDATION_FAILED';

      return {
        success: false,
        statusCode: status,
        message:
          validation.errorReason ??
          'El código QR escaneado no cumple con el esquema VeredaSync.',
        decodeDurationMs: Math.max(12, Date.now() - startPerf),
      };
    }

    const payload = validation.payload;

    // 2. Verificación criptográfica de firma HMAC-SHA256 (integridad contra adulteración)
    const isSignatureValid =
      await this.securityService.verifyPayloadSignature(payload);

    if (!isSignatureValid) {
      await this.feedbackService.triggerErrorAlert();
      return {
        success: false,
        statusCode: 'SIGNATURE_TAMPERED',
        message: `¡Alerta de Seguridad! La firma HMAC-SHA256 del QR de ${payload.n} es inválida. Posible intento de alterar la nota (${payload.s}%).`,
        decodeDurationMs: Math.max(18, Date.now() - startPerf),
      };
    }

    // 3. Verificación Anti-Replay en SQLite (impide escanear dos veces el mismo QR)
    const alreadyExists = await this.teacherRepository.existsTransaction(
      payload.tx,
      payload.sig
    );

    if (alreadyExists) {
      await this.feedbackService.triggerErrorAlert();
      return {
        success: false,
        statusCode: 'REPLAY_ATTACK_DETECTED',
        message: `Registro duplicado bloqueado (Anti-Replay): La misión tx=${payload.tx} de ${payload.n} ya fue registrada previamente en SQLite.`,
        decodeDurationMs: Math.max(15, Date.now() - startPerf),
      };
    }

    // 4. Construcción del registro verificado y persistencia en SQLite local (RF-D04)
    const decodeDurationMs = Math.max(24, Date.now() - startPerf);
    const gradeRecord: ClassroomGradeRecord = {
      transactionId: payload.tx,
      studentId: payload.id,
      studentName: payload.n,
      grade: payload.g,
      subject: payload.m,
      scorePercentage: payload.s,
      scannedAtIso: new Date().toISOString(),
      missionTimestamp: payload.ts,
      signatureHash: payload.sig,
      decodeTimeMs: decodeDurationMs,
    };

    await this.teacherRepository.insertGradeRecord(gradeRecord);

    // 5. Toma automática de Asistencia Escolar (PRESENTE vía QR_OPTICO)
    await this.attendanceRepository.markStudentAttendance({
      student: {
        id: payload.id,
        name: payload.n,
        grade: payload.g,
        vereda: 'Vereda Escolar',
        avatarEmoji: '🧑🏽‍🎓',
      },
      status: 'PRESENTE',
      source: 'QR_OPTICO',
      teacherName: activeTeacherName,
    });

    // 6. Disparo simultáneo de confirmación auditiva («¡Pip!») y vibración háptica (RF-D03)
    await this.feedbackService.triggerSuccessAlert();

    return {
      success: true,
      statusCode: 'VERIFIED_AND_SAVED',
      message: `Nota de ${payload.n} (${payload.s}% en ${payload.m}) y Asistencia registradas — Firma verificada`,
      decodeDurationMs,
      record: gradeRecord,
    };
  }
}
