/**
 * @file src/presentation/components/student/SqliteSavedPopupModal.tsx
 * @description Ventana emergente de confirmación de guardado local inspirada en el
 * Wireframe 3 de design/mockups.jpeg:
 *  "Aviso: Progreso guardado en memoria local SQLite [Aceptar]"
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SOLAR_COLORS } from '../../theme/colors';

interface SqliteSavedPopupModalProps {
  visible: boolean;
  studentName: string;
  subject: string;
  scorePercentage: number;
  onAccept: () => void;
}

export const SqliteSavedPopupModal: React.FC<SqliteSavedPopupModalProps> = ({
  visible,
  studentName,
  subject,
  scorePercentage,
  onAccept,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlayBox}>
      <View style={styles.popupCard}>
        <Text style={styles.popupLockIcon}>🔒</Text>
        <Text style={styles.popupTitle}>Aviso</Text>
        <Text style={styles.popupMessage}>
          Progreso guardado en memoria local SQLite
        </Text>
        <Text style={styles.popupDetails}>
          {studentName} • {subject} ({scorePercentage}%)
        </Text>

        <Pressable
          onPress={onAccept}
          style={styles.acceptButton}
          accessibilityRole="button"
        >
          <Text style={styles.acceptButtonText}>Aceptar</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  popupLockIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  popupTitle: {
    color: SOLAR_COLORS.navyDark,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  popupMessage: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  popupDetails: {
    color: SOLAR_COLORS.appleGreenDark,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 14,
    textAlign: 'center',
  },
  acceptButton: {
    minWidth: 140,
    backgroundColor: SOLAR_COLORS.navyPrimary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
