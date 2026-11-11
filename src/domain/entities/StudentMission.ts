/**
 * @file src/domain/entities/StudentMission.ts
 * @description Entidades de Dominio para el Módulo A (EduVereda App - Estudiante).
 * Soporta las materias básicas (Matemáticas, Español, Inglés, Química y Estadística)
 * con 4 opciones de respuesta (A, B, C, D) acorde a los wireframes en design/mockups.jpeg.
 */

export type SubjectName =
  | 'Matemáticas'
  | 'Español'
  | 'Inglés'
  | 'Química'
  | 'Estadística Rural';

export interface MissionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface MissionQuestion {
  id: string;
  prompt: string;
  contextHint: string;
  options: MissionOption[];
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  pedagogicalExplanation: string;
}

/**
 * Representa una cápsula gamificada de 5 minutos alineada con los
 * Estándares Básicos de Competencias del MEN.
 */
export interface LearningMission {
  id: string;
  title: string;
  subject: SubjectName;
  grade: string;
  estimatedMinutes: number;
  iconEmoji: string;
  cardAccentColor: string;
  competencyStandard: string;
  questions: MissionQuestion[];
}

/**
 * Estado transaccional del progreso de un estudiante en una misión,
 * persistido inmediatamente en la base de datos SQLite local ante cada respuesta.
 */
export interface StudentMissionProgress {
  studentId: string;
  studentName: string;
  grade: string;
  missionId: string;
  subject: string;
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string>; // questionId -> optionId
  scorePercentage: number;
  isCompleted: boolean;
  updatedAtIso: string;
  lastTransactionId?: string;
}
