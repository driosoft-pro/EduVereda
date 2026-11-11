/**
 * @file src/domain/services/ISecurityService.ts
 * @description Contrato de Dominio para Criptografía Offline, Firma HMAC-SHA256,
 * Validación de Esquema Zero-Trust y Sanitización CSV (Sección 5.2 y 5.3).
 */

import { VeredaSyncQrPayload } from '../entities/GradeRecord';

export type PayloadUnsigned = Omit<VeredaSyncQrPayload, 'sig'>;

export interface SchemaValidationOutcome {
  isValid: boolean;
  errorReason?: string;
  payload?: VeredaSyncQrPayload;
}

export interface ISecurityService {
  /**
   * Genera un identificador único de transacción (nonce corto) usando entropía criptográfica.
   */
  generateTransactionNonce(): Promise<string>;

  /**
   * Calcula la firma criptográfica HMAC-SHA256 sobre la cadena canónica
   * v|tx|id|n|g|m|s|ts utilizando la llave secreta local del aula.
   */
  signPayload(unsignedPayload: PayloadUnsigned): Promise<string>;

  /**
   * Verifica en tiempo constante si la firma incluida en el QR coincide
   * exactamente con el contenido del payload recibido.
   */
  verifyPayloadSignature(payload: VeredaSyncQrPayload): Promise<boolean>;

  /**
   * Valida bajo enfoque Zero-Trust la cadena JSON cruda leída por la cámara
   * comprobando tipos, longitudes máximas y rango de nota (0..100).
   */
  parseAndValidateQrJson(rawQrString: string): SchemaValidationOutcome;

  /**
   * Neutraliza prefijos peligrosos (=, +, -, @, \t, \r) para prevenir ataques
   * de Inyección de Fórmulas CSV al abrir el archivo en hojas de cálculo.
   */
  sanitizeCsvCell(value: string | number): string;
}
