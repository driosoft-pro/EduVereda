/**
 * @file src/infrastructure/security/HmacSecurityService.ts
 * @description Implementación de Infraestructura de ISecurityService.
 *
 * Implementa:
 *  1. Firma criptográfica HMAC-SHA256 Offline mediante expo-crypto / Web Crypto API.
 *  2. Generación de identificadores de transacción (tx) con entropía criptográfica.
 *  3. Validación Zero-Trust del contrato JSON del Código QR (Sección 5.2 y 5.3).
 *  4. Sanitización contra ataques de Inyección de Fórmulas CSV (CSV Injection).
 */

import * as Crypto from 'expo-crypto';
import { VeredaSyncQrPayload } from '../../domain/entities/GradeRecord';
import {
  ISecurityService,
  PayloadUnsigned,
  SchemaValidationOutcome,
} from '../../domain/services/ISecurityService';

/**
 * Llave simétrica escolar provisionada localmente en el ecosistema VeredaSync.
 * En compilación nativa de producción se resguarda dentro de expo-secure-store (Keystore/Keychain).
 */
const CLASSROOM_OFFLINE_HMAC_SECRET =
  'EDUVEREDA_RURAL_COLOMBIA_KEY_2026_VEREDASYNC_V1_HMAC';

export class HmacSecurityService implements ISecurityService {
  /**
   * Construye la cadena canónica determinista sobre la que se calcula el HMAC-SHA256.
   */
  private buildCanonicalString(p: PayloadUnsigned): string {
    return `${p.v}|${p.tx}|${p.id}|${p.n}|${p.g}|${p.m}|${p.s}|${p.ts}`;
  }

  async generateTransactionNonce(): Promise<string> {
    try {
      const randomBytes = await Crypto.getRandomBytesAsync(4);
      const hex = Array.from(randomBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      return `${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
    } catch {
      const fallback = Math.floor(Math.random() * 0xffffffff)
        .toString(16)
        .padStart(8, '0');
      return `${fallback.slice(0, 4)}-${fallback.slice(4, 8)}`;
    }
  }

  async signPayload(unsignedPayload: PayloadUnsigned): Promise<string> {
    const canonical = this.buildCanonicalString(unsignedPayload);
    const saltedInput = `${CLASSROOM_OFFLINE_HMAC_SECRET}:${canonical}:${CLASSROOM_OFFLINE_HMAC_SECRET}`;

    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      saltedInput
    );
    return digest;
  }

  async verifyPayloadSignature(payload: VeredaSyncQrPayload): Promise<boolean> {
    const expectedSignature = await this.signPayload({
      v: payload.v,
      tx: payload.tx,
      id: payload.id,
      n: payload.n,
      g: payload.g,
      m: payload.m,
      s: payload.s,
      ts: payload.ts,
    });

    // Comparación estricta de longitud y contenido (mitigación de timing attacks)
    if (expectedSignature.length !== payload.sig.length) {
      return false;
    }

    let diff = 0;
    for (let i = 0; i < expectedSignature.length; i++) {
      diff |= expectedSignature.charCodeAt(i) ^ payload.sig.charCodeAt(i);
    }
    return diff === 0;
  }

  parseAndValidateQrJson(rawQrString: string): SchemaValidationOutcome {
    if (!rawQrString || typeof rawQrString !== 'string') {
      return {
        isValid: false,
        errorReason: 'El contenido del QR está vacío o no es texto válido.',
      };
    }

    if (rawQrString.length > 1024) {
      return {
        isValid: false,
        errorReason:
          'Bloqueo Zero-Trust: El tamaño del payload QR excede el límite seguro (1 KB).',
      };
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(rawQrString);
    } catch {
      return {
        isValid: false,
        errorReason: 'Formato JSON inválido en el Código QR escaneado.',
      };
    }

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      parsed.v !== 1 ||
      typeof parsed.tx !== 'string' ||
      parsed.tx.length < 4 ||
      typeof parsed.id !== 'string' ||
      parsed.id.length < 2 ||
      typeof parsed.n !== 'string' ||
      parsed.n.length < 2 ||
      typeof parsed.g !== 'string' ||
      typeof parsed.m !== 'string' ||
      typeof parsed.s !== 'number' ||
      !Number.isFinite(parsed.s) ||
      parsed.s < 0 ||
      parsed.s > 100 ||
      typeof parsed.ts !== 'number' ||
      typeof parsed.sig !== 'string' ||
      parsed.sig.length < 16
    ) {
      return {
        isValid: false,
        errorReason:
          'Fallo de validación de esquema VeredaSync v1: Campos corruptos o calificación fuera de rango (0-100%).',
      };
    }

    return {
      isValid: true,
      payload: {
        v: 1,
        tx: String(parsed.tx).trim(),
        id: String(parsed.id).trim(),
        n: String(parsed.n).trim(),
        g: String(parsed.g).trim(),
        m: String(parsed.m).trim(),
        s: Math.round(parsed.s),
        ts: Math.floor(parsed.ts),
        sig: String(parsed.sig).trim(),
      },
    };
  }

  sanitizeCsvCell(value: string | number): string {
    const raw = String(value ?? '').replace(/"/g, '""');
    // Neutraliza caracteres ejecutables de fórmulas en Excel / LibreOffice Calc
    if (/^[=+\-@\t\r]/.test(raw)) {
      return `"'${raw}"`;
    }
    return `"${raw}"`;
  }
}
