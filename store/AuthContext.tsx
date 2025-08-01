import { clientCheckV3 } from '@/api/auth';
import { guid } from '@/utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  uguid: string | null;
  clientid: string | null;
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
  const [clientid, setClientid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 从本地存储加载认证信息
  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const storedUguid = await AsyncStorage.getItem('uguid');
      let storedClientid = await AsyncStorage.getItem('clientid');
      
      // 如果没有clientid，生成一个新的并验证
      if (!storedClientid) {
        const newClientid = guid();
        
        // 调用ClientCheckV3接口验证新生成的clientid
        try {
          const checkResult = await clientCheckV3(newClientid);
          console.log('ClientCheckV3验证结果:', checkResult);
          
          // 只有验证成功才存储到store和本地存储
          if (checkResult.code === 1000) { // 假设1000是成功码
            await AsyncStorage.setItem('clientid', newClientid);
            storedClientid = newClientid;
            console.log('ClientCheckV3验证成功，clientid已存储');
          } else {
            console.error('ClientCheckV3验证失败:', checkResult.msg);
            // 验证失败时不存储clientid
            storedClientid = null;
          }
        } catch (error) {
          console.error('ClientCheckV3验证失败:', error);
          // 验证失败时不存储clientid
          storedClientid = null;
        }
      }
      
      setClientid(storedClientid);
      
      if (storedUguid) {
        setUguid(storedUguid);
      }
    } catch (error) {
      console.error('加载认证数据失败:', error);
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
    clientid,
    isAuthenticated: !!uguid || !!clientid, // 有uguid或clientid都算认证通过
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