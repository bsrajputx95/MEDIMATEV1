import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Download, Calendar, User, Building, Eye } from 'lucide-react-native';
import { TestReport } from '../../types/cura';

interface TestReportCardProps {
  report: TestReport;
  onView?: (reportId: string) => void;
  onDownload?: (reportId: string) => void;
}

export default function TestReportCard({ report, onView, onDownload }: TestReportCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'in-progress': return '#6366f1';
      default: return '#64748b';
    }
  };

  const getTestTypeIcon = (type: string) => {
    switch (type) {
      case 'blood': return '🩸';
      case 'urine': return '🧪';
      case 'x-ray': return '🦴';
      case 'mri': return '🧠';
      case 'ct': return '📷';
      case 'lab': return '🔬';
      case 'diagnostic': return '📋';
      case 'scan': return '📡';
      default: return '📄';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.testInfo}>
          <Text style={styles.testIcon}>{getTestTypeIcon(report.testType)}</Text>
          <View style={styles.testDetails}>
            <Text style={styles.testName}>{report.testName}</Text>
            <Text style={styles.testType}>{report.testType.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.detailRow}>
          <Calendar size={16} color="#64748b" />
          <Text style={styles.detailText}>{formatDate(report.date)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <User size={16} color="#64748b" />
          <Text style={styles.detailText}>{report.doctorName}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Building size={16} color="#64748b" />
          <Text style={styles.detailText}>{report.clinic}</Text>
        </View>

        {report.results && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsLabel}>Results:</Text>
            <Text style={styles.resultsText}>{report.results}</Text>
          </View>
        )}

        {report.value && report.normalRange && (
          <View style={styles.valuesContainer}>
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Value:</Text>
              <Text style={styles.valueText}>{report.value}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Normal Range:</Text>
              <Text style={styles.normalRangeText}>{report.normalRange}</Text>
            </View>
          </View>
        )}
      </View>

      {report.status === 'completed' && (
        <View style={styles.footer}>
          {onView && (
            <TouchableOpacity 
              style={styles.viewButton}
              onPress={() => onView(report.id)}
            >
              <Eye size={16} color="#6366f1" />
              <Text style={styles.viewButtonText}>View Report</Text>
            </TouchableOpacity>
          )}
          
          {onDownload && (
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={() => onDownload(report.id)}
            >
              <Download size={16} color="#ffffff" />
              <Text style={styles.downloadButtonText}>Download</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  testInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  testIcon: {
    fontSize: 24,
  },
  testDetails: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 2,
  },
  testType: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  content: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500' as const,
  },
  resultsContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  resultsLabel: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  resultsText: {
    fontSize: 14,
    color: '#15803d',
    lineHeight: 20,
  },
  valuesContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600' as const,
  },
  valueText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600' as const,
  },
  normalRangeText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500' as const,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  viewButtonText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  downloadButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
});