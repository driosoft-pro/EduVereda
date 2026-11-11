/**
 * @file src/presentation/screens/TeacherScreen.tsx
 * @description Pantalla Principal del Módulo B: Simulador Docente (EduVereda Docente / VeredaSync).
 *
 * Implementa el diseño de Tableta Horizontal de design/style-mockups.jpeg y design/mockups.jpeg:
 *  - Cabecera blanca con título "EduVereda Docente" a la izquierda y perfil de la maestra activa
 *    (ej. "👩‍🏫 Elena Vargas") a la derecha.
 *  - Pestañas para alternar entre:
 *      1. Vista Dividida Mockup: Escáner QR + Notas Registradas ("1. Sofia R. - 95% ✅").
 *      2. Toma de Asistencia Escolar (vía QR automático o manual).
 *      3. Consolidado Completo SQLite y Exportación CSV/JSON.
 */

import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppContainer } from '../context/AppContainerContext';
import { OpticalScannerCard } from '../components/teacher/OpticalScannerCard';
import { ClassroomGradesTable } from '../components/teacher/ClassroomGradesTable';
import { AttendanceTrackerCard } from '../components/teacher/AttendanceTrackerCard';
import { SOLAR_COLORS } from '../theme/colors';

type TeacherTabletTab = 'SCAN_AND_GRADES' | 'ATTENDANCE' | 'SQL_TABLE';

export const TeacherScreen: React.FC = () => {
  const {
    studentsRoster,
    teachersRoster,
    activeTeacher,
    selectActiveTeacher,
    activeQrJson,
    classroomRecords,
    classroomStats,
    attendanceRecords,
    attendanceStats,
    lastScanResult,
    lastExportResult,
    sqlAuditLogs,
    scanQrPayloadString,
    simulateTamperedQrScan,
    markStudentAttendanceManual,
    markAllStudentsPresent,
    exportGrades,
    resetTeacherDemoData,
  } = useAppContainer();

  const [activeTab, setActiveTab] =
    useState<TeacherTabletTab>('SCAN_AND_GRADES');

  return (
    <View style={styles.tabletDeviceFrame}>
      {/* Cabecera estilo Anexo M1 Tableta (design/style-mockups.jpeg) */}
      <View style={styles.tabletTopHeader}>
        <View>
          <Text style={styles.tabletBrandTitle}>EduVereda Docente</Text>
          <Text style={styles.tabletBrandSub}>
            {activeTeacher.ruralSchool} • Especialidad: {activeTeacher.specialty}
          </Text>
        </View>

        {/* Perfil de la Docente activa (ej. Elena) con selector rápido */}
        <View style={styles.teacherProfileRow}>
          {teachersRoster.map((teacher) => {
            const isSelected = teacher.id === activeTeacher.id;
            return (
              <Pressable
                key={teacher.id}
                onPress={() => void selectActiveTeacher(teacher.id)}
                style={[
                  styles.teacherBadgePill,
                  isSelected && styles.teacherBadgePillActive,
                ]}
              >
                <Text style={styles.teacherAvatar}>{teacher.avatarEmoji}</Text>
                <Text
                  style={[
                    styles.teacherNameText,
                    isSelected && styles.teacherNameTextActive,
                  ]}
                >
                  {teacher.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Pestañas de navegación de la Tableta Docente */}
      <View style={styles.tabletTabsRow}>
        <Pressable
          onPress={() => setActiveTab('SCAN_AND_GRADES')}
          style={[
            styles.tabletTabBtn,
            activeTab === 'SCAN_AND_GRADES' && styles.tabletTabBtnActive,
          ]}
        >
          <Text
            style={[
              styles.tabletTabText,
              activeTab === 'SCAN_AND_GRADES' && styles.tabletTabTextActive,
            ]}
          >
            📷 Escáner QR + Notas Registradas ({classroomRecords.length})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('ATTENDANCE')}
          style={[
            styles.tabletTabBtn,
            activeTab === 'ATTENDANCE' && styles.tabletTabBtnActive,
          ]}
        >
          <Text
            style={[
              styles.tabletTabText,
              activeTab === 'ATTENDANCE' && styles.tabletTabTextActive,
            ]}
          >
            📅 Toma de Asistencia ({attendanceStats.presentCount}/
            {attendanceStats.totalRoster})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('SQL_TABLE')}
          style={[
            styles.tabletTabBtn,
            activeTab === 'SQL_TABLE' && styles.tabletTabBtnActive,
          ]}
        >
          <Text
            style={[
              styles.tabletTabText,
              activeTab === 'SQL_TABLE' && styles.tabletTabTextActive,
            ]}
          >
            📊 Tabla Detallada y Exportación CSV
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'SCAN_AND_GRADES' ? (
          <View>
            {/* Visor de escaneo óptico */}
            <OpticalScannerCard
              activeQrJsonFromStudent={activeQrJson}
              lastScanResult={lastScanResult}
              onScanQrString={scanQrPayloadString}
              onSimulateTamperedScan={simulateTamperedQrScan}
            />

            {/* Tarjeta de "Notas registradas" idéntica a la derecha de la tableta en design/style-mockups.jpeg */}
            <View style={styles.mockupGradesListCard}>
              <View style={styles.mockupGradesHeader}>
                <Text style={styles.mockupGradesTitle}>Notas registradas</Text>
                <Pressable
                  onPress={() => void exportGrades('CSV')}
                  style={styles.saveNotesNavyBtn}
                >
                  <Text style={styles.saveNotesNavyBtnText}>
                    Guardar / Exportar Notas
                  </Text>
                </Pressable>
              </View>

              <View style={styles.mockupPillsContainer}>
                {classroomRecords.slice(0, 6).map((rec, index) => (
                  <View key={rec.transactionId} style={styles.mockupStudentRow}>
                    <Text style={styles.mockupStudentText}>
                      {index + 1}. {rec.studentName} — {rec.scorePercentage}% (
                      {rec.subject})
                    </Text>
                    <View style={styles.greenCheckCircle}>
                      <Text style={styles.greenCheckSymbol}>✓</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : null}

        {activeTab === 'ATTENDANCE' ? (
          <AttendanceTrackerCard
            students={studentsRoster}
            attendanceRecords={attendanceRecords}
            stats={attendanceStats}
            teacherName={activeTeacher.name}
            onMarkStatus={markStudentAttendanceManual}
            onMarkAllPresent={markAllStudentsPresent}
          />
        ) : null}

        {activeTab === 'SQL_TABLE' ? (
          <ClassroomGradesTable
            records={classroomRecords}
            stats={classroomStats}
            lastExportResult={lastExportResult}
            sqlAuditLogs={sqlAuditLogs}
            onExport={exportGrades}
            onResetRecords={resetTeacherDemoData}
          />
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabletDeviceFrame: {
    flex: 1,
    backgroundColor: SOLAR_COLORS.backgroundApp,
    borderRadius: 20,
    borderWidth: 3.5,
    borderColor: SOLAR_COLORS.navyDark,
    overflow: 'hidden',
  },
  tabletTopHeader: {
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: SOLAR_COLORS.borderStrong,
  },
  tabletBrandTitle: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  tabletBrandSub: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  teacherProfileRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  teacherBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: SOLAR_COLORS.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.borderStrong,
  },
  teacherBadgePillActive: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  teacherAvatar: {
    fontSize: 15,
  },
  teacherNameText: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  teacherNameTextActive: {
    color: '#FFFFFF',
  },
  tabletTabsRow: {
    flexDirection: 'row',
    backgroundColor: SOLAR_COLORS.navyPrimary,
    paddingHorizontal: 10,
    paddingTop: 8,
    gap: 6,
  },
  tabletTabBtn: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
  },
  tabletTabBtnActive: {
    backgroundColor: SOLAR_COLORS.backgroundApp,
  },
  tabletTabText: {
    color: '#DBEAFE',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  tabletTabTextActive: {
    color: SOLAR_COLORS.navyPrimary,
    fontWeight: '900',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  mockupGradesListCard: {
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  mockupGradesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mockupGradesTitle: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  saveNotesNavyBtn: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  saveNotesNavyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  mockupPillsContainer: {
    gap: 8,
  },
  mockupStudentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: SOLAR_COLORS.borderStrong,
  },
  mockupStudentText: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  greenCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: SOLAR_COLORS.appleGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenCheckSymbol: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});
