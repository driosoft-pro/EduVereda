/**
 * @file index.ts
 * @description Punto de entrada raíz para Expo / React Native (Web, Android, iOS).
 * Registra el componente principal App.tsx en el runtime multiplataforma.
 */
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
