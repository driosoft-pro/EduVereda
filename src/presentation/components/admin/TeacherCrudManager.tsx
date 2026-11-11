/**
 * @file src/presentation/components/admin/TeacherCrudManager.tsx
 * @description Componente de Interfaz para el CRUD de Maestros/Docentes (Rol Administrador).
 *
 * Permite Crear, Listar, Editar/Actualizar, Activar en Tableta y Eliminar maestros
 * en la base de datos SQLite local (tabla teachers_roster).
 */

import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { TeacherProfile } from '../../../domain/entities/Role';
import { SOLAR_COLORS } from '../../theme/colors';

interface TeacherCrudManagerProps {
  teachers: TeacherProfile[];
  onSaveTeacher: (input: {
    id?: string;
    name: string;
    specialty: string;
    ruralSchool: string;
    avatarEmoji?: string;
    isActive?: boolean;
  }) => Promise<void>;
  onDeleteTeacher: (teacherId: string) => Promise<void>;
  onSelectActiveTeacher: (teacherId: string) => Promise<void>;
}

const TEACHER_AVATARS = ['👩‍🏫', '👨‍🏫', '👨‍🔬', '👩‍💼', '🧑‍🌾'];

export const TeacherCrudManager: React.FC<TeacherCrudManagerProps> = ({
  teachers,
  onSaveTeacher,
  onDeleteTeacher,
  onSelectActiveTeacher,
}) => {
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('Matemáticas y Estadística');
  const [ruralSchool, setRuralSchool] = useState('I.E.R. El Roblal - Sede Principal');
  const [avatarEmoji, setAvatarEmoji] = useState('👩‍🏫');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(undefined);
    setName('');
    setSpecialty('Matemáticas y Estadística');
    setRuralSchool('I.E.R. El Roblal - Sede Principal');
    setAvatarEmoji('👩‍🏫');
  };

  const handleEdit = (t: TeacherProfile) => {
    setEditingId(t.id);
    setName(t.name);
    setSpecialty(t.specialty);
    setRuralSchool(t.ruralSchool);
    setAvatarEmoji(t.avatarEmoji);
    setFeedbackMsg(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setFeedbackMsg('⚠️ Por favor ingresa el nombre completo del maestro.');
      return;
    }

    await onSaveTeacher({
      id: editingId,
      name,
      specialty,
      ruralSchool,
      avatarEmoji,
    });

    setFeedbackMsg(
      editingId
        ? `✅ Maestro "${name}" actualizado en SQLite.`
        : `✅ Nuevo maestro "${name}" registrado en SQLite.`
    );
    resetForm();
  };

  return (
    <View style={styles.container}>
      {/* Formulario de Creación / Edición de Maestro */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          {editingId
            ? `✏️ Editando Maestro (${editingId})`
            : '➕ Agregar Nuevo Maestro / Docente Rural'}
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nombre Completo del Docente:</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ej: Profe Jorge Enrique"
            style={styles.input}
          />
        </View>

        <View style={styles.rowFields}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Especialidad / Materias a Cargo:</Text>
            <TextInput
              value={specialty}
              onChangeText={setSpecialty}
              placeholder="Ej: Matemáticas, Química e Inglés"
              style={styles.input}
            />
          </View>

          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Institución / Sede Educativa Rural:</Text>
            <TextInput
              value={ruralSchool}
              onChangeText={setRuralSchool}
              placeholder="Ej: I.E.R. San Isidro"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Icono / Avatar Docente:</Text>
          <View style={styles.chipsRow}>
            {TEACHER_AVATARS.map((emo) => (
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
                ? '💾 Actualizar Maestro en SQLite'
                : '➕ Guardar Maestro en SQLite'}
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

      {/* Listado CRUD de Maestros */}
      <View style={styles.listCard}>
        <Text style={styles.listTitle}>
          👩‍🏫 Planta Docente Rural Registrada ({teachers.length})
        </Text>

        <View style={styles.rowsContainer}>
          {teachers.map((t) => (
            <View key={t.id} style={styles.teacherRow}>
              <Text style={styles.rowAvatar}>{t.avatarEmoji}</Text>

              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>
                  {t.name} <Text style={styles.rowIdBadge}>[{t.id}]</Text>
                </Text>
                <Text style={styles.rowMeta}>
                  {t.specialty} • {t.ruralSchool}
                </Text>
              </View>

              <View style={styles.rowActions}>
                <Pressable
                  onPress={() => void onSelectActiveTeacher(t.id)}
                  style={[
                    styles.activeBtn,
                    t.isActive && styles.activeBtnSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.activeBtnText,
                      t.isActive && { color: '#FFFFFF' },
                    ]}
                  >
                    {t.isActive ? '⭐ Titular Tableta' : 'Asignar Tableta'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleEdit(t)}
                  style={styles.editBtn}
                >
                  <Text style={styles.editBtnText}>✏️ Editar</Text>
                </Pressable>

                <Pressable
                  onPress={() => void onDeleteTeacher(t.id)}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteBtnText}>🗑️</Text>
                </Pressable>
              </View>
            </View>
          ))}
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
    gap: 6,
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
  teacherRow: {
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
  activeBtn: {
    backgroundColor: SOLAR_COLORS.navyLight,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeBtnSelected: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
  },
  activeBtnText: {
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
