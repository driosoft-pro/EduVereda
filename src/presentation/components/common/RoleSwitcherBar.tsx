/**
 * @file src/presentation/components/common/RoleSwitcherBar.tsx
 * @description Barra Superior de Control de los 4 Roles del Sistema EduVereda:
 *  1. SPLIT_DEMO: Vista Doble (Estudiante + Docente en simultáneo).
 *  2. STUDENT: Rol Estudiante (EduVereda App).
 *  3. TEACHER: Rol Docente (VeredaSync - Notas y Asistencia).
 *  4. ADMIN: Rol Administrador (CRUD de Estudiantes y Maestros en SQLite).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SystemRole } from '../../../domain/entities/Role';
import { useAppContainer } from '../../context/AppContainerContext';
import { SOLAR_COLORS } from '../../theme/colors';

const ROLE_OPTIONS: { id: SystemRole; title: string; shortDesc: string }[] = [
  {
    id: 'SPLIT_DEMO',
    title: '📱+📟 Vista Doble (Demo)',
    shortDesc: 'Estudiante + Docente',
  },
  {
    id: 'STUDENT',
    title: '👦🏽 Rol Estudiante',
    shortDesc: 'Misiones + QR (Módulo A)',
  },
  {
    id: 'TEACHER',
    title: '👩‍🏫 Rol Docente',
    shortDesc: 'Escáner + Asistencia (Módulo B)',
  },
  {
    id: 'ADMIN',
    title: '⚙️ Rol Administrador',
    shortDesc: 'CRUD Alumnos y Maestros',
  },
];

export const RoleSwitcherBar: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    rolePermission,
    studentsRoster,
    teachersRoster,
  } = useAppContainer();

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.topRow}>
        <View style={styles.brandBlock}>
          <Text style={styles.brandTitle}>
            🌱 EduVereda — Ecosistema Escolar Offline-First
          </Text>
          <Text style={styles.brandSubtitle}>
            React Native + Expo Web • SQLite Local • {studentsRoster.length}{' '}
            Estudiantes • {teachersRoster.length} Maestros
          </Text>
        </View>

        <View style={styles.securityBadges}>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>🔒 100% OFFLINE ($0 COP)</Text>
          </View>
          <View style={[styles.badgePill, styles.badgeHmac]}>
            <Text style={styles.badgeText}>HMAC-SHA256 + Anti-Replay</Text>
          </View>
        </View>
      </View>

      <View style={styles.rolesRow}>
        {ROLE_OPTIONS.map((option) => {
          const isSelected = activeRole === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => setActiveRole(option.id)}
              style={[styles.roleTab, isSelected && styles.roleTabSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[
                  styles.roleTabTitle,
                  isSelected && styles.roleTabTitleSelected,
                ]}
              >
                {option.title}
              </Text>
              <Text
                style={[
                  styles.roleTabDesc,
                  isSelected && styles.roleTabDescSelected,
                ]}
              >
                {option.shortDesc}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.permissionNotice}>
        <Text style={styles.permissionBadge}>{rolePermission.badgeText}</Text>
        <Text style={styles.permissionText}>{rolePermission.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: SOLAR_COLORS.navyDark,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: SOLAR_COLORS.appleGreen,
  },
  topRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  brandBlock: {
    flexShrink: 1,
  },
  brandTitle: {
    color: SOLAR_COLORS.textOnNavy,
    fontSize: 17,
    fontWeight: '800',
  },
  brandSubtitle: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 2,
  },
  securityBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badgePill: {
    backgroundColor: '#1E3A8A',
    borderWidth: 1,
    borderColor: '#60A5FA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeHmac: {
    backgroundColor: '#14532D',
    borderColor: SOLAR_COLORS.appleGreen,
  },
  badgeText: {
    color: SOLAR_COLORS.textOnNavy,
    fontSize: 10,
    fontWeight: '700',
  },
  rolesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  roleTab: {
    flex: 1,
    minWidth: 140,
    backgroundColor: SOLAR_COLORS.navyPrimary,
    borderWidth: 1.5,
    borderColor: '#475569',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  roleTabSelected: {
    backgroundColor: SOLAR_COLORS.appleGreen,
    borderColor: '#FFFFFF',
  },
  roleTabTitle: {
    color: SOLAR_COLORS.textOnNavy,
    fontSize: 12,
    fontWeight: '800',
  },
  roleTabTitleSelected: {
    color: SOLAR_COLORS.textOnGreen,
  },
  roleTabDesc: {
    color: '#CBD5E1',
    fontSize: 10,
    marginTop: 1,
  },
  roleTabDescSelected: {
    color: '#1A2E05',
    fontWeight: '700',
  },
  permissionNotice: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    backgroundColor: '#172554',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  permissionBadge: {
    backgroundColor: SOLAR_COLORS.appleGreen,
    color: SOLAR_COLORS.textOnGreen,
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  permissionText: {
    color: '#E2E8F0',
    fontSize: 11,
    flex: 1,
  },
});
