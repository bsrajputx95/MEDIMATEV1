import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import {
  Send,
  Bot,
  User,
  Heart,
  Sparkles,
  MessageCircle,
} from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const HEALTH_BUDDY_SYSTEM_PROMPT = `You are a friendly and knowledgeable health buddy AI assistant. Your role is to:

1. Provide helpful health and wellness advice
2. Answer questions about nutrition, exercise, mental health, and general wellness
3. Offer encouragement and motivation for healthy lifestyle choices
4. Suggest practical tips for improving health habits
5. Be supportive and understanding about health challenges

Always:
- Be encouraging and positive
- Provide evidence-based information when possible
- Remind users to consult healthcare professionals for serious concerns
- Keep responses conversational and friendly
- Ask follow-up questions to better understand their needs

Never:
- Provide specific medical diagnoses
- Recommend specific medications
- Replace professional medical advice
- Give advice that could be harmful`;

export default function HealthBuddyChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! 👋 I'm your Health Buddy! I'm here to help you with any questions about health, nutrition, fitness, or wellness. What would you like to chat about today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: HEALTH_BUDDY_SYSTEM_PROMPT },
            ...messages.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.text,
            })),
            { role: 'user', content: userMessage.text },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.completion,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert(
        'Error',
        'Sorry, I had trouble connecting. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: Message) => {
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          message.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        {!message.isUser && (
          <View style={styles.aiAvatar}>
            <Bot size={16} color="#ffffff" />
          </View>
        )}
        
        <View
          style={[
            styles.messageBubble,
            message.isUser ? styles.userMessageBubble : styles.aiMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              message.isUser ? styles.userMessageText : styles.aiMessageText,
            ]}
          >
            {message.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              message.isUser ? styles.userMessageTime : styles.aiMessageTime,
            ]}
          >
            {formatTime(message.timestamp)}
          </Text>
        </View>
        
        {message.isUser && (
          <View style={styles.userAvatar}>
            <User size={16} color="#ffffff" />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Health Buddy',
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '700',
          },
          headerRight: () => (
            <View style={styles.headerRight}>
              <Heart size={20} color="#ffffff" />
              <Sparkles size={16} color="#ffffff" />
            </View>
          ),
        }}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <View style={styles.chatHeaderContent}>
            <View style={styles.chatHeaderAvatar}>
              <MessageCircle size={24} color="#6366f1" />
            </View>
            <View style={styles.chatHeaderText}>
              <Text style={styles.chatHeaderTitle}>Health Buddy AI</Text>
              <Text style={styles.chatHeaderSubtitle}>Your personal wellness companion</Text>
            </View>
            <View style={styles.statusIndicator}>
              <View style={styles.onlineStatus} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.aiAvatar}>
                <Bot size={16} color="#ffffff" />
              </View>
              <View style={styles.loadingBubble}>
                <ActivityIndicator size="small" color="#6366f1" />
                <Text style={styles.loadingText}>Health Buddy is typing...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me about health, nutrition, fitness..."
              placeholderTextColor="#94a3b8"
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Send size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardContainer: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatHeader: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  chatHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatHeaderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderText: {
    flex: 1,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 2,
  },
  chatHeaderSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500' as const,
  },
  statusIndicator: {
    alignItems: 'center',
    gap: 4,
  },
  onlineStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600' as const,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessageBubble: {
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 6,
  },
  aiMessageBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#ffffff',
    fontWeight: '500' as const,
  },
  aiMessageText: {
    color: '#1e293b',
    fontWeight: '500' as const,
  },
  messageTime: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  userMessageTime: {
    color: '#e2e8f0',
  },
  aiMessageTime: {
    color: '#94a3b8',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic' as const,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
});