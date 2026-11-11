/**
 * @file src/presentation/screens/MainDemoScreen.tsx
 * @description Orquestador de la Demo Multiplataforma con Manejo de 4 Roles:
 *  - SPLIT_DEMO: Despliega en paralelo el Simulador Estudiante (Módulo A) y el Simulador Docente (Módulo B).
 *  - STUDENT: Aísla la vista del Estudiante.
 *  - TEACHER: Aísla la vista de la Tableta Docente (Escáner QR + Notas + Asistencia).
 *  - ADMIN: Despliega el Panel Administrador con el CRUD de Estudiantes y Maestros.
 */

import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useAppContainer } from '../context/AppContainerContext';
import { RoleSwitcherBar } from '../components/common/RoleSwitcherBar';
import { StudentScreen } from './StudentScreen';
import { TeacherScreen } from './TeacherScreen';
import { AdminScreen } from './AdminScreen';
import { SOLAR_COLORS } from '../theme/colors';

export const MainDemoScreen: React.FC = () => {
  const { activeRole } = useAppContainer();
  const { width } = useWindowDimensions();
  const isWideViewport = width >= 940;

  return (
    <View style={styles.rootContainer}>
      <RoleSwitcherBar />

      {activeRole === 'STUDENT' ? (
        <View style={styles.singleRoleWrapper}>
          <View style={styles.centeredPhoneColumn}>
            <StudentScreen />
          </View>
        </View>
      ) : activeRole === 'TEACHER' ? (
        <View style={styles.singleRoleWrapper}>
          <View style={styles.centeredTabletColumn}>
            <TeacherScreen />
          </View>
        </View>
      ) : activeRole === 'ADMIN' ? (
        <View style={styles.singleRoleWrapper}>
          <View style={styles.centeredAdminColumn}>
            <AdminScreen />
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.splitScreenContainer,
            !isWideViewport && styles.splitScreenStacked,
          ]}
        >
          <View
            style={[
              styles.splitPaneStudent,
              !isWideViewport && styles.splitPaneFullWidth,
            ]}
          >
            <StudentScreen />
          </View>

          <View
            style={[
              styles.splitPaneTeacher,
              !isWideViewport && styles.splitPaneFullWidth,
            ]}
          >
            <TeacherScreen />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#DCE4EE',
  },
  splitScreenContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    gap: 14,
  },
  splitScreenStacked: {
    flexDirection: 'column',
  },
  splitPaneStudent: {
    flex: 1,
  },
  splitPaneTeacher: {
    flex: 1.3,
  },
  splitPaneFullWidth: {
    flex: 1,
    minHeight: 540,
  },
  singleRoleWrapper: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOLAR_COLORS.backgroundApp,
  },
  centeredPhoneColumn: {
    width: '100%',
    maxWidth: 500,
    flex: 1,
  },
  centeredTabletColumn: {
    width: '100%',
    maxWidth: 920,
    flex: 1,
  },
  centeredAdminColumn: {
    width: '100%',
    maxWidth: 960,
    flex: 1,
  },
});
