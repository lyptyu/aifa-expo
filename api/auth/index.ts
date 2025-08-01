import { SERVERS } from '@/hooks/useApi';
import { getAuthParams } from '@/utils/utils';
import { Platform } from 'react-native';

// 重新导出clientCheck相关接口
export { clientCheckV3 } from './clientCheck';
export type { ClientCheckV3Response } from './clientCheck';

// 发送验证码接口
export interface SendVCodeRequest {
  phone: string;
}

export interface SendVCodeResponse {
  code: number;
  msg: string;
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
  msg: string;
  data?: any;
}

// 获取版本信息接口
export interface WebVersionResponse {
  code: number;
  msg: string;
  data?: any;
}

// 发送验证码
export const sendVCode = async (Phone: string): Promise<SendVCodeResponse> => {
  try {
    // 获取认证参数
    const authParams = await getAuthParams();
    
    // 根据平台选择不同的请求地址
    let apiUrl = `${SERVERS.PHPSERVER}auth/SendVCode`;
    if (__DEV__ && Platform.OS === 'web') {
      apiUrl = '/api/auth/SendVCode'; // Web端使用代理路径
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Phone, ...authParams }),
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
    // 获取认证参数
    const authParams = await getAuthParams();
    
    // 根据平台选择不同的请求地址
    let apiUrl = `${SERVERS.PHPSERVER}auth/PhoneLogin`;
    if (__DEV__ && Platform.OS === 'web') {
      apiUrl = '/api/auth/PhoneLogin'; // Web端使用代理路径
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ iv, phone, vcode, ...authParams }),
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

// 获取版本信息
export const getWebVersion = async (uguid: string): Promise<WebVersionResponse> => {
  try {
    // 根据平台选择不同的请求地址
    let apiUrl = `${SERVERS.AICHAT_SERVER}/auth/webversion?env=test&uguid=${uguid}`;
    if (__DEV__ && Platform.OS === 'web') {
      apiUrl = `/aichat/auth/webversion?env=test&uguid=${uguid}`; // Web端使用代理路径
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('获取版本信息失败:', error);
    throw error;
  }
};