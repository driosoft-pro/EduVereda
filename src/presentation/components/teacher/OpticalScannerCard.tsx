/**
 * @file src/presentation/components/teacher/OpticalScannerCard.tsx
 * @description Componente de Interfaz para Captura y Lectura Óptica de la Docente:
 *  - RF-D01: Visor de escaneo óptico con marco de enfoque para códigos QR.
 *  - RF-D02: Decodificación asincrónica veloz (< 1.8 a 2.4 segundos) sin red.
 *  - RF-D03: Confirmación simultánea visual, auditiva («¡Pip!») y vibración háptica.
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { QrScanVerificationResult } from '../../../domain/entities/GradeRecord';
import { SOLAR_COLORS } from '../../theme/colors';

interface OpticalScannerCardProps {
  activeQrJsonFromStudent: string | null;
  lastScanResult: QrScanVerificationResult | null;
  onScanQrString: (rawQr: string) => Promise<QrScanVerificationResult>;
  onSimulateTamperedScan: () => Promise<void>;
}

export const OpticalScannerCard: React.FC<OpticalScannerCardProps> = ({
  activeQrJsonFromStudent,
  lastScanResult,
  onScanQrString,
  onSimulateTamperedScan,
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [manualJsonInput, setManualJsonInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleToggleCamera = async () => {
    if (!cameraActive && !permission?.granted) {
      await requestPermission();
    }
    setCameraActive((prev) => !prev);
  };

  return (
    <View style={styles.scannerCard}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionTag}>
            RF-D01 / RF-D02 • Lector Óptico Offline (&lt; 1.8s)
          </Text>
          <Text style={styles.scannerTitle}>
            Visor de Escaneo Óptico VeredaSync
          </Text>
        </View>

        <Pressable
          onPress={() => void handleToggleCamera()}
          style={[
            styles.cameraToggleBtn,
            cameraActive && styles.cameraToggleBtnActive,
          ]}
        >
          <Text style={styles.cameraToggleBtnText}>
            {cameraActive ? '⏹ Detener Cámara' : '📷 Activar Cámara Real'}
          </Text>
        </Pressable>
      </View>

      {/* Marco de enfoque óptico (Cámara en vivo o Simulador de Aula) */}
      <View style={styles.viewfinderFrame}>
        {cameraActive && permission?.granted ? (
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.cameraPreview}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={(event) => {
                if (event.data) {
                  setCameraActive(false);
                  void onScanQrString(event.data);
                }
              }}
            />
            <View style={styles.reticleOverlay}>
              <Text style={styles.reticleText}>
                Apunta al Código QR del Estudiante
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.simulatedViewfinder}>
            <View style={styles.corner} />
            <Text style={styles.viewfinderIcon}>🎯</Text>
            <Text style={styles.viewfinderStatusText}>
              {activeQrJsonFromStudent
                ? 'Código QR detectado en el teléfono del estudiante listo para lectura óptica'
                : 'Esperando que el estudiante genere su Código QR o activa la cámara'}
            </Text>
            <Text style={styles.viewfinderSubtext}>
              0% Tráfico de Red • Validación Local HMAC-SHA256 + Anti-Replay
            </Text>
          </View>
        )}
      </View>

      {/* Botones de captura rápida y pruebas de seguridad criptográfica */}
      <View style={styles.actionsGrid}>
        <Pressable
          disabled={!activeQrJsonFromStudent}
          onPress={() => {
            if (activeQrJsonFromStudent) {
              void onScanQrString(activeQrJsonFromStudent);
            }
          }}
          style={[
            styles.primaryScanBtn,
            !activeQrJsonFromStudent && styles.primaryScanBtnDisabled,
          ]}
        >
          <Text style={styles.primaryScanBtnText}>
            ⚡ Escanear QR del Estudiante Ahora (Dispara «¡Pip!» + Vibración)
          </Text>
        </Pressable>

        <View style={styles.securityTestsRow}>
          <Pressable
            onPress={() => void onSimulateTamperedScan()}
            style={styles.securityTestBtn}
          >
            <Text style={styles.securityTestBtnText}>
              🛡️ Probar QR Adulterado (Fallo HMAC)
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setShowManualInput((prev) => !prev)}
            style={styles.manualToggleBtn}
          >
            <Text style={styles.manualToggleBtnText}>
              {showManualInput ? 'Ocultar JSON Manual' : '⌨️ Pegar Payload QR'}
            </Text>
          </Pressable>
        </View>
      </View>

      {showManualInput ? (
        <View style={styles.manualBox}>
          <TextInput
            value={manualJsonInput}
            onChangeText={setManualJsonInput}
            placeholder='{"v":1,"tx":"...","id":"EST-104","s":100,"sig":"..."}'
            style={styles.jsonInput}
            multiline
          />
          <Pressable
            onPress={() => void onScanQrString(manualJsonInput)}
            style={styles.verifyManualBtn}
          >
            <Text style={styles.verifyManualBtnText}>
              Verificar y Decodificar JSON
            </Text>
          </Pressable>
        </View>
      ) : null}

      {/* RF-D03: Notificación Multisensorial Visual, Auditiva y Háptica */}
      {lastScanResult ? (
        <View
          style={[
            styles.alertBanner,
            lastScanResult.success
              ? styles.alertBannerSuccess
              : styles.alertBannerError,
          ]}
        >
          <View style={styles.alertHeaderRow}>
            <Text
              style={[
                styles.alertStatusBadge,
                lastScanResult.success
                  ? styles.alertStatusBadgeOk
                  : styles.alertStatusBadgeErr,
              ]}
            >
              {lastScanResult.success
                ? '🔊 ¡PIP! (880 Hz) + 📳 VIBRACIÓN 200ms'
                : `⛔ BLOQUEO: ${lastScanResult.statusCode}`}
            </Text>
            <Text style={styles.decodeTimeBadge}>
              ⏱ Decodificado en {lastScanResult.decodeDurationMs} ms (&lt; 1.8s)
            </Text>
          </View>
          <Text
            style={[
              styles.alertMessageText,
              lastScanResult.success
                ? styles.alertMessageSuccess
                : styles.alertMessageError,
            ]}
          >
            {lastScanResult.message}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  scannerCard: {
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: SOLAR_COLORS.navyPrimary,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  sectionTag: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  scannerTitle: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  cameraToggleBtn: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cameraToggleBtnActive: {
    backgroundColor: SOLAR_COLORS.dangerBorder,
  },
  cameraToggleBtnText: {
    color: SOLAR_COLORS.textOnNavy,
    fontSize: 12,
    fontWeight: '800',
  },
  viewfinderFrame: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: SOLAR_COLORS.appleGreen,
    marginBottom: 10,
  },
  cameraContainer: {
    height: 210,
    position: 'relative',
  },
  cameraPreview: {
    flex: 1,
  },
  reticleOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  reticleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  simulatedViewfinder: {
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    width: 24,
    height: 4,
    backgroundColor: SOLAR_COLORS.appleGreen,
    marginBottom: 6,
    borderRadius: 2,
  },
  viewfinderIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  viewfinderStatusText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  viewfinderSubtext: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  actionsGrid: {
    gap: 8,
  },
  primaryScanBtn: {
    backgroundColor: SOLAR_COLORS.appleGreen,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: SOLAR_COLORS.navyPrimary,
    alignItems: 'center',
  },
  primaryScanBtnDisabled: {
    backgroundColor: '#CBD5E1',
    borderColor: '#94A3B8',
  },
  primaryScanBtnText: {
    color: SOLAR_COLORS.textOnGreen,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },
  securityTestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  securityTestBtn: {
    flex: 1,
    minWidth: 160,
    backgroundColor: SOLAR_COLORS.dangerBg,
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.dangerBorder,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  securityTestBtnText: {
    color: SOLAR_COLORS.dangerText,
    fontSize: 12,
    fontWeight: '800',
  },
  manualToggleBtn: {
    backgroundColor: SOLAR_COLORS.navyLight,
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.navyPrimary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  manualToggleBtnText: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  manualBox: {
    marginTop: 8,
    backgroundColor: SOLAR_COLORS.surfaceMuted,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: SOLAR_COLORS.borderStrong,
    gap: 8,
  },
  jsonInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: SOLAR_COLORS.borderStrong,
    borderRadius: 6,
    padding: 8,
    fontSize: 12,
    fontFamily: 'monospace',
    minHeight: 54,
  },
  verifyManualBtn: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  verifyManualBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  alertBanner: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
  },
  alertBannerSuccess: {
    backgroundColor: SOLAR_COLORS.successBg,
    borderColor: SOLAR_COLORS.successBorder,
  },
  alertBannerError: {
    backgroundColor: SOLAR_COLORS.dangerBg,
    borderColor: SOLAR_COLORS.dangerBorder,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  alertStatusBadge: {
    fontSize: 11,
    fontWeight: '900',
  },
  alertStatusBadgeOk: {
    color: SOLAR_COLORS.successText,
  },
  alertStatusBadgeErr: {
    color: SOLAR_COLORS.dangerText,
  },
  decodeTimeBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: SOLAR_COLORS.navyPrimary,
  },
  alertMessageText: {
    fontSize: 13,
    fontWeight: '800',
  },
  alertMessageSuccess: {
    color: SOLAR_COLORS.successText,
  },
  alertMessageError: {
    color: SOLAR_COLORS.dangerText,
  },
});
