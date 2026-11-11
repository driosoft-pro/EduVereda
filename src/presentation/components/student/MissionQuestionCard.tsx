/**
 * @file src/presentation/components/student/MissionQuestionCard.tsx
 * @description Componente de Interfaz para Cápsulas de Microaprendizaje ("Cultura Snack", RF-E03)
 * con guardado transaccional inmediato en SQLite (RF-E04).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  LearningMission,
  StudentMissionProgress,
} from '../../../domain/entities/StudentMission';
import { SOLAR_COLORS } from '../../theme/colors';

interface MissionQuestionCardProps {
  mission: LearningMission;
  progress: StudentMissionProgress | null;
  onSelectAnswer: (
    questionId: string,
    optionId: string,
    advanceToNext: boolean
  ) => Promise<void>;
}

export const MissionQuestionCard: React.FC<MissionQuestionCardProps> = ({
  mission,
  progress,
  onSelectAnswer,
}) => {
  const currentIndex = progress?.currentQuestionIndex ?? 0;
  const currentQuestion =
    mission.questions[currentIndex] ?? mission.questions[0];
  const selectedOptionId = progress?.selectedAnswers[currentQuestion.id];
  const totalQuestions = mission.questions.length;
  const answeredCount = Object.keys(progress?.selectedAnswers ?? {}).length;
  const progressFraction = Math.round((answeredCount / totalQuestions) * 100);

  const isCorrect =
    selectedOptionId !== undefined &&
    selectedOptionId === currentQuestion.correctOptionId;

  return (
    <View style={styles.card}>
      {/* Cabecera de la cápsula y barra de progreso */}
      <View style={styles.missionHeader}>
        <Text style={styles.subjectTag}>
          {mission.subject} • Grado {mission.grade} • {mission.estimatedMinutes} min
        </Text>
        <Text style={styles.missionTitle}>{mission.title}</Text>
        <Text style={styles.standardText}>{mission.competencyStandard}</Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressStepText}>
            Pregunta {currentIndex + 1} de {totalQuestions}
          </Text>
          <Text style={styles.progressPercentText}>
            Avance SQLite: {progressFraction}% (Nota parcial:{' '}
            {progress?.scorePercentage ?? 0}%)
          </Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.max(10, progressFraction)}%` },
            ]}
          />
        </View>
      </View>

      {/* Enunciado de la pregunta */}
      <View style={styles.questionBox}>
        <Text style={styles.questionPrompt}>{currentQuestion.prompt}</Text>
        <Text style={styles.questionHint}>
          💡 Pista rural: {currentQuestion.contextHint}
        </Text>
      </View>

      {/* Opciones de respuesta con alto contraste */}
      <View style={styles.optionsList}>
        {currentQuestion.options.map((option) => {
          const isChosen = selectedOptionId === option.id;
          const isOptionRight = option.id === currentQuestion.correctOptionId;

          return (
            <Pressable
              key={option.id}
              onPress={() =>
                void onSelectAnswer(currentQuestion.id, option.id, false)
              }
              style={[
                styles.optionButton,
                isChosen && styles.optionButtonSelected,
                isChosen && isOptionRight && styles.optionButtonCorrect,
                isChosen && !isOptionRight && styles.optionButtonWrong,
              ]}
              accessibilityRole="button"
            >
              <View
                style={[
                  styles.optionLetterBadge,
                  isChosen && styles.optionLetterBadgeSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionLetterText,
                    isChosen && styles.optionLetterTextSelected,
                  ]}
                >
                  {option.id}
                </Text>
              </View>
              <Text style={styles.optionLabelText}>{option.text}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Retroalimentación pedagógica y botón para avanzar / culminar misión */}
      {selectedOptionId ? (
        <View
          style={[
            styles.feedbackBox,
            isCorrect ? styles.feedbackSuccess : styles.feedbackWarning,
          ]}
        >
          <Text style={styles.feedbackTitle}>
            {isCorrect
              ? '✅ ¡Respuesta correcta guardada en SQLite!'
              : '📘 Respuesta registrada — Revisa la explicación:'}
          </Text>
          <Text style={styles.feedbackBody}>
            {currentQuestion.pedagogicalExplanation}
          </Text>

          <Pressable
            onPress={() =>
              void onSelectAnswer(currentQuestion.id, selectedOptionId, true)
            }
            style={styles.nextActionButton}
            accessibilityRole="button"
          >
            <Text style={styles.nextActionButtonText}>
              {currentIndex < totalQuestions - 1
                ? 'Guardar y Pasar a la Siguiente Pregunta →'
                : '¡Finalizar Misión y Asegurar Progreso! →'}
            </Text>
          </Pressable>
        </View>
      ) : null}
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
    marginBottom: 12,
  },
  missionHeader: {
    marginBottom: 10,
  },
  subjectTag: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  missionTitle: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2,
  },
  standardText: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 11,
    marginTop: 3,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressStepText: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  progressPercentText: {
    color: SOLAR_COLORS.appleGreenDark,
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: SOLAR_COLORS.navyLight,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: SOLAR_COLORS.appleGreen,
  },
  questionBox: {
    backgroundColor: SOLAR_COLORS.navyLight,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: SOLAR_COLORS.navyPrimary,
    marginBottom: 12,
  },
  questionPrompt: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  questionHint: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  optionsList: {
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SOLAR_COLORS.surfaceMuted,
    borderWidth: 2,
    borderColor: SOLAR_COLORS.borderStrong,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  optionButtonSelected: {
    borderColor: SOLAR_COLORS.navyPrimary,
    backgroundColor: '#E0F2FE',
  },
  optionButtonCorrect: {
    borderColor: SOLAR_COLORS.successBorder,
    backgroundColor: SOLAR_COLORS.successBg,
  },
  optionButtonWrong: {
    borderColor: SOLAR_COLORS.warningBorder,
    backgroundColor: SOLAR_COLORS.warningBg,
  },
  optionLetterBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: SOLAR_COLORS.navyPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterBadgeSelected: {
    backgroundColor: SOLAR_COLORS.appleGreen,
  },
  optionLetterText: {
    color: SOLAR_COLORS.textOnNavy,
    fontSize: 13,
    fontWeight: '800',
  },
  optionLetterTextSelected: {
    color: SOLAR_COLORS.textOnGreen,
  },
  optionLabelText: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  feedbackBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  feedbackSuccess: {
    backgroundColor: SOLAR_COLORS.successBg,
    borderColor: SOLAR_COLORS.successBorder,
  },
  feedbackWarning: {
    backgroundColor: SOLAR_COLORS.warningBg,
    borderColor: SOLAR_COLORS.warningBorder,
  },
  feedbackTitle: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  feedbackBody: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  nextActionButton: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextActionButtonText: {
    color: SOLAR_COLORS.textOnNavy,
    fontSize: 13,
    fontWeight: '800',
  },
});
