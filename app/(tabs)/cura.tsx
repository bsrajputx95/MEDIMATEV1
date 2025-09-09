import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAssistant } from '@/contexts/AssistantContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Bell,
  Camera,
  Video,
  FileText,
  Stethoscope,
  Activity,

  Users,
  TrendingUp,
  ChevronRight,
  X,
} from 'lucide-react-native';

import AppointmentCard from '../../components/cura/AppointmentCard';
import TestReportCard from '../../components/cura/TestReportCard';
import MedicationCard from '../../components/cura/MedicationCard';
import DoctorCard from '../../components/cura/DoctorCard';
import TreatmentPlanCard from '../../components/cura/TreatmentPlanCard';

import {
  mockAppointments,
  mockTestReports,
  mockMedications,
  mockDoctors,
  mockTreatmentPlans,
} from '../../constants/cura';

const { width } = Dimensions.get('window');

type TabType = 'overview' | 'appointments' | 'tests' | 'medications' | 'doctors' | 'treatments';

interface QuickActionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
}

const QuickActionCard: React.FC<QuickActionProps> = ({ title, subtitle, icon, color, onPress }) => {
  return (
    <TouchableOpacity style={[styles.quickActionCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        {/* eslint-disable-next-line @rork/linters/general-no-raw-text */}
        {icon}
      </View>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={20} color="#64748b" />
    </TouchableOpacity>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        {/* eslint-disable-next-line @rork/linters/general-no-raw-text */}
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
};

export default function CuraScreen() {
  const { setCurrentScreen } = useAssistant();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  
  useFocusEffect(
    React.useCallback(() => {
      setCurrentScreen('CURA');
      console.log('📱 Screen changed to: CURA');
    }, [setCurrentScreen])
  );

  const handleBookAppointment = () => {
    Alert.alert('Book Appointment', 'Opening appointment booking form...');
  };

  const handleJoinConsult = () => {
    Alert.alert('Join Consultation', 'Starting video consultation...');
  };

  const handleScanReport = () => {
    Alert.alert('Scan Report', 'Opening camera to scan medical reports...');
  };

  const handleUploadReport = () => {
    Alert.alert('Upload Report', 'Opening file picker to upload reports...');
  };

  const handleViewAppointment = (appointmentId: string) => {
    Alert.alert('View Appointment', `Opening appointment details for ID: ${appointmentId}`);
  };

  const handleEditAppointment = (appointment: any) => {
    Alert.alert('Edit Appointment', `Editing appointment with ${appointment.doctorName}`);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', style: 'destructive', onPress: () => console.log('Cancelled:', appointmentId) }
      ]
    );
  };

  const handleViewReport = (reportId: string) => {
    Alert.alert('View Report', `Opening report details for ID: ${reportId}`);
  };

  const handleDownloadReport = (reportId: string) => {
    Alert.alert('Download Report', `Downloading report ID: ${reportId}`);
  };

  const handleToggleMedication = (medicationId: string, taken: boolean) => {
    console.log(`Medication ${medicationId} marked as ${taken ? 'taken' : 'not taken'}`);
  };

  const handleSetReminder = (medicationId: string) => {
    Alert.alert('Set Reminder', `Setting reminder for medication ID: ${medicationId}`);
  };

  const handleBookDoctorAppointment = (doctorId: string) => {
    Alert.alert('Book Appointment', `Booking appointment with doctor ID: ${doctorId}`);
  };

  const handleViewDoctorProfile = (doctorId: string) => {
    Alert.alert('View Profile', `Opening profile for doctor ID: ${doctorId}`);
  };

  const handleViewTreatmentPlan = (planId: string) => {
    Alert.alert('View Treatment Plan', `Opening treatment plan ID: ${planId}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            {/* Stats Overview */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Health Overview</Text>
              <View style={styles.statsGrid}>
                <StatCard
                  title="Appointments"
                  value="3"
                  icon={<Calendar size={20} color="#6366f1" />}
                  color="#6366f1"
                />
                <StatCard
                  title="Medications"
                  value="5"
                  icon={<Activity size={20} color="#10b981" />}
                  color="#10b981"
                />
                <StatCard
                  title="Test Reports"
                  value="8"
                  icon={<FileText size={20} color="#f59e0b" />}
                  color="#f59e0b"
                />
                <StatCard
                  title="Doctors"
                  value="12"
                  icon={<Stethoscope size={20} color="#ef4444" />}
                  color="#ef4444"
                />
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                <QuickActionCard
                  title="Book Appointment"
                  subtitle="Schedule with doctors"
                  icon={<Calendar size={20} color="#6366f1" />}
                  color="#6366f1"
                  onPress={handleBookAppointment}
                />
                <QuickActionCard
                  title="Join Consultation"
                  subtitle="Video/Audio call"
                  icon={<Video size={20} color="#10b981" />}
                  color="#10b981"
                  onPress={handleJoinConsult}
                />
                <QuickActionCard
                  title="Scan Report"
                  subtitle="Upload test results"
                  icon={<Camera size={20} color="#f59e0b" />}
                  color="#f59e0b"
                  onPress={handleScanReport}
                />
                <QuickActionCard
                  title="Upload Files"
                  subtitle="Add medical documents"
                  icon={<FileText size={20} color="#ef4444" />}
                  color="#ef4444"
                  onPress={handleUploadReport}
                />
              </View>
            </View>

            {/* Upcoming Appointments */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
                <TouchableOpacity onPress={() => setActiveTab('appointments')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              {mockAppointments
                .filter(apt => apt.status === 'upcoming')
                .slice(0, 2)
                .map(appointment => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={handleEditAppointment}
                    onCancel={handleCancelAppointment}
                    onJoinCall={handleViewAppointment}
                  />
                ))}
            </View>

            {/* Today's Medications */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today&apos;s Medications</Text>
                <TouchableOpacity onPress={() => setActiveTab('medications')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              {mockMedications.slice(0, 2).map(medication => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  onToggleTaken={handleToggleMedication}
                  onSetReminder={handleSetReminder}
                />
              ))}
            </View>
          </View>
        );

      case 'appointments':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>All Appointments</Text>
            {mockAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onEdit={handleEditAppointment}
                onCancel={handleCancelAppointment}
                onJoinCall={handleViewAppointment}
              />
            ))}
          </View>
        );

      case 'tests':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Test Reports</Text>
            {mockTestReports.map(report => (
              <TestReportCard
                key={report.id}
                report={report}
                onView={handleViewReport}
                onDownload={handleDownloadReport}
              />
            ))}
          </View>
        );

      case 'medications':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Medications</Text>
            {mockMedications.map(medication => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onToggleTaken={handleToggleMedication}
                onSetReminder={handleSetReminder}
              />
            ))}
          </View>
        );

      case 'doctors':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Doctor Directory</Text>
            {mockDoctors.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onBookAppointment={handleBookDoctorAppointment}
                onViewProfile={handleViewDoctorProfile}
              />
            ))}
          </View>
        );

      case 'treatments':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Treatment Plans</Text>
            {mockTreatmentPlans.map(plan => (
              <TreatmentPlanCard
                key={plan.id}
                plan={plan}
                onViewDetails={handleViewTreatmentPlan}
              />
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: <TrendingUp size={16} color={activeTab === 'overview' ? '#6366f1' : '#64748b'} /> },
    { key: 'appointments', label: 'Appointments', icon: <Calendar size={16} color={activeTab === 'appointments' ? '#6366f1' : '#64748b'} /> },
    { key: 'tests', label: 'Tests', icon: <FileText size={16} color={activeTab === 'tests' ? '#6366f1' : '#64748b'} /> },
    { key: 'medications', label: 'Medications', icon: <Activity size={16} color={activeTab === 'medications' ? '#6366f1' : '#64748b'} /> },
    { key: 'doctors', label: 'Doctors', icon: <Users size={16} color={activeTab === 'doctors' ? '#6366f1' : '#64748b'} /> },
    { key: 'treatments', label: 'Treatments', icon: <Stethoscope size={16} color={activeTab === 'treatments' ? '#6366f1' : '#64748b'} /> },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>CURA</Text>
            <Text style={styles.headerSubtitle}>Medication & Treatment Tracking</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setSearchModalVisible(true)}
            >
              <Search size={20} color="#6366f1" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <Filter size={20} color="#6366f1" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Bell size={20} color="#6366f1" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                activeTab === tab.key && styles.activeTabButton
              ]}
              onPress={() => setActiveTab(tab.key as TabType)}
            >
              {tab.icon}
              <Text style={[
                styles.tabButtonText,
                activeTab === tab.key && styles.activeTabButtonText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderTabContent()}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleBookAppointment}>
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>Filter options will be implemented here</Text>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Search Modal */}
      <Modal
        visible={searchModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSearchModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search</Text>
              <TouchableOpacity onPress={() => setSearchModalVisible(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>Search functionality will be implemented here</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500' as const,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  tabNavigation: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabScrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: '#6366f1',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#64748b',
  },
  activeTabButtonText: {
    color: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  tabContent: {
    padding: 24,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 72) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#1e293b',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600' as const,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderLeftWidth: 4,
    gap: 12,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500' as const,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1e293b',
  },
  modalText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center' as const,
  },
});