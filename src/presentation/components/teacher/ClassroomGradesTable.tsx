/**
 * @file src/presentation/components/teacher/ClassroomGradesTable.tsx
 * @description Componente de Interfaz para Gestión de Calificaciones Local de la Docente:
 *  - RF-D04 (Consolidado Automático del Aula): Tabla estructurada con Nombre del Alumno,
 *    Grado, Materia, Calificación (%) y Fecha/Hora.
 *  - RF-D05 (Exportación Local): Botones para exportar a CSV (sanitizado) o JSON.
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  ClassroomGradeRecord,
  ClassroomSummaryStats,
} from '../../../domain/entities/GradeRecord';
import { ExportResult } from '../../../domain/services/IExportService';
import { SOLAR_COLORS } from '../../theme/colors';

interface ClassroomGradesTableProps {
  records: ClassroomGradeRecord[];
  stats: ClassroomSummaryStats;
  lastExportResult: ExportResult | null;
  sqlAuditLogs: string[];
  onExport: (format: 'CSV' | 'JSON') => Promise<void>;
  onResetRecords: () => Promise<void>;
}

export const ClassroomGradesTable: React.FC<ClassroomGradesTableProps> = ({
  records,
  stats,
  lastExportResult,
  sqlAuditLogs,
  onExport,
  onResetRecords,
}) => {
  const [showSqlConsole, setShowSqlConsole] = useState(false);

  return (
    <View style={styles.tableCard}>
      {/* Resumen estadístico del aula multigrado */}
      <View style={styles.statsStrip}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.totalRecords}</Text>
          <Text style={styles.statLabel}>Notas en SQLite</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.averageScore}%</Text>
          <Text style={styles.statLabel}>Promedio Grupo</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.averageDecodeMs} ms</Text>
          <Text style={styles.statLabel}>Lectura QR Prom.</Text>
        </View>
      </View>

      {/* Cabecera de la tabla y botones de exportación (RF-D05) */}
      <View style={styles.toolbarRow}>
        <Text style={styles.tableTitle}>
          📋 Consolidado Automático del Aula (RF-D04)
        </Text>
        <View style={styles.exportButtonsRow}>
          <Pressable
            onPress={() => void onExport('CSV')}
            style={styles.exportCsvBtn}
          >
            <Text style={styles.exportBtnText}>⬇ Exportar CSV</Text>
          </Pressable>
          <Pressable
            onPress={() => void onExport('JSON')}
            style={styles.exportJsonBtn}
          >
            <Text style={styles.exportBtnText}>⬇ Exportar JSON</Text>
          </Pressable>
        </View>
      </View>

      {/* Encabezados de columnas requeridas en RF-D04 */}
      <View style={styles.tableHeader}>
        <Text style={[styles.colHeader, styles.colStudent]}>
          Nombre del Alumno
        </Text>
        <Text style={[styles.colHeader, styles.colGrade]}>Grado</Text>
        <Text style={[styles.colHeader, styles.colSubject]}>Materia</Text>
        <Text style={[styles.colHeader, styles.colScore]}>Calif. (%)</Text>
        <Text style={[styles.colHeader, styles.colDate]}>Fecha / Hora</Text>
      </View>

      {/* Filas de registros verificados */}
      {records.map((rec) => {
        const formattedTime = new Date(rec.scannedAtIso).toLocaleTimeString(
          'es-CO',
          {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }
        );

        return (
          <View key={rec.transactionId} style={styles.tableRow}>
            <View style={styles.colStudent}>
              <Text style={styles.studentNameText}>{rec.studentName}</Text>
              <Text style={styles.txSubtext}>tx: {rec.transactionId}</Text>
            </View>
            <Text style={[styles.cellText, styles.colGrade]}>{rec.grade}</Text>
            <Text style={[styles.cellText, styles.colSubject]}>
              {rec.subject}
            </Text>
            <View style={styles.colScore}>
              <View
                style={[
                  styles.scorePill,
                  rec.scorePercentage >= 80
                    ? styles.scorePillHigh
                    : styles.scorePillMid,
                ]}
              >
                <Text style={styles.scorePillText}>{rec.scorePercentage}%</Text>
              </View>
            </View>
            <Text style={[styles.cellTimeText, styles.colDate]}>
              {formattedTime}
            </Text>
          </View>
        );
      })}

      {/* Vista previa de exportación local (RF-D05) */}
      {lastExportResult ? (
        <View style={styles.exportPreviewBox}>
          <Text style={styles.exportPreviewTitle}>
            ✅ {lastExportResult.message} ({lastExportResult.fileName})
          </Text>
          <Text style={styles.exportPreviewCode} numberOfLines={5}>
            {lastExportResult.contentPreview}
          </Text>
        </View>
      ) : null}

      {/* Consola de auditoría de sentencias SQLite parametrizadas */}
      <View style={styles.footerActions}>
        <Pressable
          onPress={() => setShowSqlConsole((prev) => !prev)}
          style={styles.sqlToggleBtn}
        >
          <Text style={styles.sqlToggleText}>
            {showSqlConsole
              ? '▲ Ocultar Bitácora SQLite'
              : '▼ Ver Sentencias SQLite Parametrizadas'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => void onResetRecords()}
          style={styles.resetTableBtn}
        >
          <Text style={styles.resetTableText}>Restaurar Datos Semilla</Text>
        </Pressable>
      </View>

      {showSqlConsole ? (
        <View style={styles.sqlConsoleBox}>
          <Text style={styles.sqlConsoleHeader}>
            🔒 Auditoría SQLite Local (Consultas Parametrizadas Anti-SQLi):
          </Text>
          {sqlAuditLogs.slice(0, 6).map((log, idx) => (
            <Text key={idx} style={styles.sqlLogLine}>
              {log}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  tableCard: {
    backgroundColor: SOLAR_COLORS.surfaceWhite,
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: SOLAR_COLORS.navyPrimary,
  },
  statsStrip: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: SOLAR_COLORS.navyLight,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SOLAR_COLORS.borderStrong,
  },
  statValue: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  statLabel: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tableTitle: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  exportButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  exportCsvBtn: {
    backgroundColor: SOLAR_COLORS.navyPrimary,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  exportJsonBtn: {
    backgroundColor: SOLAR_COLORS.appleGreenDark,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  exportBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: SOLAR_COLORS.navyPrimary,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
  },
  colHeader: {
    color: SOLAR_COLORS.textOnNavy,
    fontSize: 11,
    fontWeight: '800',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: SOLAR_COLORS.borderStrong,
    backgroundColor: SOLAR_COLORS.surfaceMuted,
  },
  colStudent: {
    flex: 2.2,
  },
  colGrade: {
    flex: 0.8,
    textAlign: 'center',
  },
  colSubject: {
    flex: 1.8,
  },
  colScore: {
    flex: 1.1,
    alignItems: 'center',
  },
  colDate: {
    flex: 1.3,
    textAlign: 'right',
  },
  studentNameText: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  txSubtext: {
    color: SOLAR_COLORS.textMuted,
    fontSize: 10,
    fontFamily: 'monospace',
  },
  cellText: {
    color: SOLAR_COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  cellTimeText: {
    color: SOLAR_COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  scorePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  scorePillHigh: {
    backgroundColor: SOLAR_COLORS.successBg,
  },
  scorePillMid: {
    backgroundColor: SOLAR_COLORS.warningBg,
  },
  scorePillText: {
    color: SOLAR_COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '900',
  },
  exportPreviewBox: {
    marginTop: 10,
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
  },
  exportPreviewTitle: {
    color: SOLAR_COLORS.appleGreen,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  exportPreviewCode: {
    color: '#E2E8F0',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  sqlToggleBtn: {
    paddingVertical: 4,
  },
  sqlToggleText: {
    color: SOLAR_COLORS.navyPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  resetTableBtn: {
    paddingVertical: 4,
  },
  resetTableText: {
    color: SOLAR_COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  sqlConsoleBox: {
    marginTop: 8,
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
    gap: 4,
  },
  sqlConsoleHeader: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  sqlLogLine: {
    color: '#CBD5E1',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});
