import React, { useState } from 'react';
import { StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/store/AuthContext';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handlePhoneLogin = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('错误', '请输入手机号');
      return;
    }
    if (!verificationCode.trim()) {
      Alert.alert('错误', '请输入验证码');
      return;
    }

    setLoading(true);
    try {
      // TODO: 实现手机号登录逻辑
      console.log('手机号登录:', phoneNumber, verificationCode);
      Alert.alert('提示', '手机号登录功能待实现');
    } catch (error) {
      Alert.alert('登录失败', '登录时出错，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleWechatLogin = async () => {
    setLoading(true);
    try {
      // TODO: 实现微信登录逻辑
      console.log('微信登录');
      Alert.alert('提示', '微信登录功能待实现');
    } catch (error) {
      Alert.alert('登录失败', '登录时出错，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleGetVerificationCode = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('错误', '请先输入手机号');
      return;
    }
    
    try {
      // TODO: 实现获取验证码逻辑
      console.log('获取验证码:', phoneNumber);
      Alert.alert('提示', '验证码已发送到您的手机');
    } catch (error) {
      Alert.alert('发送失败', '验证码发送失败，请重试');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>欢迎使用 AIFA</ThemedText>
        <ThemedText style={styles.subtitle}>请输入手机号和验证码登录</ThemedText>
        
        <TextInput
          style={styles.input}
          placeholder="请输入手机号"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="phone-pad"
          maxLength={11}
        />
        
        <ThemedView style={styles.verificationContainer}>
          <TextInput
            style={[styles.input, styles.verificationInput]}
            placeholder="请输入验证码"
            value={verificationCode}
            onChangeText={setVerificationCode}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="number-pad"
            maxLength={6}
          />
          <TouchableOpacity style={styles.getCodeButton} onPress={handleGetVerificationCode}>
            <ThemedText style={styles.getCodeButtonText}>获取验证码</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handlePhoneLogin} disabled={loading}>
            <ThemedText style={styles.buttonText}>
              {loading ? '登录中...' : '手机号登录'}
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.wechatButton]} onPress={handleWechatLogin} disabled={loading}>
            <ThemedText style={styles.buttonText}>
              {loading ? '登录中...' : '微信登录'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedText style={styles.note}>
          登录即表示您同意我们的服务条款和隐私政策
        </ThemedText>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 16,
    color: '#666',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  verificationContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  verificationInput: {
    flex: 1,
    marginBottom: 0,
  },
  getCodeButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  getCodeButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  wechatButton: {
    backgroundColor: '#1AAD19',
    shadowColor: '#1AAD19',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  note: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.6,
    color: '#999',
    lineHeight: 18,
  },
});