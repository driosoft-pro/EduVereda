/**
 * @file src/presentation/screens/StudentScreen.tsx
 * @description Pantalla Principal del Módulo A: Simulador Estudiante (EduVereda App).
 *
 * Implementa el diseño de alta fidelidad de design/style-mockups.jpeg y design/mockups.jpeg:
 *  - Cabecera con nombre de la App, indicador "🔒 Guardado Local" y avatar del estudiante.
 *  - Banner #1B365D «Progreso Seguro en SQLite» (RF-E02).
 *  - Ventana emergente de confirmación de guardado SQLite (Wireframe 3).
 *  - Barra de navegación inferior de 4 pestañas: Inicio, Misiones, Progreso y Perfil.
 */

import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppContainer } from '../context/AppContainerContext';
import { SolarBanner } from '../components/common/SolarBanner';
import { StudentHomeMissionsView } from '../components/student/StudentHomeMissionsView';
import { MissionQuestionCard } from '../components/student/MissionQuestionCard';
import { AchievementQrCard } from '../components/student/AchievementQrCard';
import { SqliteSavedPopupModal } from '../components/student/SqliteSavedPopupModal';
import { SOLAR_COLORS } from '../theme/colors';

type StudentBottomTab = 'HOME' | 'MISSION' | 'PROGRESS' | 'PROFILE';

export const StudentScreen: React.FC = () => {
  const {
    rolePermission,
    studentsRoster,
    currentStudent,
    selectStudent,
    missionsCatalog,
    currentMission,
    selectMission,
    studentProgress,
    showSqliteSavedNotice,
    dismissSqliteSavedNotice,
    activeQrPayload,
    activeQrJson,
    answerQuestion,
    generateDynamicQr,
    resetCurrentMission,
    scanQrPayloadString,
  } = useAppContainer();

  const [activeTab, setActiveTab] = useState<StudentBottomTab>('HOME');
  const isCompleted = studentProgress?.isCompleted ?? false;

  const handleSelectAndStartMission = (missionId: string) => {
    selectMission(missionId);
    setActiveTab('MISSION');
  };

  return (
    <View style={styles.phoneDeviceFrame}>
      {/* Cabecera estilo Anexo M1 (design/style-mockups.jpeg) */}
      <View style={styles.phoneTopBar}>
        <View>
          <Text style={styles.appTitleText}>EduVereda App</Text>
          <View style={styles.studentAvatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmojiText}>
                {currentStudent.avatarEmoji}
              </Text>
            </View>
            <View>
              <Text style={styles.studentNameLabel}>{currentStudent.name}</Text>
              <Text style={styles.studentGradeLabel}>
                Grado {currentStudent.grade} • {currentStudent.vereda}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.localLockBadge}>
          <Text style={styles.localLockText}>🔒 Guardado Local</Text>
        </View>
      </View>

      {/* RF-E02: Banner permanente en color azul marino (#1B365D) */}
      <SolarBanner
        subtitle={`Materia activa: ${currentMission.subject} (${currentMission.iconEmoji})`}
      />

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Ventana emergente de confirmación SQLite (Wireframe 3 de design/mockups.jpeg) */}
        <SqliteSavedPopupModal
          visible={showSqliteSavedNotice}
          studentName={currentStudent.name}
          subject={currentMission.subject}
          scorePercentage={studentProgress?.scorePercentage ?? 0}
          onAccept={dismissSqliteSavedNotice}
        />

        {/* PESTAÑA 1: INICIO (Tarjetas de Materias Básicas Offline) */}
        {activeTab === 'HOME' ? (
          <StudentHomeMissionsView
            missions={missionsCatalog}
            selectedMission={currentMission}
            onSelectAndStartMission={handleSelectAndStartMission}
          />
        ) : null}

        {/* PESTAÑA 2: MISIONES (Interfaz de Juego de 4 opciones o QR al terminar) */}
        {activeTab === 'MISSION' ? (
          <>
            <View style={styles.subjectQuickSwitch}>
              {missionsCatalog.map((m) => {
                const active = m.id === currentMission.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => selectMission(m.id)}
                    style={[
                      styles.subjectChip,
                      active && styles.subjectChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.subjectChipText,
                        active && styles.subjectChipTextActive,
                      ]}
                    >
                      {m.iconEmoji} {m.subject}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {isCompleted && studentProgress ? (
              <AchievementQrCard
                progress={studentProgress}
                qrPayload={activeQrPayload}
                qrJson={activeQrJson}
                canSendToTeacherBridge={rolePermission.canScanQr}
                onGenerateQr={generateDynamicQr}
                onSendToTeacherScanner={async (rawQr) => {
                  await scanQrPayloadString(rawQr);
                }}
                onRepeatMission={resetCurrentMission}
              />
            ) : (
              <MissionQuestionCard
                mission={currentMission}
                progress={studentProgress}
                onSelectAnswer={answerQuestion}
              />
            )}
          </>
        ) : null}

        {/* PESTAÑA 3: PROGRESO Y ESCANEO DE ACCESO QR */}
        {activeTab === 'PROGRESS' ? (
          <View>
            {studentProgress ? (
              <AchievementQrCard
                progress={studentProgress}
                qrPayload={activeQrPayload}
                qrJson={activeQrJson}
                canSendToTeacherBridge={rolePermission.canScanQr}
                onGenerateQr={generateDynamicQr}
                onSendToTeacherScanner={async (rawQr) => {
                  await scanQrPayloadString(rawQr);
                }}
                onRepeatMission={resetCurrentMission}
              />
            ) : (
              <View style={styles.emptyStateBox}>
                <Text style={styles.emptyStateEmoji}>📊</Text>
                <Text style={styles.emptyStateTitle}>
                  Aún no has completado la misión de {currentMission.subject}
                </Text>
                <Pressable
                  onPress={() => setActiveTab('MISSION')}
                  style={styles.goMissionBtn}
                >
                  <Text style={styles.goMissionBtnText}>
                    Ir a responder preguntas →
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : null}

        {/* PESTAÑA 4: PERFIL DEL ESTUDIANTE (Selector de Alumno en Dispositivo Compartido) */}
        {activeTab === 'PROFILE' ? (
          <View style={styles.profileCard}>
            <Text style={styles.profileTitle}>
              👤 Cambiar Estudiante Activo (Teléfono Compartido)
            </Text>
            <Text style={styles.profileSub}>
              Selecciona tu perfil escolar registrado en la base de datos SQLite:
            </Text>

            <View style={styles.profileList}>
              {studentsRoster.map((st) => {
                const isSelected = st.id === currentStudent.id;
                return (
                  <Pressable
                    key={st.id}
                    onPress={() => {
                      selectStudent(st.id);
                      setActiveTab('HOME');
                    }}
                    style={[
                      styles.profileRow,
                      isSelected && styles.profileRowSelected,
                    ]}
                  >
                    <Text style={styles.profileRowEmoji}>{st.avatarEmoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.profileRowName}>
                        {st.name} ({st.id})
                      </Text>
                      <Text style={styles.profileRowMeta}>
                        Grado {st.grade} • {st.vereda}
                      </Text>
                    </View>
                    {isSelected ? (
                      <Text style={styles.activeCheck}>✅ Activo</Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Barra de Navegación Inferior idéntica a design/style-mockups.jpeg */}
      <View style={styles.bottomNavBar}>
        {(
          [
            { id: 'HOME', icon: '🏠', label: 'Inicio' },
            { id: 'MISSION', icon: '📋', label: 'Misiones' },
            { id: 'PROGRESS', icon: '📊', label: 'Progreso' },
            { id: 'PROFILE', icon: '👤', label: 'Perfil' },
          ] as { id: StudentBottomTab; icon: string; label: string }[]
        ).map((tab) => {
          const isFocused = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.bottomTabItem,
                isFocused && styles.bottomTabItemFocused,
              ]}
            >
              <Text style={styles.bottomTabIcon}>{tab.icon}</Text>
              <Text
                style={[
                  styles.bottomTabLabel,
                  isFocused && styles.bottomTabLabelFocused,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  phoneDeviceFrame: {
    flex: 1,
    backgroundColor: SOLAR_COLORS.backgroundApp,
    borderRadius: 20,
    borderWidth: 3.5,
    borderColor: SOLAR_COLORS.navyDark,
    overflow: 'hidden',
  },
  phoneTopBar: {
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: SOLAR_COLORS.borderStrong,
  },
  appTitleText: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 4,
  },
  studentAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: SOLAR_COLORS.navyLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  avatarEmojiText: {
    fontSize: 18,
  },
  studentNameLabel: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  studentGradeLabel: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  localLockBadge: {
    backgroundColor: SOLAR_COLORS.navyLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  localLockText: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  subjectQuickSwitch: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  subjectChip: {
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.borderStrong,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  subjectChipActive: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  subjectChipText: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  subjectChipTextActive: {
    color: '#FFFFFF',
  },
  emptyStateBox: {
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.borderStrong,
  },
  emptyStateEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyStateTitle: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  goMissionBtn: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  goMissionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  profileCard: {
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  profileTitle: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  profileSub: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  profileList: {
    gap: 8,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: SOLAR_COLORS.surfaceMuted,
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.borderStrong,
  },
  profileRowSelected: {
    borderColor: SOLAR_COLORS.appleGreenDark,
    backgroundColor: SOLAR_COLORS.appleGreenSurface,
  },
  profileRowEmoji: {
    fontSize: 22,
  },
  profileRowName: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  profileRowMeta: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 11,
  },
  activeCheck: {
    color: SOLAR_COLORS.appleGreenDark,
    fontSize: 11,
    fontWeight: '900',
  },
  bottomNavBar: {
    flexDirection: 'row',
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    borderTopWidth: 2,
    borderTopColor: SOLAR_COLORS.borderStrong,
  },
  bottomTabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 3,
    borderTopColor: 'transparent',
  },
  bottomTabItemFocused: {
    borderTopColor: SOLAR_COLORS.navyPrimary,
    backgroundColor: '#F1F5F9',
  },
  bottomTabIcon: {
    fontSize: 16,
  },
  bottomTabLabel: {
    color: SOLAR_COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  bottomTabLabelFocused: {
    color: SOLAR_COLORS.navyPrimary,
    fontWeight: '900',
  },
});
