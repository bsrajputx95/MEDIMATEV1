import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Users, Plus, Check } from 'lucide-react-native';
import { Group } from '../../types/community';

interface GroupCardProps {
  group: Group;
  onJoin: (groupId: string) => void;
}

export default function GroupCard({ group, onJoin }: GroupCardProps) {
  const [isJoined, setIsJoined] = useState(group.isJoined);
  const [memberCount, setMemberCount] = useState(group.memberCount);

  const handleJoin = () => {
    setIsJoined(!isJoined);
    setMemberCount(prev => isJoined ? prev - 1 : prev + 1);
    onJoin(group.id);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health-condition': return '#ef4444';
      case 'mental-wellness': return '#8b5cf6';
      case 'fitness': return '#10b981';
      case 'lifestyle': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(group.category) }]} />
        <Text style={styles.groupName}>{group.name}</Text>
      </View>
      
      <Text style={styles.description}>{group.description}</Text>
      
      <View style={styles.footer}>
        <View style={styles.memberInfo}>
          <Users size={16} color="#64748b" />
          <Text style={styles.memberCount}>{memberCount.toLocaleString()} members</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.joinButton, isJoined && styles.joinedButton]} 
          onPress={handleJoin}
        >
          {isJoined ? (
            <>
              <Check size={16} color="#ffffff" />
              <Text style={styles.joinedButtonText}>Joined</Text>
            </>
          ) : (
            <>
              <Plus size={16} color="#2563eb" />
              <Text style={styles.joinButtonText}>Join</Text>
            </>
          )}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1e293b',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  joinedButton: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  joinButtonText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  joinedButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600' as const,
    marginLeft: 4,
  },
});