import { phoneLogin, sendVCode } from '@/api/login';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { getCdnImageUrl } from '@/utils/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import '../css/global.css';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { login } = useAuth();
  const { showToast } = useToast();

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handlePhoneLogin = async () => {
    if (!phoneNumber.trim()) {
      showToast('请输入手机号');
      return;
    }
    if (!verificationCode.trim()) {
      showToast('请输入验证码');
      return;
    }

    // 简单的手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      showToast('请输入正确的手机号格式');
      return;
    }

    setLoading(true);
    try {
      const response = await phoneLogin('', phoneNumber, verificationCode);
      
      // 打印登录结果
      console.log('手机号登录结果:', response);
      
      if (response.code === 1000) {
        // 保存uguid到store
        if (response.data && response.data.uguid) {
          await login(response.data.uguid);
          showToast('欢迎使用AIFA!');
          // 跳转到首页
          router.replace('/(tabs)');
        } else {
          showToast('服务器返回数据异常');
        }
      } else {
        showToast(response.message || '登录失败，请重试');
      }
    } catch (error) {
      console.error('登录错误:', error);
      showToast('登录时出错，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleWechatLogin = async () => {
    setLoading(true);
    try {
      // TODO: 实现微信登录逻辑
      console.log('微信登录');
      showToast('微信登录功能待实现');  
    } catch (error) {
      showToast('微信登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleGetVerificationCode = async () => {
    if (!phoneNumber.trim()) {
      showToast('请先输入手机号');
      return;
    }
    
    // 简单的手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      showToast('请输入正确的手机号格式');
      return;
    }
    
    try {
      setLoading(true);
      const response = await sendVCode(phoneNumber);
      
      if (response.code === 1000) {
        showToast('验证码已发送到您的手机');
        // 开始倒计时
        setCountdown(60);
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
      } else {
        showToast(response.message || '验证码发送失败，请重试');
      }
    } catch (error) {
      console.error('发送验证码错误:', error);
      showToast('验证码发送失败，请重试');
    } finally {
      setLoading(false);
    }
  };

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
                 className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-4 text-base text-white outline-none"
                 placeholder="请输入手机号"
                 placeholderTextColor="rgba(255,255,255,0.6)"
                 value={phoneNumber}
                 onChangeText={setPhoneNumber}
                 autoCapitalize="none"
                 autoCorrect={false}
                 keyboardType="phone-pad"
                 maxLength={11}
               />
             </View>
             
             {/* 验证码输入 */}
              <View className="mb-6">
                <Text className="text-white/90 text-sm font-medium mb-2">验证码</Text>
                <View className="w-full flex-row gap-3">
                  <View className="flex-1">
                    <TextInput
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-4 text-base text-white"
                      style={{ outline: 'none' }}
                      placeholder="请输入验证码"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>
                  <TouchableOpacity 
                    className={`px-4 py-4 rounded-xl border w-[100px] items-center justify-center ${
                      countdown > 0 || loading 
                        ? 'bg-white/10 border-white/20' 
                        : 'bg-white/20 border-white/40'
                    }`}
                    onPress={handleGetVerificationCode}
                    disabled={countdown > 0 || loading}
                  >
                    <Text className={`text-xs font-medium text-center ${
                      countdown > 0 || loading 
                        ? 'text-white/50' 
                        : 'text-white'
                    }`}>
                      {countdown > 0 ? `${countdown}s` : loading ? '发送中' : '获取验证码'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            
            {/* 登录按钮 */}
             <TouchableOpacity 
               onPress={handlePhoneLogin} 
               disabled={loading}
             >
               <LinearGradient
                 colors={loading ? ['#9CA3AF', '#9CA3AF'] : ['#3B82F6', '#8B5CF6']}
                 className="w-full py-4 items-center mb-4"
                 style={{borderRadius:8}}
               >
                 <Text className="text-white text-base font-semibold">
                   {loading ? '登录中...' : '立即登录'}
                 </Text>
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
              disabled={loading}
            >
              <Image source={{uri: getCdnImageUrl('wechat_login_202507311538.png')}} className='w-[36px] h-[36px] rounded-full'/>
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