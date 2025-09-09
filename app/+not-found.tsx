import React from 'react';
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AlertCircle } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Page Not Found" }} />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <AlertCircle size={64} color="#ef4444" />
        </View>
        <Text style={styles.title}>Oops! Page not found</Text>
        <Text style={styles.description}>The page you&apos;re looking for doesn&apos;t exist in our health app.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Return to Dashboard</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  link: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: '600' as const,
  },
});
