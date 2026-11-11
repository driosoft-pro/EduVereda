/**
 * @file src/presentation/screens/AdminScreen.tsx
 * @description Pantalla Principal del Rol Administrador (ADMIN).
 *
 * Permite administrar de manera 100% Offline sobre SQLite local:
 *  1. CRUD Completo de Estudiantes (Crear, Listar, Actualizar, Eliminar).
 *  2. CRUD Completo de Maestros (Crear, Listar, Actualizar, Asignar Tableta, Eliminar).
 *  3. Catálogo de Materias Básicas (Matemáticas, Español, Inglés, Química, Estadística)
 *     y Consola de Auditoría SQLite.
 */

import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppContainer } from '../context/AppContainerContext';
import { StudentCrudManager } from '../components/admin/StudentCrudManager';
import { TeacherCrudManager } from '../components/admin/TeacherCrudManager';
import { SOLAR_COLORS } from '../theme/colors';

type AdminTab = 'STUDENTS_CRUD' | 'TEACHERS_CRUD' | 'SUBJECTS_AND_SQL';

export const AdminScreen: React.FC = () => {
  const {
    studentsRoster,
    currentStudent,
    selectStudent,
    teachersRoster,
    upsertStudent,
    removeStudent,
    upsertTeacher,
    removeTeacher,
    selectActiveTeacher,
    missionsCatalog,
    sqlAuditLogs,
  } = useAppContainer();

  const [activeTab, setActiveTab] = useState<AdminTab>('STUDENTS_CRUD');

  return (
    <View style={styles.adminFrame}>
      {/* Cabecera del Módulo Administrador */}
      <View style={styles.adminBanner}>
        <Text style={styles.adminBannerTitle}>
          ⚙️ Panel Administrador Escolar — Gestión Local SQLite (Offline-First)
        </Text>
        <Text style={styles.adminBannerSub}>
          CRUD de Estudiantes ({studentsRoster.length}) • CRUD de Maestros (
          {teachersRoster.length}) • Materias Básicas ({missionsCatalog.length})
        </Text>
      </View>

      {/* Pestañas del Panel Administrador */}
      <View style={styles.tabsRow}>
        <Pressable
          onPress={() => setActiveTab('STUDENTS_CRUD')}
          style={[
            styles.tabBtn,
            activeTab === 'STUDENTS_CRUD' && styles.tabBtnActive,
          ]}
        >
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'STUDENTS_CRUD' && styles.tabBtnTextActive,
            ]}
          >
            👨‍🎓 CRUD de Estudiantes ({studentsRoster.length})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('TEACHERS_CRUD')}
          style={[
            styles.tabBtn,
            activeTab === 'TEACHERS_CRUD' && styles.tabBtnActive,
          ]}
        >
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'TEACHERS_CRUD' && styles.tabBtnTextActive,
            ]}
          >
            👩‍🏫 CRUD de Maestros ({teachersRoster.length})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('SUBJECTS_AND_SQL')}
          style={[
            styles.tabBtn,
            activeTab === 'SUBJECTS_AND_SQL' && styles.tabBtnActive,
          ]}
        >
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'SUBJECTS_AND_SQL' && styles.tabBtnTextActive,
            ]}
          >
            📚 Materias Básicas + Consola SQLite
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'STUDENTS_CRUD' ? (
          <StudentCrudManager
            students={studentsRoster}
            currentStudentId={currentStudent.id}
            onSaveStudent={upsertStudent}
            onDeleteStudent={removeStudent}
            onSelectActiveStudent={selectStudent}
          />
        ) : null}

        {activeTab === 'TEACHERS_CRUD' ? (
          <TeacherCrudManager
            teachers={teachersRoster}
            onSaveTeacher={upsertTeacher}
            onDeleteTeacher={removeTeacher}
            onSelectActiveTeacher={selectActiveTeacher}
          />
        ) : null}

        {activeTab === 'SUBJECTS_AND_SQL' ? (
          <View style={styles.subjectsContainer}>
            <View style={styles.catalogCard}>
              <Text style={styles.catalogTitle}>
                📚 Materias Básicas Configuradas en el Sistema:
              </Text>
              {missionsCatalog.map((m, idx) => (
                <View key={m.id} style={styles.subjectRow}>
                  <Text style={styles.subjectEmoji}>{m.iconEmoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subjectName}>
                      {idx + 1}. {m.subject} — {m.title} (Grado {m.grade})
                    </Text>
                    <Text style={styles.subjectStd}>{m.competencyStandard}</Text>
                  </View>
                  <Text style={styles.questionCountBadge}>
                    {m.questions.length} pregs (A-D)
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.sqlBox}>
              <Text style={styles.sqlBoxTitle}>
                🔒 Bitácora de Transacciones SQLite Parametrizadas (En Vivo):
              </Text>
              {sqlAuditLogs.map((log, i) => (
                <Text key={i} style={styles.sqlLine}>
                  {log}
                </Text>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  adminFrame: {
    flex: 1,
    backgroundColor: SOLAR_COLORS.backgroundApp,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: SOLAR_COLORS.navyDark,
    overflow: 'hidden',
  },
  adminBanner: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  adminBannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  adminBannerSub: {
    color: '#DBEAFE',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: SOLAR_COLORS.navyDark,
    paddingHorizontal: 10,
    paddingTop: 8,
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    backgroundColor: SOLAR_COLORS.navyPrimary,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: SOLAR_COLORS.appleGreen,
  },
  tabBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  tabBtnTextActive: {
    color: SOLAR_COLORS.textOnGreen,
    fontWeight: '900',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  subjectsContainer: {
    gap: 12,
  },
  catalogCard: {
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: SOLAR_COLORS.navyPrimary,
    gap: 8,
  },
  catalogTitle: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: SOLAR_COLORS.surfaceMuted,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: SOLAR_COLORS.borderStrong,
  },
  subjectEmoji: {
    fontSize: 22,
  },
  subjectName: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  subjectStd: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  questionCountBadge: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sqlBox: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  sqlBoxTitle: {
    color: SOLAR_COLORS.appleGreen,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
  },
  sqlLine: {
    color: '#E2E8F0',
    fontSize: 11,
    fontFamily: 'monospace',
  },
});
