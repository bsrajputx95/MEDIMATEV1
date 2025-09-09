import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  RefreshControl,
  Modal
} from 'react-native';
import { 
  Search, 
  TrendingUp, 
  Trophy, 
  Users, 
  GraduationCap,
  Plus,
  Filter,
  Star,
  BarChart3,
  MessageCircle,
  X
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '../../components/community/PostCard';
import GroupCard from '../../components/community/GroupCard';
import ChallengeCard from '../../components/community/ChallengeCard';
import ExpertAnswerCard from '../../components/community/ExpertAnswerCard';
import {
  MOCK_POSTS,
  MOCK_GROUPS,
  MOCK_CHALLENGES,
  MOCK_EXPERT_ANSWERS,
  MOCK_POLLS,
  TRENDING_TOPICS,
  DAILY_INSPIRATION
} from '../../constants/community';
import { Post, Group, Challenge, ExpertAnswer, Poll } from '../../types/community';
import { useAssistant } from '../../contexts/AssistantContext';
import { useFocusEffect } from '@react-navigation/native';

type TabType = 'feed' | 'groups' | 'challenges' | 'experts' | 'trending';

export default function MedTalkScreen() {
  const { setCurrentScreen } = useAssistant();
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [expertAnswers] = useState<ExpertAnswer[]>(MOCK_EXPERT_ANSWERS);
  const [polls] = useState<Poll[]>(MOCK_POLLS);

  useFocusEffect(
    useCallback(() => {
      setCurrentScreen('medtalk');
    }, [setCurrentScreen])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLikePost = (postId: string) => {
    console.log('Liked post:', postId);
  };

  const handleCommentPost = (postId: string) => {
    Alert.alert('Comments', 'Comments feature coming soon!');
  };

  const handleSharePost = (postId: string) => {
    Alert.alert('Share', 'Share feature coming soon!');
  };

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, isJoined: !group.isJoined, memberCount: group.isJoined ? group.memberCount - 1 : group.memberCount + 1 }
        : group
    ));
  };

  const handleJoinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, isJoined: !challenge.isJoined, participants: challenge.isJoined ? challenge.participants - 1 : challenge.participants + 1 }
        : challenge
    ));
  };

  const handleLikeExpertAnswer = (answerId: string) => {
    console.log('Liked expert answer:', answerId);
  };

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        userId: 'user-1',
        user: { id: 'user-1', name: isAnonymous ? 'Anonymous' : 'You', badges: ['water-warrior'], isAnonymous },
        content: newPostContent,
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isAnonymous
      };
      setPosts(prev => [newPost, ...prev]);
      setNewPostContent('');
      setShowCreatePost(false);
      setIsAnonymous(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <View style={styles.tabContent}>
            <View style={styles.inspirationCard}>
              <Star size={20} color="#f59e0b" />
              <Text style={styles.inspirationText}>
                {DAILY_INSPIRATION[Math.floor(Math.random() * DAILY_INSPIRATION.length)]}
              </Text>
            </View>
            
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLikePost}
                onComment={handleCommentPost}
                onShare={handleSharePost}
              />
            ))}
          </View>
        );
      
      case 'groups':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Topic-Based Groups</Text>
            <Text style={styles.sectionSubtitle}>
              Connect with others who share similar health goals and challenges
            </Text>
            {groups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onJoin={handleJoinGroup}
              />
            ))}
          </View>
        );
      
      case 'challenges':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Group Challenges</Text>
            <Text style={styles.sectionSubtitle}>
              Join fun challenges and achieve your wellness goals together
            </Text>
            {challenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onJoin={handleJoinChallenge}
              />
            ))}
          </View>
        );
      
      case 'experts':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Ask the Expert</Text>
            <Text style={styles.sectionSubtitle}>
              Get answers from certified health professionals
            </Text>
            
            <TouchableOpacity style={styles.askQuestionButton}>
              <MessageCircle size={20} color="#2563eb" />
              <Text style={styles.askQuestionText}>Ask a Question</Text>
            </TouchableOpacity>
            
            {expertAnswers.map(answer => (
              <ExpertAnswerCard
                key={answer.id}
                expertAnswer={answer}
                onLike={handleLikeExpertAnswer}
              />
            ))}
          </View>
        );
      
      case 'trending':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Trending Topics</Text>
            <Text style={styles.sectionSubtitle}>
              Discover what the community is talking about
            </Text>
            
            <View style={styles.trendingContainer}>
              {TRENDING_TOPICS.map((topic: { tag: string; posts: number }, index: number) => (
                <TouchableOpacity key={topic.tag} style={styles.trendingItem}>
                  <View style={styles.trendingRank}>
                    <Text style={styles.trendingRankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.trendingInfo}>
                    <Text style={styles.trendingTag}>{topic.tag}</Text>
                    <Text style={styles.trendingCount}>{topic.posts} posts</Text>
                  </View>
                  <TrendingUp size={16} color="#10b981" />
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.sectionTitle}>Community Polls</Text>
            {polls.map(poll => (
              <View key={poll.id} style={styles.pollCard}>
                <Text style={styles.pollQuestion}>{poll.question}</Text>
                {poll.options.map((option: { id: string; text: string; votes: number }) => {
                  const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                  const isSelected = poll.userVote === option.id;
                  
                  return (
                    <TouchableOpacity key={option.id} style={styles.pollOption}>
                      <View style={styles.pollOptionContent}>
                        <Text style={[styles.pollOptionText, isSelected && styles.selectedOptionText]}>
                          {option.text}
                        </Text>
                        <Text style={styles.pollPercentage}>{Math.round(percentage)}%</Text>
                      </View>
                      <View style={styles.pollBar}>
                        <View 
                          style={[styles.pollBarFill, { width: `${percentage}%` }, isSelected && styles.selectedBar]} 
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
                <Text style={styles.pollVotes}>{poll.totalVotes} votes</Text>
              </View>
            ))}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={20} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => setShowCreatePost(true)}
          >
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search topics, groups, or challenges..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
          onPress={() => setActiveTab('feed')}
        >
          <MessageCircle size={18} color={activeTab === 'feed' ? '#2563eb' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>Feed</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <Users size={18} color={activeTab === 'groups' ? '#2563eb' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>Groups</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'challenges' && styles.activeTab]}
          onPress={() => setActiveTab('challenges')}
        >
          <Trophy size={18} color={activeTab === 'challenges' ? '#2563eb' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'challenges' && styles.activeTabText]}>Challenges</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'experts' && styles.activeTab]}
          onPress={() => setActiveTab('experts')}
        >
          <GraduationCap size={18} color={activeTab === 'experts' ? '#2563eb' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'experts' && styles.activeTabText]}>Experts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
          onPress={() => setActiveTab('trending')}
        >
          <BarChart3 size={18} color={activeTab === 'trending' ? '#2563eb' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'trending' && styles.activeTabText]}>Trending</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>

      <Modal
        visible={showCreatePost}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreatePost(false)}>
              <X size={24} color="#64748b" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Post</Text>
            <TouchableOpacity 
              onPress={handleCreatePost}
              disabled={!newPostContent.trim()}
            >
              <Text style={[styles.postButton, !newPostContent.trim() && styles.disabledButton]}>
                Post
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <TextInput
              style={styles.postInput}
              placeholder="Share your thoughts, progress, or ask for support..."
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              textAlignVertical="top"
              placeholderTextColor="#9ca3af"
            />
            
            <TouchableOpacity 
              style={styles.anonymousToggle}
              onPress={() => setIsAnonymous(!isAnonymous)}
            >
              <View style={[styles.checkbox, isAnonymous && styles.checkedBox]}>
                {isAnonymous && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.anonymousText}>Post anonymously</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1e293b',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  createButton: {
    backgroundColor: '#2563eb',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    gap: 4,
  },
  activeTab: {
    backgroundColor: '#eff6ff',
  },
  tabText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500' as const,
  },
  activeTabText: {
    color: '#2563eb',
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 22,
  },
  inspirationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  inspirationText: {
    fontSize: 16,
    color: '#92400e',
    fontWeight: '500' as const,
    marginLeft: 12,
    flex: 1,
  },
  askQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#2563eb',
    borderStyle: 'dashed',
  },
  askQuestionText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  trendingContainer: {
    marginBottom: 24,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  trendingRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  trendingRankText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#475569',
  },
  trendingInfo: {
    flex: 1,
  },
  trendingTag: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1e293b',
  },
  trendingCount: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  pollCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pollQuestion: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1e293b',
    marginBottom: 16,
  },
  pollOption: {
    marginBottom: 12,
  },
  pollOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  pollOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#2563eb',
    fontWeight: '600' as const,
  },
  pollPercentage: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600' as const,
  },
  pollBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  pollBarFill: {
    height: '100%',
    backgroundColor: '#d1d5db',
    borderRadius: 3,
  },
  selectedBar: {
    backgroundColor: '#2563eb',
  },
  pollVotes: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1e293b',
  },
  postButton: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600' as const,
  },
  disabledButton: {
    color: '#9ca3af',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  postInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  anonymousToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkedBox: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  anonymousText: {
    fontSize: 16,
    color: '#374151',
  },
});