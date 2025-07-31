import { useEffect, useState } from 'react';

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
  const url = `${SERVERS.AICHAT_SERVER}/auth/webversion?env=test&uguid=${uguid}`;
  return useApi(url);
}