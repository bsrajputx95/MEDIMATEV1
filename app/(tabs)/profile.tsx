import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAssistant } from '@/contexts/AssistantContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  User,
  Heart,
  Target,
  Award,
  FileText,
  Settings,
  Edit3,
  Phone,
  Weight,
  Ruler,
  Droplet,
  AlertTriangle,
  TrendingUp,
  Shield,
} from 'lucide-react-native';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';

type TabType = 'overview' | 'health' | 'goals' | 'records' | 'settings';

export default function ProfileScreen() {
  const { setCurrentScreen } = useAssistant();
  const { profile, isLoading, calculateBMI, getRiskLevel } = useProfile();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  useFocusEffect(
    React.useCallback(() => {
      setCurrentScreen('Profile');
      console.log('📱 Screen changed to: Profile');
    }, [setCurrentScreen])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab profile={profile} calculateBMI={calculateBMI} getRiskLevel={getRiskLevel} />;
      case 'health':
        return <HealthTab profile={profile} />;
      case 'goals':
        return <GoalsTab profile={profile} />;
      case 'records':
        return <RecordsTab profile={profile} />;
      case 'settings':
        return <SettingsTab profile={profile} onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {profile.personalInfo.profilePhoto ? (
              <Image source={{ uri: profile.personalInfo.profilePhoto }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={32} color="#ffffff" />
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.personalInfo.name}</Text>
            <Text style={styles.profileEmail}>{profile.personalInfo.email}</Text>
            <Text style={styles.profileAge}>{profile.personalInfo.age} years old</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Edit3 size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {[
            { key: 'overview', label: 'Overview', icon: User },
            { key: 'health', label: 'Health', icon: Heart },
            { key: 'goals', label: 'Goals', icon: Target },
            { key: 'records', label: 'Records', icon: FileText },
            { key: 'settings', label: 'Settings', icon: Settings },
          ].map(({ key, label, icon: Icon }) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.tab,
                activeTab === key && styles.activeTab,
              ]}
              onPress={() => setActiveTab(key as TabType)}
            >
              <Icon
                size={18}
                color={activeTab === key ? '#2563eb' : '#64748b'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === key && styles.activeTabText,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

// Overview Tab Component
function OverviewTab({ profile, calculateBMI, getRiskLevel }: any) {
  const bmi = calculateBMI();
  const heartRisk = getRiskLevel('heart');
  const diabetesRisk = getRiskLevel('diabetes');

  return (
    <View style={styles.tabContent}>
      {/* Quick Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Weight size={24} color="#2563eb" />
            <Text style={styles.statValue}>{profile.vitalsStats.weight} lbs</Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
          <View style={styles.statCard}>
            <Ruler size={24} color="#10b981" />
            <Text style={styles.statValue}>{bmi}</Text>
            <Text style={styles.statLabel}>BMI</Text>
          </View>
          <View style={styles.statCard}>
            <Heart size={24} color="#ef4444" />
            <Text style={styles.statValue}>{profile.vitalsStats.restingHeartRate}</Text>
            <Text style={styles.statLabel}>Heart Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Droplet size={24} color="#dc2626" />
            <Text style={styles.statValue}>{profile.healthBasics.bloodType}</Text>
            <Text style={styles.statLabel}>Blood Type</Text>
          </View>
        </View>
      </View>

      {/* Risk Assessment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Risk Assessment</Text>
        <View style={styles.riskContainer}>
          <RiskCard title="Heart Disease" level={heartRisk} />
          <RiskCard title="Diabetes" level={diabetesRisk} />
        </View>
      </View>

      {/* Recent Goals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Goals</Text>
        {profile.healthGoals.slice(0, 3).map((goal: any) => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalProgress}>{goal.progress}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${goal.progress}%` }]} />
            </View>
            <Text style={styles.goalStats}>
              {goal.current} / {goal.target} {goal.unit}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Health Tab Component
function HealthTab({ profile }: any) {
  return (
    <View style={styles.tabContent}>
      {/* Health Basics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Basics</Text>
        <View style={styles.infoCard}>
          <InfoRow icon={Droplet} label="Blood Type" value={profile.healthBasics.bloodType} />
          <InfoRow icon={AlertTriangle} label="Allergies" value={profile.healthBasics.allergies.join(', ') || 'None'} />
          <InfoRow icon={Heart} label="Conditions" value={profile.healthBasics.chronicConditions.join(', ') || 'None'} />
        </View>
      </View>

      {/* Current Medications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Medications</Text>
        {profile.healthBasics.medications.map((med: any, index: number) => (
          <View key={index} style={styles.medicationCard}>
            <Text style={styles.medicationName}>{med.name}</Text>
            <Text style={styles.medicationDetails}>{med.dosage} - {med.frequency}</Text>
            <Text style={styles.medicationType}>{med.type}</Text>
          </View>
        ))}
      </View>

      {/* Latest Lab Results */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Lab Results</Text>
        {profile.vitalsStats.latestLabResults.map((result: any, index: number) => (
          <View key={index} style={styles.labResultCard}>
            <View style={styles.labResultHeader}>
              <Text style={styles.labResultTest}>{result.test}</Text>
              <Text style={styles.labResultDate}>{result.date}</Text>
            </View>
            <Text style={styles.labResultValue}>{result.value}</Text>
            <Text style={styles.labResultRange}>Normal: {result.normalRange}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Goals Tab Component
function GoalsTab({ profile }: any) {
  return (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Goals</Text>
        {profile.healthGoals.map((goal: any) => (
          <View key={goal.id} style={styles.goalDetailCard}>
            <View style={styles.goalDetailHeader}>
              <View>
                <Text style={styles.goalDetailTitle}>{goal.title}</Text>
                <Text style={styles.goalDetailType}>{goal.type}</Text>
              </View>
              <View style={styles.goalDetailProgress}>
                <Text style={styles.goalDetailPercentage}>{goal.progress}%</Text>
                {goal.isCompleted && <Award size={20} color="#10b981" />}
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${goal.progress}%` }]} />
            </View>
            <View style={styles.goalDetailStats}>
              <Text style={styles.goalDetailCurrent}>{goal.current} {goal.unit}</Text>
              <Text style={styles.goalDetailTarget}>Target: {goal.target} {goal.unit}</Text>
              <Text style={styles.goalDetailDeadline}>Due: {goal.deadline}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsGrid}>
          {profile.achievements.map((achievement: any) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <Award size={24} color="#f59e0b" />
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
              <Text style={styles.achievementDate}>{achievement.unlockedAt}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// Records Tab Component
function RecordsTab({ profile }: any) {
  return (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Records</Text>
        {profile.medicalRecords.map((record: any) => (
          <View key={record.id} style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <FileText size={20} color="#2563eb" />
              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>{record.title}</Text>
                <Text style={styles.recordType}>{record.type}</Text>
              </View>
              <Text style={styles.recordDate}>{record.date}</Text>
            </View>
            <Text style={styles.recordDescription}>{record.description}</Text>
            <View style={styles.recordTags}>
              {record.tags.map((tag: string, index: number) => (
                <View key={index} style={styles.recordTag}>
                  <Text style={styles.recordTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// Settings Tab Component
function SettingsTab({ profile, onLogout }: any) {
  return (
    <View style={styles.tabContent}>
      {/* Emergency Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contact</Text>
        <View style={styles.infoCard}>
          <InfoRow icon={User} label="Name" value={profile.personalInfo.emergencyContact.name} />
          <InfoRow icon={Heart} label="Relationship" value={profile.personalInfo.emergencyContact.relationship} />
          <InfoRow icon={Phone} label="Phone" value={profile.personalInfo.emergencyContact.phone} />
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingsCard}>
          <SettingRow label="Appointments" value={profile.appSettings.notifications.appointments} />
          <SettingRow label="Medications" value={profile.appSettings.notifications.medications} />
          <SettingRow label="Health Alerts" value={profile.appSettings.notifications.healthAlerts} />
          <SettingRow label="Goals" value={profile.appSettings.notifications.goals} />
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.settingsCard}>
          <InfoRow icon={Settings} label="Language" value={profile.appSettings.language} />
          <InfoRow icon={TrendingUp} label="Font Size" value={profile.appSettings.accessibility.fontSize} />
          <InfoRow icon={Shield} label="High Contrast" value={profile.appSettings.accessibility.highContrast ? 'On' : 'Off'} />
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

// Helper Components
function RiskCard({ title, level }: { title: string; level: string }) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return '#10b981';
      case 'Moderate': return '#f59e0b';
      case 'High': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <View style={styles.riskCard}>
      <Text style={styles.riskTitle}>{title}</Text>
      <Text style={[styles.riskLevel, { color: getRiskColor(level) }]}>{level}</Text>
    </View>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Icon size={16} color="#64748b" />
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function SettingRow({ label, value }: { label: string; value: boolean }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={[styles.toggle, value && styles.toggleActive]}>
        <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#1e293b',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  profileAge: {
    fontSize: 14,
    color: '#64748b',
  },
  editButton: {
    padding: 8,
  },
  tabContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabScroll: {
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  activeTab: {
    backgroundColor: '#dbeafe',
  },
  tabText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '500' as const,
  },
  activeTabText: {
    color: '#2563eb',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#1e293b',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#1e293b',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  riskContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  riskCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  riskTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  riskLevel: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  goalCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1e293b',
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: '#2563eb',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 3,
  },
  goalStats: {
    fontSize: 12,
    color: '#64748b',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
    fontWeight: '500' as const,
  },
  medicationCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1e293b',
    marginBottom: 4,
  },
  medicationDetails: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  medicationType: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500' as const,
  },
  labResultCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  labResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labResultTest: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1e293b',
  },
  labResultDate: {
    fontSize: 12,
    color: '#64748b',
  },
  labResultValue: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#2563eb',
    marginBottom: 4,
  },
  labResultRange: {
    fontSize: 12,
    color: '#64748b',
  },
  goalDetailCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  goalDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalDetailTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1e293b',
    marginBottom: 4,
  },
  goalDetailType: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500' as const,
  },
  goalDetailProgress: {
    alignItems: 'flex-end',
  },
  goalDetailPercentage: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#2563eb',
    marginBottom: 4,
  },
  goalDetailStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  goalDetailCurrent: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1e293b',
  },
  goalDetailTarget: {
    fontSize: 12,
    color: '#64748b',
  },
  goalDetailDeadline: {
    fontSize: 12,
    color: '#64748b',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1e293b',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 10,
    color: '#64748b',
  },
  recordCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1e293b',
    marginBottom: 2,
  },
  recordType: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500' as const,
  },
  recordDate: {
    fontSize: 12,
    color: '#64748b',
  },
  recordDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  recordTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  recordTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recordTagText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500' as const,
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingLabel: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500' as const,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#2563eb',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});