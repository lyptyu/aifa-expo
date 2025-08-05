import { useAuthParams, useWebVersion } from '@/hooks/useApi';
import { useAuth } from '@/store/AuthContext';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  const { uguid, clientid, logout } = useAuth();
  const authParams = useAuthParams();
  // 调用API获取版本信息，优先使用uguid，如果没有则使用clientid
  const { data } = useWebVersion(uguid || clientid || '');

  return (
    <View>
      <View>
        <Text>认证参数: {JSON.stringify(authParams)}</Text>
      </View>
      <View>
        <Text>API响应数据:{JSON.stringify(data)}</Text>
      </View>
      <View>
        {uguid ? (
          <Text onPress={() => {
            logout();
          }}>退出登录</Text>
        ) : (
          <Text onPress={() => {
            router.push('/login');
          }}>请先登录</Text>
        )}
      </View>
      <View>
        <Text onPress={() => {
          router.push('/im');
        }}>跳转到IM</Text>
      </View>
    </View>
  );
}
