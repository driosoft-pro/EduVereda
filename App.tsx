/**
 * @file App.tsx
 * @description Componente Raíz Multiplataforma de EduVereda (React Native + Expo + Web).
 * Envuelve la aplicación con el proveedor de Inyección de Dependencias (Clean Architecture)
 * y renderiza la interfaz adaptativa con manejo de roles.
 */

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppContainerProvider } from './src/presentation/context/AppContainerContext';
import { MainDemoScreen } from './src/presentation/screens/MainDemoScreen';
import { SOLAR_COLORS } from './src/presentation/theme/colors';

export default function App(): React.JSX.Element {
  return (
    <AppContainerProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <MainDemoScreen />
      </SafeAreaView>
    </AppContainerProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SOLAR_COLORS.navyDark,
  },
});
