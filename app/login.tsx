import React, { useState } from 'react';
import { StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth, generateUguid } from '@/store/AuthContext';

export default function LoginScreen() {
  const [inputUguid, setInputUguid] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!inputUguid.trim()) {
      Alert.alert('错误', '请输入UGUID');
      return;
    }

    setLoading(true);
    try {
      await login(inputUguid.trim());
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('登录失败', '保存UGUID时出错，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateUguid = () => {
    const newUguid = generateUguid();
    setInputUguid(newUguid);
  };

  const handleQuickLogin = async () => {
    const quickUguid = 'dfed35da5fd5bf6cff000a6a928811e1';
    setLoading(true);
    try {
      await login(quickUguid);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('登录失败', '保存UGUID时出错，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>欢迎使用 AIFA</ThemedText>
        <ThemedText style={styles.subtitle}>请输入您的UGUID以继续</ThemedText>
        
        <TextInput
          style={styles.input}
          placeholder="请输入UGUID"
          value={inputUguid}
          onChangeText={setInputUguid}
          autoCapitalize="none"
          autoCorrect={false}
          multiline
          numberOfLines={2}
        />
        
        <ThemedView style={styles.buttonContainer}>
          <ThemedView style={styles.button} onTouchEnd={handleLogin}>
            <ThemedText style={styles.buttonText}>
              {loading ? '登录中...' : '登录'}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={[styles.button, styles.secondaryButton]} onTouchEnd={handleGenerateUguid}>
            <ThemedText style={[styles.buttonText, styles.secondaryButtonText]}>
              生成随机UGUID
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={[styles.button, styles.quickButton]} onTouchEnd={handleQuickLogin}>
            <ThemedText style={styles.buttonText}>
              {loading ? '登录中...' : '快速登录(测试)'}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedText style={styles.note}>
          UGUID是您的唯一标识符，请妥善保管
        </ThemedText>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.7,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  quickButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  note: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.6,
  },
});