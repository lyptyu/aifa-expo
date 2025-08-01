import { SERVERS } from '@/hooks/useApi';
import { Platform } from 'react-native';
import { getAuthParams } from '@/utils/utils';

// ClientCheckV3接口请求参数
export interface ClientCheckV3Request {
  clientid: string;
}

// ClientCheckV3接口响应
export interface ClientCheckV3Response {
  code: number;
  msg: string;
  data?: any;
}

// ClientCheckV3接口
export const clientCheckV3 = async (): Promise<ClientCheckV3Response> => {
  try {
    // 获取认证参数
    const authParams = await getAuthParams();
    
    // 根据平台选择不同的请求地址
    let apiUrl = `${SERVERS.AICHAT_SERVER}/auth/ClientCheckV3`;
    if (__DEV__ && Platform.OS === 'web') {
      apiUrl = '/api/aichat/auth/ClientCheckV3'; // Web端使用代理路径
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authParams),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('ClientCheckV3请求失败:', error);
    throw error;
  }
};