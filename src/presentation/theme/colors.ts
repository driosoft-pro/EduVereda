/**
 * @file src/presentation/theme/colors.ts
 * @description Paleta de Colores de Alto Contraste (WCAG AAA) diseñada para
 * legibilidad bajo luz solar directa en escuelas rurales abiertas (RF-E02, RF-E06, RNF-06).
 */

export const SOLAR_COLORS = {
  /** Azul Marino Institucional (RF-E02) - Ratio de contraste > 12:1 con blanco */
  navyPrimary: '#1B365D',
  navyDark: '#0F2240',
  navyLight: '#E8EEF5',

  /** Verde Manzana de Acción Principal (RF-E06) */
  appleGreen: '#7CB342',
  appleGreenDark: '#558B2F',
  appleGreenSurface: '#F1F8E9',

  /** Fondos y Superficies de Alto Contraste */
  backgroundApp: '#EEF2F6',
  surfaceWhite: '#FFFFFF',
  surfaceMuted: '#F8FAFC',
  borderStrong: '#CBD5E1',
  borderNavy: '#1B365D',

  /** Textos de Alta Legibilidad */
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
  textOnNavy: '#FFFFFF',
  textOnGreen: '#0B1F02',

  /** Estados Semánticos (Notificaciones de Aula RF-D03 y Seguridad) */
  successBg: '#DCFCE7',
  successBorder: '#15803D',
  successText: '#14532D',

  warningBg: '#FEF9C3',
  warningBorder: '#CA8A04',
  warningText: '#713F12',

  dangerBg: '#FEE2E2',
  dangerBorder: '#B91C1C',
  dangerText: '#7F1D1D',
} as const;
