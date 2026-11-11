/**
 * @file src/presentation/components/teacher/AttendanceTrackerCard.tsx
 * @description Componente de Interfaz para Toma de Asistencia Escolar en Aula Multigrado.
 *
 * Permite a la docente:
 *  - Ver quiénes quedaron registrados automáticamente como PRESENTE al escanear su Código QR.
 *  - Marcar manualmente Presente (✅), Tardanza (🕒) o Ausente (❌) a cualquier estudiante.
 *  - Marcar a todo el salón como Presente con un solo toque.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummaryStats,
} from '../../../domain/entities/AttendanceRecord';
import { StudentProfile } from '../../../domain/entities/Role';
import { SOLAR_COLORS } from '../../theme/colors';

interface AttendanceTrackerCardProps {
  students: StudentProfile[];
  attendanceRecords: AttendanceRecord[];
  stats: AttendanceSummaryStats;
  teacherName: string;
  onMarkStatus: (student: StudentProfile, status: AttendanceStatus) => Promise<void>;
  onMarkAllPresent: () => Promise<void>;
}

export const AttendanceTrackerCard: React.FC<AttendanceTrackerCardProps> = ({
  students,
  attendanceRecords,
  stats,
  teacherName,
  onMarkStatus,
  onMarkAllPresent,
}) => {
  return (
    <View style={styles.card}>
      {/* Cabecera e indicadores de asistencia del día */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>
            📅 Control de Asistencia Escolar (SQLite Offline)
          </Text>
          <Text style={styles.subtitle}>
            Docente responsable: {teacherName} • Sincronizado con Escáner QR
          </Text>
        </View>

        <Pressable
          onPress={() => void onMarkAllPresent()}
          style={styles.bulkPresentBtn}
        >
          <Text style={styles.bulkPresentBtnText}>
            ✅ Marcar Todo el Salón Presente
          </Text>
        </Pressable>
      </View>

      {/* Tarjetas de resumen estadístico de asistencia */}
      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Text style={styles.statNum}>{stats.presentCount}</Text>
          <Text style={styles.statText}>Presentes</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={styles.statNum}>{stats.lateCount}</Text>
          <Text style={styles.statText}>Tardanzas</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={styles.statNum}>{stats.absentCount}</Text>
          <Text style={styles.statText}>Ausentes</Text>
        </View>
        <View style={[styles.statPill, styles.statPillHighlight]}>
          <Text style={styles.statNumHighlight}>
            {stats.attendancePercentage}%
          </Text>
          <Text style={styles.statTextHighlight}>Asistencia Hoy</Text>
        </View>
      </View>

      {/* Lista de estudiantes del aula con botones de marcación rápida */}
      <View style={styles.rosterList}>
        {students.map((student, idx) => {
          const record = attendanceRecords.find(
            (r) => r.studentId === student.id
          );
          const currentStatus = record?.status;

          return (
            <View key={student.id} style={styles.studentAttendanceRow}>
              <View style={styles.studentIdentityCol}>
                <Text style={styles.studentIndexName}>
                  {idx + 1}. {student.avatarEmoji} {student.name}{' '}
                  <Text style={styles.gradeTag}>({student.grade})</Text>
                </Text>
                <Text style={styles.veredaSub}>
                  {student.vereda} •{' '}
                  {record
                    ? `${record.source === 'QR_OPTICO' ? '📷 Vía QR' : '✍️ Manual'} (${record.updatedTimeLabel})`
                    : 'Sin marcar hoy'}
                </Text>
              </View>

              <View style={styles.statusButtonsGroup}>
                {(
                  [
                    { status: 'PRESENTE', label: '✅ Presente' },
                    { status: 'TARDANZA', label: '🕒 Tardanza' },
                    { status: 'AUSENTE', label: '❌ Ausente' },
                  ] as { status: AttendanceStatus; label: string }[]
                ).map((btn) => {
                  const isSelected = currentStatus === btn.status;
                  return (
                    <Pressable
                      key={btn.status}
                      onPress={() => void onMarkStatus(student, btn.status)}
                      style={[
                        styles.statusBtn,
                        isSelected &&
                          btn.status === 'PRESENTE' &&
                          styles.statusBtnPresent,
                        isSelected &&
                          btn.status === 'TARDANZA' &&
                          styles.statusBtnLate,
                        isSelected &&
                          btn.status === 'AUSENTE' &&
                          styles.statusBtnAbsent,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBtnText,
                          isSelected && styles.statusBtnTextActive,
                        ]}
                      >
                        {btn.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  title: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 15,
    fontWeight: '900',
  },
  subtitle: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  bulkPresentBtn: {
    backgroundColor: SOLAR_COLORS.appleGreen,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  bulkPresentBtnText: {
    color: SOLAR_COLORS.textOnGreen,
    fontSize: 11,
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  statPill: {
    flex: 1,
    backgroundColor: SOLAR_COLORS.surfaceMuted,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SOLAR_COLORS.borderStrong,
  },
  statPillHighlight: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  statNum: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 15,
    fontWeight: '900',
  },
  statText: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  statNumHighlight: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  statTextHighlight: {
    color: '#DBEAFE',
    fontSize: 10,
    fontWeight: '700',
  },
  rosterList: {
    gap: 8,
  },
  studentAttendanceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SOLAR_COLORS.surfaceMuted,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: SOLAR_COLORS.borderStrong,
    gap: 8,
  },
  studentIdentityCol: {
    flex: 1,
    minWidth: 150,
  },
  studentIndexName: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  gradeTag: {
    color: SOLAR_COLORS.navyPrimary,
  },
  veredaSub: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  statusButtonsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.borderStrong,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBtnPresent: {
    backgroundColor: SOLAR_COLORS.successBg,
    borderColor: SOLAR_COLORS.successBorder,
  },
  statusBtnLate: {
    backgroundColor: SOLAR_COLORS.warningBg,
    borderColor: SOLAR_COLORS.warningBorder,
  },
  statusBtnAbsent: {
    backgroundColor: SOLAR_COLORS.dangerBg,
    borderColor: SOLAR_COLORS.dangerBorder,
  },
  statusBtnText: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  statusBtnTextActive: {
    color: SOLAR_COLORS.textPrimary,
    fontWeight: '900',
  },
});
