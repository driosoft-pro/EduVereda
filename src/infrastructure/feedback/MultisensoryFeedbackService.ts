/**
 * @file src/infrastructure/feedback/MultisensoryFeedbackService.ts
 * @description Implementación Multiplataforma de Retroalimentación Multisensorial (RF-D03).
 *
 * Al decodificar una calificación en un aula multigrado ruidosa, activa de forma simultánea:
 *  1. Alerta auditiva de tono claro («¡Pip!» a 880 Hz sintetizado con Web Audio API
 *     sin requerir archivos MP3 pesados).
 *  2. Vibración háptica activa mediante expo-haptics (Nativo) y navigator.vibrate (Web).
 */

import { Platform, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';
import { IFeedbackService } from '../../domain/services/IFeedbackService';

export class MultisensoryFeedbackService implements IFeedbackService {
  /**
   * Sintetiza un tono sinusoidal limpio mediante Web Audio API cuando se ejecuta en Web.
   */
  private playSynthesizedTone(
    frequencyHz: number,
    durationMs: number,
    type: OscillatorType = 'sine'
  ): void {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioCtx) {
        return;
      }

      const ctx = new AudioCtx();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequencyHz, ctx.currentTime);

      // Envolvente suave para un "¡Pip!" claro y agradable en el aula
      gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + durationMs / 1000
      );

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // Ignorar silenciosamente si el navegador bloquea autoplay antes de interacción
    }
  }

  /**
   * Dispara vibración en Web (navigator.vibrate) y en Nativo (expo-haptics / Vibration).
   */
  private async triggerVibration(patternMs: number | number[]): Promise<void> {
    try {
      if (
        Platform.OS === 'web' &&
        typeof navigator !== 'undefined' &&
        typeof navigator.vibrate === 'function'
      ) {
        navigator.vibrate(patternMs);
        return;
      }

      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        Vibration.vibrate(typeof patternMs === 'number' ? patternMs : 200);
      }
    } catch {
      // Dispositivo sin motor háptico
    }
  }

  async triggerSuccessAlert(): Promise<void> {
    // Tono claro "¡Pip!" (880 Hz - Nota La5 durante 180 ms) + Vibración de 200 ms
    this.playSynthesizedTone(880, 180, 'sine');
    await this.triggerVibration(200);
  }

  async triggerErrorAlert(): Promise<void> {
    // Tono grave de alerta (240 Hz durante 280 ms) + Doble vibración de advertencia
    this.playSynthesizedTone(240, 280, 'triangle');
    await this.triggerVibration([120, 80, 120]);
  }
}
