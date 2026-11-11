/**
 * @file src/presentation/components/student/StudentHomeMissionsView.tsx
 * @description Vista de Inicio y Tarjetas de Misión del Estudiante inspirada en:
 *  - design/style-mockups.jpeg (Tarjeta destacada amarilla "Misión de Matemáticas" + píldora verde "Modo sin conexión").
 *  - design/mockups.jpeg (Wireframe 1: Lista de tarjetas de misión accesibles offline).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LearningMission } from '../../../domain/entities/StudentMission';
import { SOLAR_COLORS } from '../../theme/colors';

interface StudentHomeMissionsViewProps {
  missions: LearningMission[];
  selectedMission: LearningMission;
  onSelectAndStartMission: (missionId: string) => void;
}

export const StudentHomeMissionsView: React.FC<
  StudentHomeMissionsViewProps
> = ({ missions, selectedMission, onSelectAndStartMission }) => {
  return (
    <View style={styles.container}>
      {/* Tarjeta Hero estilo Anexo M1 (design/style-mockups.jpeg) */}
      <Pressable
        onPress={() => onSelectAndStartMission(selectedMission.id)}
        style={[
          styles.heroMissionCard,
          { backgroundColor: selectedMission.cardAccentColor || '#FBC02D' },
        ]}
        accessibilityRole="button"
      >
        <View style={styles.heroIllustrationCircle}>
          <Text style={styles.heroEmoji}>{selectedMission.iconEmoji}</Text>
        </View>
        <Text style={styles.heroTitle}>{selectedMission.title}</Text>
        <Text style={styles.heroSub}>
          Grado {selectedMission.grade} • {selectedMission.estimatedMinutes} min
          • 3 Preguntas (A-D)
        </Text>
        <View style={styles.heroStartBadge}>
          <Text style={styles.heroStartBadgeText}>
            ▶ Toca para iniciar cápsula
          </Text>
        </View>
      </Pressable>

      {/* Píldora verde "Modo sin conexión" idéntica a design/style-mockups.jpeg */}
      <View style={styles.offlinePillWrapper}>
        <View style={styles.offlineGreenPill}>
          <Text style={styles.offlineGreenPillText}>
            📶 Modo sin conexión • Guardado Local SQLite
          </Text>
        </View>
      </View>

      {/* Lista de tarjetas de Materias Básicas (Wireframe 1 de design/mockups.jpeg) */}
      <Text style={styles.sectionTitle}>
        📚 Materias Básicas Disponibles Offline:
      </Text>

      <View style={styles.missionList}>
        {missions.map((mission, idx) => {
          const isCurrent = mission.id === selectedMission.id;
          return (
            <Pressable
              key={mission.id}
              onPress={() => onSelectAndStartMission(mission.id)}
              style={[
                styles.missionRowCard,
                isCurrent && styles.missionRowCardActive,
              ]}
              accessibilityRole="button"
            >
              <View
                style={[
                  styles.missionIconBox,
                  { backgroundColor: mission.cardAccentColor },
                ]}
              >
                <Text style={styles.missionIconEmoji}>{mission.iconEmoji}</Text>
              </View>

              <View style={styles.missionInfoCol}>
                <Text style={styles.missionRowTitle}>
                  Misión {idx + 1}: {mission.subject}
                </Text>
                <Text style={styles.missionRowStd} numberOfLines={2}>
                  {mission.competencyStandard}
                </Text>
              </View>

              <View style={styles.playArrowBox}>
                <Text style={styles.playArrowText}>Ir →</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  heroMissionCard: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: SOLAR_COLORS.navyPrimary,
    marginBottom: 10,
  },
  heroIllustrationCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 2.5,
    borderColor: SOLAR_COLORS.navyPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroEmoji: {
    fontSize: 34,
  },
  heroTitle: {
    color: SOLAR_COLORS.navyDark,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  heroSub: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  heroStartBadge: {
    marginTop: 10,
    backgroundColor: SOLAR_COLORS.navyPrimary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  heroStartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  offlinePillWrapper: {
    alignItems: 'center',
    marginBottom: 14,
  },
  offlineGreenPill: {
    backgroundColor: SOLAR_COLORS.appleGreen,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  offlineGreenPillText: {
    color: SOLAR_COLORS.textOnGreen,
    fontSize: 12,
    fontWeight: '800',
  },
  sectionTitle: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  missionList: {
    gap: 8,
  },
  missionRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.borderStrong,
    gap: 10,
  },
  missionRowCardActive: {
    borderColor: SOLAR_COLORS.navyPrimary,
    borderWidth: 2,
    backgroundColor: '#F0F9FF',
  },
  missionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  missionIconEmoji: {
    fontSize: 22,
  },
  missionInfoCol: {
    flex: 1,
  },
  missionRowTitle: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  missionRowStd: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  playArrowBox: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  playArrowText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
