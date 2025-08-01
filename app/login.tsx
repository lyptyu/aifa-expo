import { phoneLogin, sendVCode } from '@/api/auth';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { getCdnImageUrl } from '@/utils/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import '../css/global.css';

// 常量定义
const CONSTANTS = {
  PHONE_REGEX: /^1[3-9]\d{9}$/,
  COUNTDOWN_DURATION: 60,
  MAX_PHONE_LENGTH: 11,
  MAX_CODE_LENGTH: 6,
  SUCCESS_CODE: 1000,
} as const;

// 验证工具函数
const validatePhone = (phone: string): { isValid: boolean; message?: string } => {
  if (!phone.trim()) {
    return { isValid: false, message: '请输入手机号' };
  }
  if (!CONSTANTS.PHONE_REGEX.test(phone)) {
    return { isValid: false, message: '请输入正确的手机号格式' };
  }
  return { isValid: true };
};

const validateCode = (code: string): { isValid: boolean; message?: string } => {
  if (!code.trim()) {
    return { isValid: false, message: '请输入验证码' };
  }
  return { isValid: true };
};

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { login, clientid } = useAuth();
  const { showToast } = useToast();

  // 倒计时逻辑
  const startCountdown = useCallback(() => {
    setCountdown(CONSTANTS.COUNTDOWN_DURATION);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handlePhoneLogin = useCallback(async () => {
    // 验证手机号
    const phoneValidation = validatePhone(phoneNumber);
    if (!phoneValidation.isValid) {
      showToast(phoneValidation.message!);
      return;
    }

    // 验证验证码
    const codeValidation = validateCode(verificationCode);
    if (!codeValidation.isValid) {
      showToast(codeValidation.message!);
      return;
    }

    setLoginLoading(true);
    try {
      const response = await phoneLogin('', phoneNumber, verificationCode);
      
      console.log('手机号登录结果:', response);
      
      if (response.code === CONSTANTS.SUCCESS_CODE) {
        if (response.data?.uguid) {
          await login(response.data.uguid);
          showToast('欢迎使用AIFA!');
          router.replace('/(tabs)');
        } else {
          showToast('服务器返回数据异常');
        }
      } else {
        showToast(response.msg || '登录失败，请重试');
      }
    } catch (error) {
      console.error('登录错误:', error);
      showToast('登录时出错，请重试');
    } finally {
      setLoginLoading(false);
    }
  }, [phoneNumber, verificationCode, login, showToast]);

  const handleWechatLogin = useCallback(async () => {
    setLoginLoading(true);
    try {
      // TODO: 实现微信登录逻辑
      console.log('微信登录');
      showToast('微信登录功能待实现');
    } catch (error) {
      console.error('微信登录错误:', error);
      showToast('微信登录时出错，请重试');
    } finally {
      setLoginLoading(false);
    }
  }, [showToast]);

  const handleGetVerificationCode = useCallback(async () => {
    // 验证手机号
    const phoneValidation = validatePhone(phoneNumber);
    if (!phoneValidation.isValid) {
      showToast(phoneValidation.message!);
      return;
    }
    
    setCodeLoading(true);
    try {
      const response = await sendVCode(phoneNumber, clientid || '');
      
      if (response.code === CONSTANTS.SUCCESS_CODE) {
        showToast('验证码已发送到您的手机');
        startCountdown();
      } else {
        showToast(response.msg || '验证码发送失败，请重试');
      }
    } catch (error) {
      console.error('发送验证码错误:', error);
      showToast('验证码发送失败，请重试');
    } finally {
      setCodeLoading(false);
    }
  }, [phoneNumber, showToast, startCountdown]);

  return (
    <KeyboardAvoidingView 
      className="flex-1" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center px-6">
          {/* Logo区域 */}
          <View className="items-center">
            <Image 
              source={require('../assets/images/aifaicon.png')}
              style={{width: 120, height: 120}}
              className="mb-4"
              resizeMode="contain"
            />
          </View>

          {/* 登录卡片 */}
          <View className="w-full">
            <Text className="text-white text-2xl font-bold text-center mb-2">登录Aifa</Text>
            
            {/* 手机号输入 */}
             <View className="mb-4">
               <Text className="text-white/90 text-sm font-medium mb-2">手机号</Text>
               <TextInput
                 className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-base text-white outline-none"
                 placeholder="请输入手机号"
                 placeholderTextColor="rgba(255,255,255,0.6)"
                 value={phoneNumber}
                 onChangeText={setPhoneNumber}
                 autoCapitalize="none"
                 autoCorrect={false}
                 keyboardType="phone-pad"
                 maxLength={CONSTANTS.MAX_PHONE_LENGTH}
               />
             </View>
             
             {/* 验证码输入 */}
              <View className="mb-6">
                <Text className="text-white/90 text-sm font-medium mb-2">验证码</Text>
                <View className="w-full flex-row gap-3">
                  <View className="flex-1">
                    <TextInput
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-base text-white"
                      style={{ outline: 'none' }}
                      placeholder="请输入验证码"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="number-pad"
                      maxLength={CONSTANTS.MAX_CODE_LENGTH}
                    />
                  </View>
                  <TouchableOpacity 
                    className={`px-4 py-3 rounded-xl border w-[100px] items-center justify-center ${
                      countdown > 0 || codeLoading 
                        ? 'bg-white/10 border-white/20' 
                        : 'bg-white/20 border-white/40'
                    }`}
                    onPress={handleGetVerificationCode}
                    disabled={countdown > 0 || codeLoading}
                  >
                    {codeLoading ? (
                      <ActivityIndicator size="small" color="rgba(255,255,255,0.5)" />
                    ) : (
                      <Text className={`text-xs font-medium text-center ${
                        countdown > 0 
                          ? 'text-white/50' 
                          : 'text-white'
                      }`}>
                        {countdown > 0 ? `${countdown}s` : '获取验证码'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            
            {/* 登录按钮 */}
             <TouchableOpacity 
               onPress={handlePhoneLogin} 
             >
               <LinearGradient
                 colors={['#3B82F6', '#8B5CF6'] }
                 className="w-full py-4 h-[55px] items-center mb-4"
                 style={{borderRadius:8}}
               >
                 {loginLoading ? (
                   <ActivityIndicator size="small" color="white" />
                 ) : (
                   <Text className="text-white text-base font-semibold">
                     立即登录
                   </Text>
                 )}
               </LinearGradient>
             </TouchableOpacity>
            
            {/* 分割线 */}
             <View className="flex-row items-center my-6">
               <View className="flex-1 h-px bg-white/30" />
               <Text className="px-4 text-white/60 text-sm">第三方登录</Text>
               <View className="flex-1 h-px bg-white/30" />
             </View>
            
            {/* 微信登录 */}
            <TouchableOpacity 
              className="w-full bg-white-500 py-4 rounded-xl items-center"
              onPress={handleWechatLogin} 
              disabled={loginLoading}
            >
              <Image source={{uri: getCdnImageUrl('wechat_login_202507311538.png')}} className='w-[35px] h-[35px] rounded-full'/>
              {/* <Text className="text-white text-base font-semibold">
                {loading ? '登录中...' : '微信登录'}
              </Text> */}
            </TouchableOpacity>
          </View>
          
          {/* 底部协议 */}
          <Text className="text-white/60 text-xs text-center mt-8 leading-5">
            登录即表示您同意我们的
            <Text className="text-white/80 underline">服务条款</Text>
            和
            <Text className="text-white/80 underline">隐私政策</Text>
          </Text>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}