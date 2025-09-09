import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Target, Calendar, User, CheckCircle, Circle, TrendingUp } from 'lucide-react-native';
import { TreatmentPlan } from '../../types/cura';

interface TreatmentPlanCardProps {
  plan: TreatmentPlan;
  onViewDetails?: (planId: string) => void;
}

export default function TreatmentPlanCard({ plan, onViewDetails }: TreatmentPlanCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const completedMilestones = plan.milestones.filter(m => m.completed).length;
  const totalMilestones = plan.milestones.length;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10b981';
    if (progress >= 50) return '#f59e0b';
    return '#6366f1';
  };

  const nextMilestone = plan.milestones.find(m => !m.completed);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.planInfo}>
          <View style={styles.targetIcon}>
            <Target size={20} color="#6366f1" />
          </View>
          <View style={styles.planDetails}>
            <Text style={styles.planTitle}>{plan.title}</Text>
            <Text style={styles.planDescription} numberOfLines={2}>
              {plan.description}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <View style={styles.progressStats}>
              <TrendingUp size={14} color={getProgressColor(progressPercentage)} />
              <Text style={[
                styles.progressText,
                { color: getProgressColor(progressPercentage) }
              ]}>
                {Math.round(progressPercentage)}%
              </Text>
            </View>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressPercentage}%`,
                  backgroundColor: getProgressColor(progressPercentage)
                }
              ]} 
            />
          </View>
          
          <Text style={styles.milestonesText}>
            {completedMilestones} of {totalMilestones} milestones completed
          </Text>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <User size={16} color="#64748b" />
            <Text style={styles.detailText}>Prescribed by {plan.prescribedBy}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Calendar size={16} color="#64748b" />
            <Text style={styles.detailText}>
              {formatDate(plan.startDate)} - {plan.endDate ? formatDate(plan.endDate) : 'Ongoing'}
            </Text>
          </View>
        </View>

        {nextMilestone && (
          <View style={styles.nextMilestoneContainer}>
            <View style={styles.nextMilestoneHeader}>
              <Circle size={16} color="#f59e0b" />
              <Text style={styles.nextMilestoneLabel}>Next Milestone</Text>
            </View>
            <Text style={styles.nextMilestoneTitle}>{nextMilestone.title}</Text>
            <Text style={styles.nextMilestoneDate}>
              Due: {formatDate(nextMilestone.dueDate)}
            </Text>
          </View>
        )}

        <View style={styles.milestonesPreview}>
          <Text style={styles.milestonesPreviewLabel}>Recent Milestones</Text>
          <View style={styles.milestonesList}>
            {plan.milestones.slice(0, 3).map((milestone) => (
              <View key={milestone.id} style={styles.milestoneItem}>
                {milestone.completed ? (
                  <CheckCircle size={16} color="#10b981" />
                ) : (
                  <Circle size={16} color="#d1d5db" />
                )}
                <Text style={[
                  styles.milestoneText,
                  { 
                    color: milestone.completed ? '#10b981' : '#64748b',
                    textDecorationLine: milestone.completed ? 'line-through' : 'none'
                  }
                ]}>
                  {milestone.title}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {onViewDetails && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => onViewDetails(plan.id)}
          >
            <Text style={styles.detailsButtonText}>View Full Plan</Text>
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
    marginBottom: 16,
  },
  planInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  targetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planDetails: {
    flex: 1,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  content: {
    gap: 16,
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600' as const,
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  milestonesText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500' as const,
  },
  detailsSection: {
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
  nextMilestoneContainer: {
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  nextMilestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  nextMilestoneLabel: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600' as const,
  },
  nextMilestoneTitle: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  nextMilestoneDate: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500' as const,
  },
  milestonesPreview: {
    gap: 8,
  },
  milestonesPreviewLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600' as const,
  },
  milestonesList: {
    gap: 8,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  milestoneText: {
    fontSize: 14,
    fontWeight: '500' as const,
    flex: 1,
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  detailsButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
});