import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react-native';
import { Post } from '../../types/community';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

export default function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(post.id);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleMoreOptions = () => {
    Alert.alert(
      'Post Options',
      'Choose an action',
      [
        { text: 'Report Post', style: 'destructive' },
        { text: 'Hide Post' },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {post.user.isAnonymous ? '?' : post.user.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>
                {post.user.isAnonymous ? 'Anonymous' : post.user.name}
              </Text>
              {post.user.badges.length > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badge}>🏆</Text>
                </View>
              )}
            </View>
            <Text style={styles.timestamp}>{formatTimeAgo(post.timestamp)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleMoreOptions} style={styles.moreButton}>
          <MoreHorizontal size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Heart 
            size={20} 
            color={isLiked ? '#ef4444' : '#64748b'} 
            fill={isLiked ? '#ef4444' : 'none'}
          />
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => onComment(post.id)}>
          <MessageCircle size={20} color="#64748b" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => onShare(post.id)}>
          <Share size={20} color="#64748b" />
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
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
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#475569',
  },
  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1e293b',
    marginRight: 8,
  },
  badgeContainer: {
    marginLeft: 4,
  },
  badge: {
    fontSize: 12,
  },
  timestamp: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    padding: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '500' as const,
  },
  likedText: {
    color: '#ef4444',
  },
});