import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/store/AuthContext';
import { ToastProvider } from '@/store/ToastContext';
import '../css/global.css';

import NetInfo from '@react-native-community/netinfo';
import TencentCloudChat from '@tencentcloud/chat';
import TIMUploadPlugin from 'tim-upload-plugin';
let options = {
  SDKAppID: 1600099722 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
};
// 创建 SDK 实例，`TencentCloudChat.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let chat = TencentCloudChat.create(options); // SDK 实例通常用 chat 表示
chat.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
// 注册腾讯云即时通信富媒体资源上传插件
chat.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});
// 注册网络监听插件
chat.registerPlugin({'chat-network-monitor': NetInfo});

let promise = chat.login({
  userID: 'aifa2',
  userSig: 'eJwtzF0LgjAYhuH-8h6HbNNtTehIJIKiqEDpbLSpbyMZJtIH-feWevhcNzwfOG9P0WA7SIFFBBbjRmPbHiscWWOl2Rwexmnv0UBKBSFEKcnYVOzTY2eDc85ZSJP2eP*b5EksEkL5-IJ1*O3pYb8rG70hNn8LL42Ij3VxKW5X-1KuNSL3pRts1qyXK-j*AAROMV0_',
});
promise.then(function(imResponse) {
  if (imResponse.data.repeatLogin === true) {
    // 标识账号已登录，本次登录操作为重复登录。
    console.log(imResponse.data.errorInfo);
  }
}).catch(function(imError) {
  // 登录失败的相关信息
  console.warn('login error:', imError);
});
export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ToastProvider>
    </AuthProvider>
  );
}
