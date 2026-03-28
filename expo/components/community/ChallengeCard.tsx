import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trophy, Users, Clock, Target } from 'lucide-react-native';
import { Challenge } from '../../types/community';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: (challengeId: string) => void;
}

export default function ChallengeCard({ challenge, onJoin }: ChallengeCardProps) {
  const [isJoined, setIsJoined] = useState(challenge.isJoined);
  const [participants, setParticipants] = useState(challenge.participants);

  const handleJoin = () => {
    setIsJoined(!isJoined);
    setParticipants(prev => isJoined ? prev - 1 : prev + 1);
    onJoin(challenge.id);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return '#f59e0b';
      case 'fitness': return '#10b981';
      case 'wellness': return '#3b82f6';
      case 'mental-wellness': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Trophy size={20} color={getCategoryColor(challenge.category)} />
          <Text style={styles.title}>{challenge.title}</Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(challenge.category) }]}>
          <Text style={styles.categoryText}>{challenge.category}</Text>
        </View>
      </View>

      <Text style={styles.description}>{challenge.description}</Text>

      {challenge.progress !== undefined && isJoined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Your Progress</Text>
            <Text style={styles.progressPercent}>{challenge.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${challenge.progress}%` }]} 
            />
          </View>
        </View>
      )}

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Clock size={16} color="#64748b" />
          <Text style={styles.statText}>{challenge.duration}</Text>
        </View>
        <View style={styles.stat}>
          <Users size={16} color="#64748b" />
          <Text style={styles.statText}>{participants} joined</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.joinButton, isJoined && styles.joinedButton]} 
        onPress={handleJoin}
      >
        <Target size={16} color={isJoined ? '#ffffff' : '#2563eb'} />
        <Text style={[styles.joinButtonText, isJoined && styles.joinedButtonText]}>
          {isJoined ? 'Joined Challenge' : 'Join Challenge'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1e293b',
    marginLeft: 8,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500' as const,
  },
  progressPercent: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600' as const,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  joinedButton: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  joinButtonText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  joinedButtonText: {
    color: '#ffffff',
  },
});