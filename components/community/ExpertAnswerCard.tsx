import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart, GraduationCap } from 'lucide-react-native';
import { ExpertAnswer } from '../../types/community';

interface ExpertAnswerCardProps {
  expertAnswer: ExpertAnswer;
  onLike: (answerId: string) => void;
}

export default function ExpertAnswerCard({ expertAnswer, onLike }: ExpertAnswerCardProps) {
  const [isLiked, setIsLiked] = useState(expertAnswer.isLiked);
  const [likeCount, setLikeCount] = useState(expertAnswer.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(expertAnswer.id);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionLabel}>Question:</Text>
        <Text style={styles.question}>{expertAnswer.question}</Text>
      </View>

      <View style={styles.expertInfo}>
        <View style={styles.expertAvatar}>
          <GraduationCap size={20} color="#2563eb" />
        </View>
        <View style={styles.expertDetails}>
          <Text style={styles.expertName}>{expertAnswer.expertName}</Text>
          <Text style={styles.expertTitle}>{expertAnswer.expertTitle}</Text>
        </View>
        <Text style={styles.timestamp}>{formatTimeAgo(expertAnswer.timestamp)}</Text>
      </View>

      <View style={styles.answerContainer}>
        <Text style={styles.answer}>{expertAnswer.answer}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <Heart 
            size={18} 
            color={isLiked ? '#ef4444' : '#64748b'} 
            fill={isLiked ? '#ef4444' : 'none'}
          />
          <Text style={[styles.likeText, isLiked && styles.likedText]}>
            {likeCount} helpful
          </Text>
        </TouchableOpacity>
      </View>
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
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  question: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  expertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  expertAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expertDetails: {
    flex: 1,
  },
  expertName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1e293b',
  },
  expertTitle: {
    fontSize: 14,
    color: '#2563eb',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
  },
  answerContainer: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  answer: {
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  likeText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '500' as const,
  },
  likedText: {
    color: '#ef4444',
  },
});