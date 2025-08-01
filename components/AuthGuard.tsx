import React from 'react';
import { ActivityIndicator } from 'react-native';

import { useAuth } from '@/store/AuthContext';
import { View, Text } from 'react-native';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>加载中...</Text>
      </View>
    );
  }

  return <>{children}</>;
}