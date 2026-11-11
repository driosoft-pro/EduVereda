/**
 * @file src/presentation/context/AppContainerContext.tsx
 * @description Contenedor de Inyección de Dependencias (Clean Architecture) y
 * Estado Global para:
 *  - Manejo de 4 Roles (SPLIT_DEMO, STUDENT, TEACHER, ADMIN).
 *  - CRUD de Estudiantes y Maestros en SQLite.
 *  - Cápsulas de Materias Básicas (Matemáticas, Español, Inglés, Química, Estadística).
 *  - Toma de Asistencia Escolar (vía QR automático o manual docente).
 *  - Sincronización Óptica QR con firma HMAC-SHA256 y protección Anti-Replay.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ROLE_PERMISSIONS,
  RolePermission,
  StudentProfile,
  SystemRole,
  TeacherProfile,
} from '../../domain/entities/Role';
import {
  LearningMission,
  StudentMissionProgress,
} from '../../domain/entities/StudentMission';
import {
  ClassroomGradeRecord,
  ClassroomSummaryStats,
  QrScanVerificationResult,
  VeredaSyncQrPayload,
} from '../../domain/entities/GradeRecord';
import {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummaryStats,
} from '../../domain/entities/AttendanceRecord';
import { ExportResult } from '../../domain/services/IExportService';
import {
  INITIAL_STUDENTS_ROSTER,
  INITIAL_TEACHERS_ROSTER,
  RURAL_MISSIONS_CATALOG,
} from '../../application/data/ruralMissionsCatalog';
import { CompleteMissionStepUseCase } from '../../application/useCases/CompleteMissionStepUseCase';
import { GenerateSignedQrUseCase } from '../../application/useCases/GenerateSignedQrUseCase';
import { ProcessScannedQrUseCase } from '../../application/useCases/ProcessScannedQrUseCase';
import { ExportClassroomGradesUseCase } from '../../application/useCases/ExportClassroomGradesUseCase';
import { ManageRosterCrudUseCase } from '../../application/useCases/ManageRosterCrudUseCase';
import { ManageAttendanceUseCase } from '../../application/useCases/ManageAttendanceUseCase';
import { SqliteEngine } from '../../infrastructure/database/sqliteEngine';
import { SqliteStudentRepository } from '../../infrastructure/repositories/SqliteStudentRepository';
import { SqliteTeacherRepository } from '../../infrastructure/repositories/SqliteTeacherRepository';
import { SqliteRosterRepository } from '../../infrastructure/repositories/SqliteRosterRepository';
import { SqliteAttendanceRepository } from '../../infrastructure/repositories/SqliteAttendanceRepository';
import { HmacSecurityService } from '../../infrastructure/security/HmacSecurityService';
import { MultisensoryFeedbackService } from '../../infrastructure/feedback/MultisensoryFeedbackService';
import { LocalFileExportService } from '../../infrastructure/export/LocalFileExportService';

interface AppContainerContextValue {
  // Roles y Perfiles Activos
  activeRole: SystemRole;
  rolePermission: RolePermission;
  setActiveRole: (role: SystemRole) => void;
  studentsRoster: StudentProfile[];
  currentStudent: StudentProfile;
  selectStudent: (studentId: string) => void;
  teachersRoster: TeacherProfile[];
  activeTeacher: TeacherProfile;

  // CRUD de Estudiantes y Maestros (Rol Administrador)
  upsertStudent: (input: {
    id?: string;
    name: string;
    grade: string;
    vereda: string;
    avatarEmoji?: string;
  }) => Promise<void>;
  removeStudent: (studentId: string) => Promise<void>;
  upsertTeacher: (input: {
    id?: string;
    name: string;
    specialty: string;
    ruralSchool: string;
    avatarEmoji?: string;
    isActive?: boolean;
  }) => Promise<void>;
  removeTeacher: (teacherId: string) => Promise<void>;
  selectActiveTeacher: (teacherId: string) => Promise<void>;

  // Módulo A (Estudiante) y Aviso SQLite (Wireframe 3)
  missionsCatalog: LearningMission[];
  currentMission: LearningMission;
  selectMission: (missionId: string) => void;
  studentProgress: StudentMissionProgress | null;
  showSqliteSavedNotice: boolean;
  dismissSqliteSavedNotice: () => void;
  activeQrPayload: VeredaSyncQrPayload | null;
  activeQrJson: string | null;
  answerQuestion: (
    questionId: string,
    optionId: string,
    advanceToNext: boolean
  ) => Promise<void>;
  generateDynamicQr: () => Promise<void>;
  resetCurrentMission: () => Promise<void>;

  // Módulo B (Docente): Escáner QR, Notas y Toma de Asistencia
  classroomRecords: ClassroomGradeRecord[];
  classroomStats: ClassroomSummaryStats;
  attendanceRecords: AttendanceRecord[];
  attendanceStats: AttendanceSummaryStats;
  lastScanResult: QrScanVerificationResult | null;
  lastExportResult: ExportResult | null;
  sqlAuditLogs: string[];
  scanQrPayloadString: (rawQrString: string) => Promise<QrScanVerificationResult>;
  simulateTamperedQrScan: () => Promise<void>;
  markStudentAttendanceManual: (
    student: StudentProfile,
    status: AttendanceStatus
  ) => Promise<void>;
  markAllStudentsPresent: () => Promise<void>;
  exportGrades: (format: 'CSV' | 'JSON') => Promise<void>;
  resetTeacherDemoData: () => Promise<void>;
}

const AppContainerContext = createContext<AppContainerContextValue | null>(null);

export const AppContainerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const container = useMemo(() => {
    const dbEngine = new SqliteEngine();
    const studentRepository = new SqliteStudentRepository(dbEngine);
    const teacherRepository = new SqliteTeacherRepository(dbEngine);
    const rosterRepository = new SqliteRosterRepository(dbEngine);
    const attendanceRepository = new SqliteAttendanceRepository(dbEngine);
    const securityService = new HmacSecurityService();
    const feedbackService = new MultisensoryFeedbackService();
    const exportService = new LocalFileExportService(securityService);

    return {
      studentRepository,
      teacherRepository,
      rosterRepository,
      attendanceRepository,
      completeMissionStepUseCase: new CompleteMissionStepUseCase(
        studentRepository
      ),
      generateSignedQrUseCase: new GenerateSignedQrUseCase(
        securityService,
        studentRepository
      ),
      processScannedQrUseCase: new ProcessScannedQrUseCase(
        teacherRepository,
        attendanceRepository,
        securityService,
        feedbackService
      ),
      exportClassroomGradesUseCase: new ExportClassroomGradesUseCase(
        teacherRepository,
        exportService
      ),
      manageRosterCrudUseCase: new ManageRosterCrudUseCase(rosterRepository),
      manageAttendanceUseCase: new ManageAttendanceUseCase(attendanceRepository),
    };
  }, []);

  const [activeRole, setActiveRole] = useState<SystemRole>('SPLIT_DEMO');
  const [studentsRoster, setStudentsRoster] = useState<StudentProfile[]>(
    INITIAL_STUDENTS_ROSTER
  );
  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(
    INITIAL_STUDENTS_ROSTER[0]
  );
  const [teachersRoster, setTeachersRoster] = useState<TeacherProfile[]>(
    INITIAL_TEACHERS_ROSTER
  );
  const [currentMission, setCurrentMission] = useState<LearningMission>(
    RURAL_MISSIONS_CATALOG[0]
  );

  const [studentProgress, setStudentProgress] =
    useState<StudentMissionProgress | null>(null);
  const [showSqliteSavedNotice, setShowSqliteSavedNotice] = useState(false);
  const [activeQrPayload, setActiveQrPayload] =
    useState<VeredaSyncQrPayload | null>(null);
  const [activeQrJson, setActiveQrJson] = useState<string | null>(null);

  const [classroomRecords, setClassroomRecords] = useState<
    ClassroomGradeRecord[]
  >([]);
  const [classroomStats, setClassroomStats] = useState<ClassroomSummaryStats>({
    totalRecords: 0,
    uniqueStudents: 0,
    averageScore: 0,
    highestScore: 0,
    averageDecodeMs: 0,
  });
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [lastScanResult, setLastScanResult] =
    useState<QrScanVerificationResult | null>(null);
  const [lastExportResult, setLastExportResult] = useState<ExportResult | null>(
    null
  );
  const [sqlAuditLogs, setSqlAuditLogs] = useState<string[]>([]);

  const activeTeacher = useMemo(
    () => teachersRoster.find((t) => t.isActive) ?? teachersRoster[0] ?? INITIAL_TEACHERS_ROSTER[0],
    [teachersRoster]
  );

  const attendanceStats = useMemo(
    () =>
      container.manageAttendanceUseCase.computeSummary(
        studentsRoster,
        attendanceRecords
      ),
    [container, studentsRoster, attendanceRecords]
  );

  const refreshAllData = useCallback(async () => {
    const [records, stats, attendance, students, teachers] = await Promise.all([
      container.teacherRepository.getAllGradeRecords(),
      container.teacherRepository.getClassroomStats(),
      container.manageAttendanceUseCase.getTodayAttendanceList(),
      container.manageRosterCrudUseCase.listStudents(),
      container.manageRosterCrudUseCase.listTeachers(),
    ]);
    setClassroomRecords(records);
    setClassroomStats(stats);
    setAttendanceRecords(attendance);
    setStudentsRoster(students);
    setTeachersRoster(teachers);
    setSqlAuditLogs(container.studentRepository.getRecentSqlLogs());
  }, [container]);

  const loadStudentMissionProgress = useCallback(
    async (student: StudentProfile, mission: LearningMission) => {
      const saved = await container.studentRepository.getProgress(
        student.id,
        mission.id
      );
      setStudentProgress(saved);
      setActiveQrPayload(null);
      setActiveQrJson(null);
      setSqlAuditLogs(container.studentRepository.getRecentSqlLogs());
    },
    [container]
  );

  useEffect(() => {
    const boot = async () => {
      await Promise.all([
        container.studentRepository.initialize(),
        container.teacherRepository.initialize(),
        container.rosterRepository.initialize(),
        container.attendanceRepository.initialize(),
      ]);
      await loadStudentMissionProgress(currentStudent, currentMission);
      await refreshAllData();
    };
    void boot();
  }, [
    container,
    currentStudent,
    currentMission,
    loadStudentMissionProgress,
    refreshAllData,
  ]);

  const selectStudent = useCallback(
    (studentId: string) => {
      const found = studentsRoster.find((s) => s.id === studentId);
      if (found) setCurrentStudent(found);
    },
    [studentsRoster]
  );

  const selectMission = useCallback((missionId: string) => {
    const found = RURAL_MISSIONS_CATALOG.find((m) => m.id === missionId);
    if (found) setCurrentMission(found);
  }, []);

  // Operaciones CRUD de Estudiantes y Maestros
  const upsertStudent = useCallback(
    async (input: {
      id?: string;
      name: string;
      grade: string;
      vereda: string;
      avatarEmoji?: string;
    }) => {
      const updated = await container.manageRosterCrudUseCase.upsertStudent(input);
      setStudentsRoster(updated);
      if (input.id && input.id === currentStudent.id) {
        const refreshed = updated.find((s) => s.id === input.id);
        if (refreshed) setCurrentStudent(refreshed);
      }
      setSqlAuditLogs(container.studentRepository.getRecentSqlLogs());
    },
    [container, currentStudent.id]
  );

  const removeStudent = useCallback(
    async (studentId: string) => {
      const updated = await container.manageRosterCrudUseCase.removeStudent(studentId);
      setStudentsRoster(updated);
      if (currentStudent.id === studentId && updated.length > 0) {
        setCurrentStudent(updated[0]);
      }
      setSqlAuditLogs(container.studentRepository.getRecentSqlLogs());
    },
    [container, currentStudent.id]
  );

  const upsertTeacher = useCallback(
    async (input: {
      id?: string;
      name: string;
      specialty: string;
      ruralSchool: string;
      avatarEmoji?: string;
      isActive?: boolean;
    }) => {
      const updated = await container.manageRosterCrudUseCase.upsertTeacher(input);
      setTeachersRoster(updated);
      setSqlAuditLogs(container.studentRepository.getRecentSqlLogs());
    },
    [container]
  );

  const removeTeacher = useCallback(
    async (teacherId: string) => {
      const updated = await container.manageRosterCrudUseCase.removeTeacher(teacherId);
      setTeachersRoster(updated);
      setSqlAuditLogs(container.studentRepository.getRecentSqlLogs());
    },
    [container]
  );

  const selectActiveTeacher = useCallback(
    async (teacherId: string) => {
      const updated = await container.manageRosterCrudUseCase.selectActiveTeacher(teacherId);
      setTeachersRoster(updated);
      setSqlAuditLogs(container.studentRepository.getRecentSqlLogs());
    },
    [container]
  );

  // Operaciones de Misión y QR del Estudiante
  const answerQuestion = useCallback(
    async (questionId: string, optionId: string, advanceToNext: boolean) => {
      const updated =
        await container.completeMissionStepUseCase.executeAnswerSelection({
          student: currentStudent,
          mission: currentMission,
          currentProgress: studentProgress,
          questionId,
          selectedOptionId: optionId,
          advanceToNext,
        });
      setStudentProgress(updated);
      if (updated.isCompleted) {
        setShowSqliteSavedNotice(true);
      }
      setSqlAuditLogs(container.studentRepository.getRecentSqlLogs());
    },
    [container, currentStudent, currentMission, studentProgress]
  );

  const generateDynamicQr = useCallback(async () => {
    if (!studentProgress) return;
    const generated =
      await container.generateSignedQrUseCase.execute(studentProgress);
    setActiveQrPayload(generated.payload);
    setActiveQrJson(generated.serializedJson);
    setSqlAuditLogs(container.studentRepository.getRecentSqlLogs());
  }, [container, studentProgress]);

  const resetCurrentMission = useCallback(async () => {
    await container.studentRepository.resetProgress(
      currentStudent.id,
      currentMission.id
    );
    setStudentProgress(null);
    setShowSqliteSavedNotice(false);
    setActiveQrPayload(null);
    setActiveQrJson(null);
    setSqlAuditLogs(container.studentRepository.getRecentSqlLogs());
  }, [container, currentStudent.id, currentMission.id]);

  // Operaciones Docente: Escaneo QR y Asistencia
  const scanQrPayloadString = useCallback(
    async (rawQrString: string): Promise<QrScanVerificationResult> => {
      const result = await container.processScannedQrUseCase.execute(
        rawQrString,
        activeTeacher.name
      );
      setLastScanResult(result);
      await refreshAllData();
      return result;
    },
    [container, activeTeacher.name, refreshAllData]
  );

  const simulateTamperedQrScan = useCallback(async () => {
    const basePayload: VeredaSyncQrPayload = activeQrPayload ?? {
      v: 1,
      tx: 'f9a1-77c2',
      id: currentStudent.id,
      n: currentStudent.name,
      g: currentStudent.grade,
      m: currentMission.subject,
      s: 33,
      ts: Math.floor(Date.now() / 1000),
      sig: 'a94f0192bc8471625384910293847561a94f0192bc8471625384910293847561',
    };
    await scanQrPayloadString(JSON.stringify({ ...basePayload, s: 100 }));
  }, [activeQrPayload, currentStudent, currentMission.subject, scanQrPayloadString]);

  const markStudentAttendanceManual = useCallback(
    async (student: StudentProfile, status: AttendanceStatus) => {
      const updated =
        await container.manageAttendanceUseCase.recordStudentAttendance({
          student,
          status,
          source: 'MANUAL_DOCENTE',
          teacherName: activeTeacher.name,
        });
      setAttendanceRecords(updated);
      setSqlAuditLogs(container.studentRepository.getRecentSqlLogs());
    },
    [container, activeTeacher.name]
  );

  const markAllStudentsPresent = useCallback(async () => {
    const updated =
      await container.manageAttendanceUseCase.markEntireClassPresent(
        studentsRoster,
        activeTeacher.name
      );
    setAttendanceRecords(updated);
    setSqlAuditLogs(container.studentRepository.getRecentSqlLogs());
  }, [container, studentsRoster, activeTeacher.name]);

  const exportGrades = useCallback(
    async (format: 'CSV' | 'JSON') => {
      const result = await container.exportClassroomGradesUseCase.execute(format);
      setLastExportResult(result);
    },
    [container]
  );

  const resetTeacherDemoData = useCallback(async () => {
    await container.teacherRepository.resetDemoRecords();
    setLastScanResult(null);
    setLastExportResult(null);
    await refreshAllData();
  }, [container, refreshAllData]);

  return (
    <AppContainerContext.Provider
      value={{
        activeRole,
        rolePermission: ROLE_PERMISSIONS[activeRole],
        setActiveRole,
        studentsRoster,
        currentStudent,
        selectStudent,
        teachersRoster,
        activeTeacher,
        upsertStudent,
        removeStudent,
        upsertTeacher,
        removeTeacher,
        selectActiveTeacher,
        missionsCatalog: RURAL_MISSIONS_CATALOG,
        currentMission,
        selectMission,
        studentProgress,
        showSqliteSavedNotice,
        dismissSqliteSavedNotice: () => setShowSqliteSavedNotice(false),
        activeQrPayload,
        activeQrJson,
        answerQuestion,
        generateDynamicQr,
        resetCurrentMission,
        classroomRecords,
        classroomStats,
        attendanceRecords,
        attendanceStats,
        lastScanResult,
        lastExportResult,
        sqlAuditLogs,
        scanQrPayloadString,
        simulateTamperedQrScan,
        markStudentAttendanceManual,
        markAllStudentsPresent,
        exportGrades,
        resetTeacherDemoData,
      }}
    >
      {children}
    </AppContainerContext.Provider>
  );
};

export const useAppContainer = (): AppContainerContextValue => {
  const ctx = useContext(AppContainerContext);
  if (!ctx) {
    throw new Error('useAppContainer debe usarse dentro de AppContainerProvider');
  }
  return ctx;
};
