/**
 * @file src/presentation/components/student/AchievementQrCard.tsx
 * @description Componente de Interfaz para la Sincronización Óptica del Estudiante:
 *  - RF-E05 (Tarjeta de Logro): «¡Misión Cumplida! - Progreso Seguro en Memoria»
 *  - RF-E06 (Generación de QR Dinámico): Botón ampliado de 60 píxeles en color
 *    verde manzana (#7CB342) con la instrucción explícita «Toca aquí para mostrar a tu profe».
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { VeredaSyncQrPayload } from '../../../domain/entities/GradeRecord';
import { StudentMissionProgress } from '../../../domain/entities/StudentMission';
import { SOLAR_COLORS } from '../../theme/colors';

interface AchievementQrCardProps {
  progress: StudentMissionProgress;
  qrPayload: VeredaSyncQrPayload | null;
  qrJson: string | null;
  canSendToTeacherBridge: boolean;
  onGenerateQr: () => Promise<void>;
  onSendToTeacherScanner: (rawQr: string) => Promise<void>;
  onRepeatMission: () => Promise<void>;
}

export const AchievementQrCard: React.FC<AchievementQrCardProps> = ({
  progress,
  qrPayload,
  qrJson,
  canSendToTeacherBridge,
  onGenerateQr,
  onSendToTeacherScanner,
  onRepeatMission,
}) => {
  return (
    <View style={styles.achievementCard}>
      {/* RF-E05: Tarjeta destacada de logro */}
      <View style={styles.trophyBanner}>
        <Text style={styles.trophyEmoji}>🏆</Text>
        <Text style={styles.achievementTitle}>
          ¡Misión Cumplida! - Progreso Seguro en Memoria
        </Text>
        <Text style={styles.scoreSummary}>
          Estudiante: {progress.studentName} ({progress.grade}) • Nota:{' '}
          {progress.scorePercentage}% en {progress.subject}
        </Text>
      </View>

      {/* RF-E06: Botón ampliado de 60 píxeles en color verde manzana (#7CB342) */}
      <Pressable
        onPress={() => void onGenerateQr()}
        style={styles.appleGreenButton60px}
        accessibilityRole="button"
        accessibilityLabel="Toca aquí para mostrar a tu profe"
      >
        <Text style={styles.appleGreenButtonText}>
          📲 Toca aquí para mostrar a tu profe
        </Text>
      </Pressable>

      {/* Código QR Dinámico de alta densidad con firma HMAC-SHA256 */}
      {qrPayload && qrJson ? (
        <View style={styles.qrDisplayBox}>
          <Text style={styles.qrHeaderLabel}>
            Código QR Dinámico VeredaSync v1 (Firmado HMAC-SHA256)
          </Text>

          <View style={styles.qrCanvasWrapper}>
            <QRCode
              value={qrJson}
              size={185}
              color="#0F172A"
              backgroundColor="#FFFFFF"
              ecl="M"
            />
          </View>

          <View style={styles.metaGrid}>
            <Text style={styles.metaLine}>
              🔒 Nonce Anti-Replay (tx):{' '}
              <Text style={styles.metaMono}>{qrPayload.tx}</Text>
            </Text>
            <Text style={styles.metaLine}>
              ✍️ Firma HMAC-SHA256:{' '}
              <Text style={styles.metaMono}>
                {qrPayload.sig.slice(0, 20)}...
              </Text>
            </Text>
          </View>

          {canSendToTeacherBridge ? (
            <Pressable
              onPress={() => void onSendToTeacherScanner(qrJson)}
              style={styles.opticalBridgeButton}
              accessibilityRole="button"
            >
              <Text style={styles.opticalBridgeButtonText}>
                📷 Simular Lectura Óptica en Tableta de la Docente →
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <Text style={styles.helperInstruction}>
          Presiona el botón verde manzana de 60px para comprimir y firmar tu
          calificación en un Código QR sin usar internet.
        </Text>
      )}

      <Pressable
        onPress={() => void onRepeatMission()}
        style={styles.repeatButton}
      >
        <Text style={styles.repeatButtonText}>
          ↺ Reiniciar cápsula para otra prueba
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  achievementCard: {
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    borderRadius: 12,
    padding: 14,
    borderWidth: 2.5,
    borderColor: SOLAR_COLORS.appleGreenDark,
    marginBottom: 12,
  },
  trophyBanner: {
    backgroundColor: SOLAR_COLORS.appleGreenSurface,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.appleGreen,
    marginBottom: 12,
  },
  trophyEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  achievementTitle: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  scoreSummary: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  appleGreenButton60px: {
    minHeight: 60,
    backgroundColor: SOLAR_COLORS.appleGreen,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: SOLAR_COLORS.navyPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
  },
  appleGreenButtonText: {
    color: SOLAR_COLORS.textOnGreen,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  qrDisplayBox: {
    alignItems: 'center',
    backgroundColor: SOLAR_COLORS.surfaceMuted,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: SOLAR_COLORS.borderStrong,
  },
  qrHeaderLabel: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  qrCanvasWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: SOLAR_COLORS.navyPrimary,
    marginBottom: 10,
  },
  metaGrid: {
    width: '100%',
    backgroundColor: SOLAR_COLORS.navyLight,
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
    gap: 3,
  },
  metaLine: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  metaMono: {
    fontFamily: 'monospace',
    color: SOLAR_COLORS.navyPrimary,
  },
  opticalBridgeButton: {
    width: '100%',
    backgroundColor: SOLAR_COLORS.navyPrimary,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  opticalBridgeButtonText: {
    color: SOLAR_COLORS.textOnNavy,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  helperInstruction: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  repeatButton: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 6,
  },
  repeatButtonText: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
