import React from 'react';
import { ActivityIndicator } from 'react-native';

import { useAuth } from '@/store/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={{ marginTop: 10 }}>加载中...</ThemedText>
      </ThemedView>
    );
  }

  return <>{children}</>;
}