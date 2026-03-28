import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, Star, MapPin, Clock, DollarSign, MessageCircle } from 'lucide-react-native';
import { Doctor } from '../../types/cura';

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment?: (doctorId: string) => void;
  onViewProfile?: (doctorId: string) => void;
}

export default function DoctorCard({ doctor, onBookAppointment, onViewProfile }: DoctorCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={12} color="#f59e0b" fill="#f59e0b" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={12} color="#f59e0b" fill="#f59e0b" />
      );
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={12} color="#d1d5db" />
      );
    }
    
    return stars;
  };

  const getAvailabilityColor = (availability: string) => {
    if (availability.includes('today')) return '#10b981';
    if (availability.includes('Tomorrow')) return '#f59e0b';
    return '#6366f1';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.doctorInfo}>
          <View style={styles.avatar}>
            <User size={24} color="#6366f1" />
          </View>
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.specialty}>{doctor.specialty}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {renderStars(doctor.rating)}
              </View>
              <Text style={styles.ratingText}>
                {doctor.rating} ({doctor.experience})
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.detailRow}>
          <MapPin size={16} color="#64748b" />
          <Text style={styles.detailText}>{doctor.location}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={16} color={getAvailabilityColor(doctor.availability)} />
          <Text style={[
            styles.detailText, 
            { color: getAvailabilityColor(doctor.availability) }
          ]}>
            {doctor.availability}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <DollarSign size={16} color="#64748b" />
          <Text style={styles.detailText}>
            Consultation: ${doctor.consultationFee}
          </Text>
        </View>

        <View style={styles.languagesContainer}>
          <Text style={styles.languagesLabel}>Languages:</Text>
          <View style={styles.languagesList}>
            {doctor.languages.map((language, index) => (
              <View key={language} style={styles.languageTag}>
                <Text style={styles.languageText}>{language}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        {onViewProfile && (
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => onViewProfile(doctor.id)}
          >
            <User size={16} color="#6366f1" />
            <Text style={styles.profileButtonText}>View Profile</Text>
          </TouchableOpacity>
        )}
        
        {onBookAppointment && (
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => onBookAppointment(doctor.id)}
          >
            <MessageCircle size={16} color="#ffffff" />
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>
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
    marginBottom: 16,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500' as const,
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
  languagesContainer: {
    gap: 8,
  },
  languagesLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600' as const,
  },
  languagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  languageTag: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  languageText: {
    fontSize: 12,
    color: '#475569',
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
  profileButton: {
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
  profileButtonText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  bookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
});