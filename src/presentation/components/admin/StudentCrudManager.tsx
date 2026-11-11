/**
 * @file src/presentation/components/admin/StudentCrudManager.tsx
 * @description Componente de Interfaz para el CRUD de Estudiantes (Rol Administrador).
 *
 * Permite Crear, Listar, Editar/Actualizar y Eliminar estudiantes en la base
 * de datos SQLite local (tabla students_roster).
 */

import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StudentProfile } from '../../../domain/entities/Role';
import { SOLAR_COLORS } from '../../theme/colors';

interface StudentCrudManagerProps {
  students: StudentProfile[];
  currentStudentId: string;
  onSaveStudent: (input: {
    id?: string;
    name: string;
    grade: string;
    vereda: string;
    avatarEmoji?: string;
  }) => Promise<void>;
  onDeleteStudent: (studentId: string) => Promise<void>;
  onSelectActiveStudent: (studentId: string) => void;
}

const AVATAR_OPTIONS = ['👦🏽', '👧🏻', '👦🏾', '👧🏽', '👦🏻', '👧🏾', '🧑🏽‍🎓'];
const GRADE_OPTIONS = ['6°', '7°', '8°', '9°', '10°', '11°'];

export const StudentCrudManager: React.FC<StudentCrudManagerProps> = ({
  students,
  currentStudentId,
  onSaveStudent,
  onDeleteStudent,
  onSelectActiveStudent,
}) => {
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('9°');
  const [vereda, setVereda] = useState('Vereda El Roblal');
  const [avatarEmoji, setAvatarEmoji] = useState('👦🏽');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(undefined);
    setName('');
    setGrade('9°');
    setVereda('Vereda El Roblal');
    setAvatarEmoji('👦🏽');
  };

  const handleEdit = (st: StudentProfile) => {
    setEditingId(st.id);
    setName(st.name);
    setGrade(st.grade);
    setVereda(st.vereda);
    setAvatarEmoji(st.avatarEmoji);
    setFeedbackMsg(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setFeedbackMsg('⚠️ Por favor ingresa el nombre completo del estudiante.');
      return;
    }

    await onSaveStudent({
      id: editingId,
      name,
      grade,
      vereda,
      avatarEmoji,
    });

    setFeedbackMsg(
      editingId
        ? `✅ Estudiante "${name}" actualizado en SQLite.`
        : `✅ Nuevo estudiante "${name}" agregado a SQLite.`
    );
    resetForm();
  };

  return (
    <View style={styles.container}>
      {/* Formulario de Creación / Edición de Estudiante */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          {editingId
            ? `✏️ Editando Estudiante (${editingId})`
            : '➕ Agregar Nuevo Estudiante Rural'}
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nombre y Apellido del Estudiante:</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ej: Valentina Muñoz"
            style={styles.input}
          />
        </View>

        <View style={styles.rowFields}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Grado Escolar:</Text>
            <View style={styles.chipsRow}>
              {GRADE_OPTIONS.map((g) => (
                <Pressable
                  key={g}
                  onPress={() => setGrade(g)}
                  style={[
                    styles.smallChip,
                    grade === g && styles.smallChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.smallChipText,
                      grade === g && styles.smallChipTextActive,
                    ]}
                  >
                    {g}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Vereda / Sector Rural:</Text>
            <TextInput
              value={vereda}
              onChangeText={setVereda}
              placeholder="Ej: Vereda La Esperanza"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Avatar Escolar:</Text>
          <View style={styles.chipsRow}>
            {AVATAR_OPTIONS.map((emo) => (
              <Pressable
                key={emo}
                onPress={() => setAvatarEmoji(emo)}
                style={[
                  styles.emojiChip,
                  avatarEmoji === emo && styles.emojiChipActive,
                ]}
              >
                <Text style={styles.emojiText}>{emo}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.formButtonsRow}>
          <Pressable
            onPress={() => void handleSubmit()}
            style={styles.submitBtn}
          >
            <Text style={styles.submitBtnText}>
              {editingId
                ? '💾 Actualizar Estudiante en SQLite'
                : '➕ Guardar Estudiante en SQLite'}
            </Text>
          </Pressable>

          {editingId ? (
            <Pressable onPress={resetForm} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancelar Edición</Text>
            </Pressable>
          ) : null}
        </View>

        {feedbackMsg ? (
          <Text style={styles.feedbackBanner}>{feedbackMsg}</Text>
        ) : null}
      </View>

      {/* Tabla / Listado CRUD de Estudiantes */}
      <View style={styles.listCard}>
        <Text style={styles.listTitle}>
          📋 Nómina de Estudiantes Registrados ({students.length})
        </Text>

        <View style={styles.rowsContainer}>
          {students.map((st) => {
            const isCurrent = st.id === currentStudentId;
            return (
              <View key={st.id} style={styles.studentRow}>
                <Text style={styles.rowAvatar}>{st.avatarEmoji}</Text>

                <View style={styles.rowInfo}>
                  <Text style={styles.rowName}>
                    {st.name}{' '}
                    <Text style={styles.rowIdBadge}>[{st.id}]</Text>
                  </Text>
                  <Text style={styles.rowMeta}>
                    Grado {st.grade} • {st.vereda}
                  </Text>
                </View>

                <View style={styles.rowActions}>
                  <Pressable
                    onPress={() => onSelectActiveStudent(st.id)}
                    style={[
                      styles.actionBtn,
                      isCurrent && styles.actionBtnActiveApp,
                    ]}
                  >
                    <Text
                      style={[
                        styles.actionBtnText,
                        isCurrent && { color: '#FFFFFF' },
                      ]}
                    >
                      {isCurrent ? '📱 En App' : 'Usar en App'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleEdit(st)}
                    style={styles.editBtn}
                  >
                    <Text style={styles.editBtnText}>✏️ Editar</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => void onDeleteStudent(st.id)}
                    style={styles.deleteBtn}
                  >
                    <Text style={styles.deleteBtnText}>🗑️</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  formCard: {
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  formTitle: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },
  fieldGroup: {
    marginBottom: 10,
  },
  rowFields: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  label: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  input: {
    backgroundColor: SOLAR_COLORS.surfaceMuted,
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.borderStrong,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: SOLAR_COLORS.textPrimary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  smallChip: {
    backgroundColor: SOLAR_COLORS.surfaceMuted,
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.borderStrong,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  smallChipActive: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  smallChipText: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  smallChipTextActive: {
    color: '#FFFFFF',
  },
  emojiChip: {
    backgroundColor: SOLAR_COLORS.surfaceMuted,
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.borderStrong,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  emojiChipActive: {
    backgroundColor: SOLAR_COLORS.appleGreenSurface,
    borderColor: SOLAR_COLORS.appleGreenDark,
  },
  emojiText: {
    fontSize: 18,
  },
  formButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: SOLAR_COLORS.appleGreen,
    borderWidth: 2,
    borderColor: SOLAR_COLORS.navyPrimary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnText: {
    color: SOLAR_COLORS.textOnGreen,
    fontSize: 13,
    fontWeight: '900',
  },
  cancelBtn: {
    backgroundColor: SOLAR_COLORS.surfaceMuted,
    borderWidth: 1.5,
    borderColor: SOLAR_COLORS.borderStrong,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 8,
  },
  cancelBtnText: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '800',
  },
  feedbackBanner: {
    marginTop: 8,
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  listCard: {
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  listTitle: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 10,
  },
  rowsContainer: {
    gap: 8,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SOLAR_COLORS.surfaceMuted,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: SOLAR_COLORS.borderStrong,
    gap: 10,
  },
  rowAvatar: {
    fontSize: 22,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  rowIdBadge: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 11,
  },
  rowMeta: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    backgroundColor: SOLAR_COLORS.navyLight,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionBtnActiveApp: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
  },
  actionBtnText: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  editBtn: {
    backgroundColor: '#FEF9C3',
    borderWidth: 1,
    borderColor: '#CA8A04',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editBtnText: {
    color: '#713F12',
    fontSize: 11,
    fontWeight: '800',
  },
  deleteBtn: {
    backgroundColor: SOLAR_COLORS.dangerBg,
    borderWidth: 1,
    borderColor: SOLAR_COLORS.dangerBorder,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteBtnText: {
    fontSize: 12,
  },
});
