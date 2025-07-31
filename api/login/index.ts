import { SERVERS } from '@/hooks/useApi';
import { Platform } from 'react-native';

// 发送验证码接口
export interface SendVCodeRequest {
  phone: string;
}

export interface SendVCodeResponse {
  code: number;
  message: string;
  data?: any;
}

// 手机号登录接口
export interface PhoneLoginRequest {
  iv: string;
  phone: string;
  vcode: string;
}

export interface PhoneLoginResponse {
  code: number;
  message: string;
  data?: any;
}

// 发送验证码
export const sendVCode = async (Phone: string): Promise<SendVCodeResponse> => {
  try {
    // 根据平台选择不同的请求地址
    let apiUrl = `${SERVERS.PHPSERVER}auth/SendVCode`;
    if (__DEV__ && Platform.OS === 'web') {
      apiUrl = '/api/mapi/auth/SendVCode'; // Web端使用代理路径
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Phone,clientid:'143bc4ca2b7bf1c11aeba97d8a1f810a' }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('发送验证码失败:', error);
    throw error;
  }
};

// 手机号登录
export const phoneLogin = async (iv: string, phone: string, vcode: string): Promise<PhoneLoginResponse> => {
  try {
    // 根据平台选择不同的请求地址
    let apiUrl = `${SERVERS.PHPSERVER}auth/PhoneLogin`;
    if (__DEV__ && Platform.OS === 'web') {
      apiUrl = '/api/mapi/auth/PhoneLogin'; // Web端使用代理路径
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ iv, phone, vcode }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('手机号登录失败:', error);
    throw error;
  }
};