import { Tabs } from "expo-router";
import { Home, Pill, TrendingUp, MessageSquare, User } from "lucide-react-native";
import React from "react";
import { View, StyleSheet } from "react-native";
import FloatingAssistantBot from "@/components/FloatingAssistantBot";
import { useAssistant } from "@/contexts/AssistantContext";

export default function TabLayout() {
  const { speakScreenDescription } = useAssistant();

  return (
    <View style={styles.container}>
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500' as const,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cura"
        options={{
          title: "CURA",
          tabBarIcon: ({ color, size }) => <Pill size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="healthyics"
        options={{
          title: "Healthyics",
          tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="medtalk"
        options={{
          title: "MedTalk",
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      </Tabs>
      
      <FloatingAssistantBot onPress={speakScreenDescription} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});