import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  uguid: string | null;
  isAuthenticated: boolean;
  login: (uguid: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [uguid, setUguid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 从本地存储加载uguid
  useEffect(() => {
    loadUguid();
  }, []);

  const loadUguid = async () => {
    try {
      const storedUguid = await AsyncStorage.getItem('uguid');
      if (storedUguid) {
        setUguid(storedUguid);
      }
    } catch (error) {
      console.error('加载uguid失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (newUguid: string) => {
    try {
      await AsyncStorage.setItem('uguid', newUguid);
      setUguid(newUguid);
    } catch (error) {
      console.error('保存uguid失败:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('uguid');
      setUguid(null);
    } catch (error) {
      console.error('清除uguid失败:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    uguid,
    isAuthenticated: !!uguid,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
}

// 生成随机uguid的工具函数
export function generateUguid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}