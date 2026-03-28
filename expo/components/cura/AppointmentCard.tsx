import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock, MapPin, User, Phone, Video, Edit3, X } from 'lucide-react-native';
import { Appointment } from '../../types/cura';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
  onCancel?: (appointmentId: string) => void;
  onJoinCall?: (appointmentId: string) => void;
}

export default function AppointmentCard({ 
  appointment, 
  onEdit, 
  onCancel, 
  onJoinCall 
}: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#10b981';
      case 'completed': return '#6366f1';
      case 'cancelled': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return '👨‍⚕️';
      case 'follow-up': return '🔄';
      case 'checkup': return '✅';
      case 'emergency': return '🚨';
      default: return '📅';
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Text style={styles.typeEmoji}>{getTypeIcon(appointment.type)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Text>
          </View>
        </View>
        
        {appointment.status === 'upcoming' && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => onEdit(appointment)}
              >
                <Edit3 size={16} color="#6366f1" />
              </TouchableOpacity>
            )}
            {onCancel && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]} 
                onPress={() => onCancel(appointment.id)}
              >
                <X size={16} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.doctorInfo}>
          <View style={styles.doctorAvatar}>
            <User size={20} color="#6366f1" />
          </View>
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{appointment.doctorName}</Text>
            <Text style={styles.specialty}>{appointment.specialty}</Text>
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Calendar size={16} color="#64748b" />
            <Text style={styles.detailText}>{formatDate(appointment.date)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Clock size={16} color="#64748b" />
            <Text style={styles.detailText}>{appointment.time}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MapPin size={16} color="#64748b" />
            <Text style={styles.detailText}>{appointment.location}</Text>
          </View>
        </View>

        {appointment.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{appointment.notes}</Text>
          </View>
        )}
      </View>

      {appointment.status === 'upcoming' && onJoinCall && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => onJoinCall(appointment.id)}
          >
            <Video size={18} color="#ffffff" />
            <Text style={styles.joinButtonText}>Join Consultation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.callButton}>
            <Phone size={16} color="#6366f1" />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
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
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeEmoji: {
    fontSize: 24,
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
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelButton: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  content: {
    gap: 16,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 2,
  },
  specialty: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500' as const,
  },
  appointmentDetails: {
    gap: 8,
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
  notesContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
  },
  notesLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  joinButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  callButtonText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600' as const,
  },
});