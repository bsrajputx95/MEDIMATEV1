import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pill, Clock, User, CheckCircle, Circle, Bell, AlertTriangle } from 'lucide-react-native';
import { Medication } from '../../types/cura';

interface MedicationCardProps {
  medication: Medication;
  onToggleTaken?: (medicationId: string, taken: boolean) => void;
  onSetReminder?: (medicationId: string) => void;
}

export default function MedicationCard({ 
  medication, 
  onToggleTaken, 
  onSetReminder 
}: MedicationCardProps) {
  const [localTaken, setLocalTaken] = useState(medication.taken);

  const handleToggleTaken = () => {
    const newTaken = !localTaken;
    setLocalTaken(newTaken);
    onToggleTaken?.(medication.id, newTaken);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getNextReminderTime = () => {
    if (medication.reminderTimes.length === 0) return null;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (const time of medication.reminderTimes) {
      const [hours, minutes] = time.split(':').map(Number);
      const reminderTime = hours * 60 + minutes;
      
      if (reminderTime > currentTime) {
        return time;
      }
    }
    
    return medication.reminderTimes[0];
  };

  const nextReminder = getNextReminderTime();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.medicationInfo}>
          <View style={styles.pillIcon}>
            <Pill size={20} color="#6366f1" />
          </View>
          <View style={styles.medicationDetails}>
            <Text style={styles.medicationName}>{medication.name}</Text>
            <Text style={styles.dosageInfo}>
              {medication.dosage} • {medication.frequency}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.takenButton}
          onPress={handleToggleTaken}
        >
          {localTaken ? (
            <CheckCircle size={24} color="#10b981" />
          ) : (
            <Circle size={24} color="#d1d5db" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.detailRow}>
          <User size={16} color="#64748b" />
          <Text style={styles.detailText}>Prescribed by {medication.prescribedBy}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={16} color="#64748b" />
          <Text style={styles.detailText}>Started {formatDate(medication.startDate)}</Text>
        </View>

        {nextReminder && (
          <View style={styles.reminderContainer}>
            <View style={styles.reminderHeader}>
              <Bell size={16} color="#f59e0b" />
              <Text style={styles.reminderLabel}>Next reminder: {nextReminder}</Text>
            </View>
            {onSetReminder && (
              <TouchableOpacity 
                style={styles.reminderButton}
                onPress={() => onSetReminder(medication.id)}
              >
                <Text style={styles.reminderButtonText}>Adjust</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsLabel}>Instructions:</Text>
          <Text style={styles.instructionsText}>{medication.instructions}</Text>
        </View>

        {medication.sideEffects && medication.sideEffects.length > 0 && (
          <View style={styles.sideEffectsContainer}>
            <View style={styles.sideEffectsHeader}>
              <AlertTriangle size={16} color="#ef4444" />
              <Text style={styles.sideEffectsLabel}>Possible Side Effects:</Text>
            </View>
            <Text style={styles.sideEffectsText}>
              {medication.sideEffects.join(', ')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator, 
            { backgroundColor: localTaken ? '#10b981' : '#f59e0b' }
          ]} />
          <Text style={[
            styles.statusText,
            { color: localTaken ? '#10b981' : '#f59e0b' }
          ]}>
            {localTaken ? 'Taken today' : 'Not taken yet'}
          </Text>
        </View>
        
        {medication.endDate && (
          <Text style={styles.endDateText}>
            Until {formatDate(medication.endDate)}
          </Text>
        )}
      </View>
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
  medicationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  pillIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationDetails: {
    flex: 1,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 2,
  },
  dosageInfo: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500' as const,
  },
  takenButton: {
    padding: 4,
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
  reminderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  reminderLabel: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '600' as const,
  },
  reminderButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  reminderButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  instructionsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
  },
  instructionsLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  sideEffectsContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  sideEffectsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sideEffectsLabel: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '600' as const,
  },
  sideEffectsText: {
    fontSize: 12,
    color: '#dc2626',
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  endDateText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500' as const,
  },
});