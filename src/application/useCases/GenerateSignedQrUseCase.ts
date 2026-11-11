/**
 * @file src/application/useCases/GenerateSignedQrUseCase.ts
 * @description Caso de Uso de Aplicación: Generación de Código QR Dinámico Firmado (RF-E06).
 *
 * Comprime el registro académico (ID estudiante, nombre, grado, materia, calificación,
 * timestamp y nonce único) y genera una firma criptográfica HMAC-SHA256 local.
 */

import { StudentMissionProgress } from '../../domain/entities/StudentMission';
import { VeredaSyncQrPayload } from '../../domain/entities/GradeRecord';
import { ISecurityService } from '../../domain/services/ISecurityService';
import { IStudentRepository } from '../../domain/repositories/IStudentRepository';

export interface GeneratedQrOutput {
  payload: VeredaSyncQrPayload;
  serializedJson: string;
}

export class GenerateSignedQrUseCase {
  constructor(
    private readonly securityService: ISecurityService,
    private readonly studentRepository: IStudentRepository
  ) {}

  /**
   * Genera un payload VeredaSync v1 firmado con HMAC-SHA256 listo para renderizar en QR.
   */
  async execute(progress: StudentMissionProgress): Promise<GeneratedQrOutput> {
    const transactionNonce =
      progress.lastTransactionId ??
      (await this.securityService.generateTransactionNonce());

    const timestampSeconds = Math.floor(Date.now() / 1000);

    const unsignedPayload = {
      v: 1,
      tx: transactionNonce,
      id: progress.studentId,
      n: progress.studentName,
      g: progress.grade,
      m: progress.subject,
      s: progress.scorePercentage,
      ts: timestampSeconds,
    };

    const signature = await this.securityService.signPayload(unsignedPayload);

    const signedPayload: VeredaSyncQrPayload = {
      ...unsignedPayload,
      sig: signature,
    };

    // Guarda el transactionId asociado al progreso del estudiante
    if (!progress.lastTransactionId) {
      await this.studentRepository.saveProgress({
        ...progress,
        lastTransactionId: transactionNonce,
      });
    }

    return {
      payload: signedPayload,
      serializedJson: JSON.stringify(signedPayload),
    };
  }
}
