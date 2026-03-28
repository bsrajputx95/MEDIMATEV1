import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAssistant } from '@/contexts/AssistantContext';
import { router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import {
  User,
  Settings,
  Footprints,
  Heart,
  Droplets,
  Flame,
  Camera,
  MessageCircle,
  Plus,
  Clock,
  TrendingUp,
  Target,
  Activity,
  Brain,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ArrowUp,
  ArrowDown,

  ChevronDown,
  Calendar,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

interface MealCardProps {
  mealName: string;
  time: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  const getTarget = (title: string) => {
    switch (title) {
      case 'Steps': return '10K';
      case 'Heart Rate': return '70 bpm';
      case 'Water': return '4L';
      case 'Calories': return '2.2K';
      default: return '';
    }
  };
  
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconContainer}>
        <View style={styles.statIcon}>
          <Text>{icon}</Text>
        </View>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <View style={styles.statTrend}>
        <TrendingUp size={12} color="#10b981" />
        <Text style={styles.statTrendText}>+12%</Text>
      </View>
      <View style={styles.targetContainer}>
        <Target size={10} color="#6366f1" />
        <Text style={styles.targetText}>Target: {getTarget(title)}</Text>
      </View>
    </View>
  );
};

const MealCard: React.FC<MealCardProps> = ({ mealName, time }) => {
  const getMealIcon = (meal: string) => {
    switch (meal.toLowerCase()) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'snack': return '🍎';
      case 'dinner': return '🌙';
      default: return '🍽️';
    }
  };

  return (
    <View style={styles.mealCardContainer}>
      <View style={styles.mealPill}>
        <View style={styles.mealPillContent}>
          <View style={styles.mealInfo}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealEmoji}>{getMealIcon(mealName)}</Text>
              <Text style={styles.mealName}>{mealName}</Text>
            </View>
            <View style={styles.mealTimeContainer}>
              <Clock size={12} color="#e2e8f0" />
              <Text style={styles.mealTime}>{time}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.mealCard}>
        <TouchableOpacity style={styles.mealCardAddButton}>
          <Plus size={16} color="#6366f1" />
        </TouchableOpacity>
        <View style={styles.mealContent}>
          <View style={styles.foodImageSection}>
            <View style={styles.foodImagePlaceholder}>
              <View style={styles.cameraIconContainer}>
                <Camera size={24} color="#6366f1" />
              </View>
              <Text style={styles.foodImageText}>Picture of food</Text>
            </View>
          </View>
          <View style={styles.mealDetailsSection}>
            <View style={styles.caloriesSection}>
              <Text style={styles.caloriesSectionTitle}>Total Calories</Text>
              <Text style={styles.caloriesValue}>450 kcal</Text>
            </View>
            <View style={styles.nutritionAnalysisSection}>
              <Text style={styles.nutritionAnalysisTitle}>Nutrition Analysis</Text>
              <View style={styles.nutritionValues}>
                <Text style={styles.nutritionValue}>Protein: 24g</Text>
                <Text style={styles.nutritionValue}>Carbs: 45g</Text>
                <Text style={styles.nutritionValue}>Fat: 18g</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function HealthDashboard() {
  const { setCurrentScreen } = useAssistant();
  const [timeFilterVisible, setTimeFilterVisible] = React.useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = React.useState('Today');
  
  useFocusEffect(
    React.useCallback(() => {
      setCurrentScreen('Home');
      console.log('📱 Screen changed to: Home');
    }, [setCurrentScreen])
  );
  
  const timeFilterOptions = ['Today', 'This Week', 'This Month', 'This Year'];
  
  const meals = [
    { name: 'Breakfast', time: '6:00 AM' },
    { name: 'Lunch', time: '1:00 PM' },
    { name: 'Snack', time: '4:00 PM' },
    { name: 'Dinner', time: '8:00 PM' },
  ];
  
  const getCaloriesForPeriod = () => {
    switch (selectedTimeFilter) {
      case 'Today': return '1,847';
      case 'This Week': return '12,929';
      case 'This Month': return '55,410';
      case 'This Year': return '673,155';
      default: return '1,847';
    }
  };
  
  const getGoalForPeriod = () => {
    switch (selectedTimeFilter) {
      case 'Today': return '2,200';
      case 'This Week': return '15,400';
      case 'This Month': return '66,000';
      case 'This Year': return '803,000';
      default: return '2,200';
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.profileSection}>
          <View style={styles.profilePicture}>
            <View style={styles.profileGradient}>
              <User size={24} color="#ffffff" />
            </View>
            <View style={styles.statusIndicator} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>@username</Text>
            <Text style={styles.userSubtitle}>Health Tracker</Text>
          </View>
        </View>
        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationDot} />
            <Activity size={20} color="#6366f1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Good morning! 🌅</Text>
          <Text style={styles.welcomeSubtext}>Let&apos;s track your health journey today</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.compactSection}>
          <Text style={styles.compactSectionTitle}>Today&apos;s Overview</Text>
          <View style={styles.compactStatsGrid}>
            <StatCard
              title="Steps"
              value="8,247"
              icon={<Footprints size={18} color="#6366f1" />}
            />
            <StatCard
              title="Heart Rate"
              value="72 bpm"
              icon={<Heart size={18} color="#ef4444" />}
            />
            <StatCard
              title="Water"
              value="2.1L / 4L"
              icon={<Droplets size={18} color="#06b6d4" />}
            />
            <StatCard
              title="Calories"
              value="1,847"
              icon={<Flame size={18} color="#f59e0b" />}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/food-scanner')}
            >
              <View style={styles.actionIconContainer}>
                <Camera size={24} color="#ffffff" />
              </View>
              <Text style={styles.actionButtonText}>Scan Food</Text>
              <Text style={styles.actionButtonSubtext}>Instant nutrition analysis</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={() => router.push('/health-buddy')}
            >
              <View style={styles.actionIconContainerSecondary}>
                <MessageCircle size={24} color="#ffffff" />
              </View>
              <Text style={[styles.actionButtonText, { color: '#ffffff' }]}>Health Buddy</Text>
              <Text style={[styles.actionButtonSubtext, { color: '#e2e8f0' }]}>Chat with experts</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nutrition Section */}
        <View style={styles.nutritionSection}>
          <View style={styles.nutritionContainer}>
            <View style={styles.nutritionHeader}>
              <View style={styles.nutritionTitleContainer}>
                <Text style={styles.nutritionTitle}>Nutrition Tracking</Text>
                <View style={styles.nutritionBadge}>
                  <Target size={12} color="#10b981" />
                  <Text style={styles.nutritionBadgeText}>On Track</Text>
                </View>
              </View>
            </View>
            <View style={styles.nutritionSummary}>
              <View style={styles.calorieInfo}>
                <Text style={styles.totalConsumed}>{getCaloriesForPeriod()} kcal consumed</Text>
                <Text style={styles.calorieGoal}>Goal: {getGoalForPeriod()} kcal</Text>
                <View style={styles.progressBar}>
                  <View style={styles.progressFill} />
                </View>
              </View>
              <TouchableOpacity 
                style={styles.timeFilterButton}
                onPress={() => setTimeFilterVisible(true)}
              >
                <Clock size={16} color="#6366f1" />
                <ChevronDown size={12} color="#6366f1" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Meals List */}
        <View style={styles.mealsSection}>
          {meals.map((meal, index) => (
            <MealCard key={index} mealName={meal.name} time={meal.time} />
          ))}
        </View>

        {/* Today's Report Section */}
        <View style={styles.reportSection}>
          <View style={styles.reportHeader}>
            <View style={styles.reportTitleContainer}>
              <Brain size={24} color="#6366f1" />
              <Text style={styles.reportTitle}>Today&apos;s Health Report</Text>
            </View>
          </View>

          {/* Health Score */}
          <View style={styles.healthScoreCard}>
            <View style={styles.healthScoreHeader}>
              <Text style={styles.healthScoreTitle}>Overall Health Score</Text>
              <View style={styles.healthScoreValue}>
                <Text style={styles.healthScoreNumber}>78</Text>
                <Text style={styles.healthScoreMax}>/100</Text>
              </View>
            </View>
            <View style={styles.healthScoreBar}>
              <View style={styles.healthScoreFill} />
            </View>
            <Text style={styles.healthScoreDescription}>Good progress! You&apos;re on track with your health goals.</Text>
          </View>

          {/* Recommendations */}
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>Personalized Recommendations</Text>
            
            {/* Add Recommendations */}
            <View style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <View style={styles.recommendationIconContainer}>
                  <ArrowUp size={16} color="#10b981" />
                </View>
                <Text style={styles.recommendationTitle}>Add to Your Diet</Text>
              </View>
              <View style={styles.recommendationItems}>
                <View style={styles.recommendationItem}>
                  <CheckCircle size={14} color="#10b981" />
                  <Text style={styles.recommendationText}>🥬 Leafy greens (spinach, kale) - Low in calories, high in iron</Text>
                </View>
                <View style={styles.recommendationItem}>
                  <CheckCircle size={14} color="#10b981" />
                  <Text style={styles.recommendationText}>🐟 Omega-3 rich fish - Support heart health and brain function</Text>
                </View>
                <View style={styles.recommendationItem}>
                  <CheckCircle size={14} color="#10b981" />
                  <Text style={styles.recommendationText}>🥜 Almonds or walnuts - Healthy fats and protein for energy</Text>
                </View>
              </View>
            </View>

            {/* Remove Recommendations */}
            <View style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <View style={[styles.recommendationIconContainer, styles.removeIconContainer]}>
                  <ArrowDown size={16} color="#ef4444" />
                </View>
                <Text style={styles.recommendationTitle}>Consider Reducing</Text>
              </View>
              <View style={styles.recommendationItems}>
                <View style={styles.recommendationItem}>
                  <AlertTriangle size={14} color="#ef4444" />
                  <Text style={styles.recommendationText}>🍟 Processed foods - High sodium may affect blood pressure</Text>
                </View>
                <View style={styles.recommendationItem}>
                  <AlertTriangle size={14} color="#ef4444" />
                  <Text style={styles.recommendationText}>🥤 Sugary drinks - Empty calories, consider water instead</Text>
                </View>
              </View>
            </View>

            {/* Health Tips */}
            <View style={styles.tipsCard}>
              <View style={styles.tipsHeader}>
                <Lightbulb size={20} color="#f59e0b" />
                <Text style={styles.tipsTitle}>Today&apos;s Health Tips</Text>
              </View>
              <View style={styles.tipsList}>
                <Text style={styles.tipText}>💧 You&apos;re 1.9L away from your water goal - try adding lemon for flavor!</Text>
                <Text style={styles.tipText}>🚶‍♂️ Great job on steps! Consider a 10-minute evening walk to reach 10,000.</Text>
                <Text style={styles.tipText}>😴 Based on your activity, aim for 7-8 hours of sleep tonight for recovery.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom padding for scroll */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Time Filter Modal */}
      <Modal
        visible={timeFilterVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setTimeFilterVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTimeFilterVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Calendar size={20} color="#6366f1" />
              <Text style={styles.modalTitle}>Select Time Period</Text>
            </View>
            {timeFilterOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.modalOption,
                  selectedTimeFilter === option && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setSelectedTimeFilter(option);
                  setTimeFilterVisible(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  selectedTimeFilter === option && styles.modalOptionTextSelected
                ]}>
                  {option}
                </Text>
                {selectedTimeFilter === option && (
                  <CheckCircle size={16} color="#6366f1" />
                )}
              </TouchableOpacity>
            ))}
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  profilePicture: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 16,
    position: 'relative',
  },
  profileGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  username: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 2,
    flexShrink: 1,
  },
  userSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500' as const,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#1e293b',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500' as const,
  },
  section: {
    paddingHorizontal: 24,
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
    justifyContent: 'space-between',
    gap: 16,
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
  statIconContainer: {
    marginBottom: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  statTitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: '#1e293b',
    marginBottom: 6,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statTrendText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600' as const,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  actionButtonSecondary: {
    backgroundColor: '#6366f1',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionIconContainerSecondary: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 4,
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center' as const,
    fontWeight: '500' as const,
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  nutritionTitleContainer: {
    flex: 1,
  },
  nutritionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 8,
  },
  nutritionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    alignSelf: 'flex-start',
  },
  nutritionBadgeText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600' as const,
  },
  nutritionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  nutritionActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    gap: 6,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nutritionActionButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#6366f1',
    gap: 6,
  },
  nutritionActionText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600' as const,
  },
  nutritionActionTextSecondary: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600' as const,
  },
  nutritionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  calorieInfo: {
    flex: 1,
  },
  totalConsumed: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 4,
  },
  calorieGoal: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    fontWeight: '500' as const,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '84%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  timeFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    gap: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  mealsSection: {
    paddingHorizontal: 24,
  },
  mealCardContainer: {
    marginBottom: 28,
    position: 'relative',
  },
  mealPill: {
    position: 'absolute',
    top: -16,
    left: 20,
    right: '50%',
    zIndex: 10,
    backgroundColor: '#6366f1',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  mealPillContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealInfo: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  mealTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mealTime: {
    fontSize: 12,
    color: '#e2e8f0',
    fontWeight: '500' as const,
  },
  mealCardAddButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  mealCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    paddingTop: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  foodImagePlaceholder: {
    height: 120,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  cameraIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  foodImageText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500' as const,
    textAlign: 'center' as const,
  },
  foodImageSubtext: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500' as const,
  },
  bottomPadding: {
    height: 120,
  },
  reportSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 32,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  reportTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reportTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: '#1e293b',
  },
  reportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  reportBadgeText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '700' as const,
  },
  healthScoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  healthScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  healthScoreTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1e293b',
  },
  healthScoreValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  healthScoreNumber: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#6366f1',
  },
  healthScoreMax: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#64748b',
    marginLeft: 2,
  },
  healthScoreBar: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  healthScoreFill: {
    height: '100%',
    width: '78%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  healthScoreDescription: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500' as const,
    textAlign: 'center' as const,
  },
  recommendationsContainer: {
    gap: 16,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 8,
  },
  recommendationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  recommendationIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIconContainer: {
    backgroundColor: '#fee2e2',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1e293b',
  },
  recommendationItems: {
    gap: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#92400e',
  },
  tipsList: {
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  compactSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  compactSectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 12,
  },
  compactStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  nutritionSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  nutritionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  mealContent: {
    flexDirection: 'row',
    gap: 16,
  },
  foodImageSection: {
    flex: 1,
  },
  mealDetailsSection: {
    flex: 1,
    gap: 12,
  },
  caloriesSection: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  caloriesSectionTitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  caloriesValue: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#1e293b',
  },
  nutritionAnalysisSection: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 12,
  },
  nutritionAnalysisTitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  nutritionValues: {
    gap: 4,
  },
  nutritionValue: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500' as const,
  },
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  targetText: {
    fontSize: 10,
    color: '#6366f1',
    fontWeight: '600' as const,
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
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1e293b',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
  },
  modalOptionSelected: {
    backgroundColor: '#ede9fe',
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#475569',
  },
  modalOptionTextSelected: {
    color: '#6366f1',
  },
});