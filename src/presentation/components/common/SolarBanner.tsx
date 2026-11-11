/**
 * @file src/presentation/components/common/SolarBanner.tsx
 * @description Componente de Interfaz para el Requerimiento RF-E02:
 * Banner permanente en la parte superior en color azul marino (#1B365D) con el
 * texto explícito «Progreso Seguro en SQLite», diseñado para garantizar
 * legibilidad bajo luz solar directa (WCAG AAA).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SOLAR_COLORS } from '../../theme/colors';

interface SolarBannerProps {
  subtitle?: string;
}

export const SolarBanner: React.FC<SolarBannerProps> = ({ subtitle }) => {
  return (
    <View style={styles.bannerContainer} accessibilityRole="header">
      <View style={styles.statusRow}>
        <View style={styles.ledIndicator} />
        <Text style={styles.bannerTitle}>Progreso Seguro en SQLite</Text>
      </View>
      {subtitle ? <Text style={styles.bannerSubtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: SOLAR_COLORS.appleGreen,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ledIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: SOLAR_COLORS.appleGreen,
  },
  bannerTitle: {
    color: SOLAR_COLORS.textOnNavy,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  bannerSubtitle: {
    color: '#DBEAFE',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 3,
  },
});
