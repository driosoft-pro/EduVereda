/**
 * @file src/domain/services/IFeedbackService.ts
 * @description Contrato de Dominio para la Retroalimentación Multisensorial
 * en Aula (RF-D03): Alerta auditiva «¡Pip!» y Vibración Háptica.
 */

export interface IFeedbackService {
  /**
   * Dispara de forma simultánea el tono claro "¡Pip!" (880 Hz) y el pulso
   * de vibración háptica (200 ms) al registrar exitosamente una calificación.
   */
  triggerSuccessAlert(): Promise<void>;

  /**
   * Dispara un tono grave de advertencia y doble vibración corta cuando
   * se detecta un QR adulterado o duplicado (Anti-Replay).
   */
  triggerErrorAlert(): Promise<void>;
}
