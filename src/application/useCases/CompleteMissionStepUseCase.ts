/**
 * @file src/application/useCases/CompleteMissionStepUseCase.ts
 * @description Caso de Uso de Aplicación: Guardar Progreso de Misión en SQLite (RF-E04).
 *
 * Cada vez que el estudiante selecciona una respuesta o avanza de pregunta,
 * este caso de uso recalcula su calificación parcial/final y persiste el estado
 * de manera transaccional en el repositorio SQLite local.
 */

import {
  LearningMission,
  StudentMissionProgress,
} from '../../domain/entities/StudentMission';
import { StudentProfile } from '../../domain/entities/Role';
import { IStudentRepository } from '../../domain/repositories/IStudentRepository';

export class CompleteMissionStepUseCase {
  constructor(private readonly studentRepository: IStudentRepository) {}

  /**
   * Registra una respuesta del estudiante, evalúa el porcentaje de aciertos
   * y guarda el estado inmediatamente en SQLite local.
   */
  async executeAnswerSelection(params: {
    student: StudentProfile;
    mission: LearningMission;
    currentProgress: StudentMissionProgress | null;
    questionId: string;
    selectedOptionId: string;
    advanceToNext: boolean;
  }): Promise<StudentMissionProgress> {
    const {
      student,
      mission,
      currentProgress,
      questionId,
      selectedOptionId,
      advanceToNext,
    } = params;

    const updatedAnswers: Record<string, string> = {
      ...(currentProgress?.selectedAnswers ?? {}),
      [questionId]: selectedOptionId,
    };

    // Calcula el puntaje porcentual sobre el total de preguntas de la cápsula
    let correctCount = 0;
    for (const q of mission.questions) {
      if (updatedAnswers[q.id] === q.correctOptionId) {
        correctCount += 1;
      }
    }

    const totalQuestions = mission.questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    const answeredCount = Object.keys(updatedAnswers).length;
    const isCompleted = answeredCount >= totalQuestions && advanceToNext;

    const currentIndex = currentProgress?.currentQuestionIndex ?? 0;
    const nextIndex =
      advanceToNext && currentIndex < totalQuestions - 1
        ? currentIndex + 1
        : currentIndex;

    const nextProgress: StudentMissionProgress = {
      studentId: student.id,
      studentName: student.name,
      grade: student.grade,
      missionId: mission.id,
      subject: mission.subject,
      currentQuestionIndex: nextIndex,
      selectedAnswers: updatedAnswers,
      scorePercentage,
      isCompleted,
      updatedAtIso: new Date().toISOString(),
    };

    await this.studentRepository.saveProgress(nextProgress);
    return nextProgress;
  }
}
