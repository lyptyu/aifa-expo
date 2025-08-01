import { useAuth } from '@/store/AuthContext';
import { useEffect, useState } from 'react';
import { sendVCode, phoneLogin, getWebVersion, clientCheckV3 } from '@/api/auth';
import { SendVCodeResponse, PhoneLoginResponse, WebVersionResponse, ClientCheckV3Response } from '@/api/auth';

// 服务器配置
export const SERVERS = {
  PHPSERVER: 'http://api.aifa.chat/api/mapi/',
  AICHAT_SERVER: 'http://152.136.11.133:18888'
};

interface ApiResponse<T = any> {
  data: T;
  status: number;
  msg?: string;
}

interface UseApiOptions {
  immediate?: boolean; // 是否立即执行请求
}

export function useApi<T = any>(url: string, options: UseApiOptions = { immediate: true }) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result.data || result);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('API request failed:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate) {
      fetchData();
    }
  }, [url, options.immediate]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// 专门用于获取版本信息的hook
export function useWebVersion(uguid: string) {
  const [data, setData] = useState<WebVersionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getWebVersion(uguid);
      setData(result);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('获取版本信息失败:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uguid) {
      fetchData();
    }
  }, [uguid]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// 获取认证参数的hook
export function useAuthParams(): { uguid?: string; clientid: string } | { clientid: string } {
  const { uguid, clientid } = useAuth();
  
  if (uguid && clientid) {
    return { uguid, clientid };
  } else {
    return { clientid: clientid || '' };
  }
}

// 发送验证码的hook
export function useSendVCode() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendCode = async (phone: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await sendVCode(phone);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('发送验证码失败:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendCode,
    loading,
    error
  };
}

// 手机号登录的hook
export function usePhoneLogin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (iv: string, phone: string, vcode: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await phoneLogin(iv, phone, vcode);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('手机号登录失败:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error
  };
}

// ClientCheckV3的hook
export function useClientCheckV3() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkClient = async (clientid?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await clientCheckV3(clientid);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('ClientCheckV3失败:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    checkClient,
    loading,
    error
  };
}