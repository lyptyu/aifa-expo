import { useWebVersion, useAuthParams } from '@/hooks/useApi';
import { useAuth } from '@/store/AuthContext';
import { Text, View } from 'react-native';


export default function HomeScreen() {
  const { uguid, clientid, logout } = useAuth();
  const authParams = useAuthParams();
  // 调用API获取版本信息，优先使用uguid，如果没有则使用clientid
  const { data } = useWebVersion(uguid || clientid || '');

  return (
    <View>
      <View>
        <Text>当前UGUID: {uguid || '未登录'}</Text>
        <Text>当前ClientID: {clientid}</Text>
        <Text>认证参数: {JSON.stringify(authParams)}</Text>
      </View>
      <View>
        <Text>API响应数据:{data}</Text>
      </View>
      <View>
          <Text onPress={() => {
            logout();
          }}>退出登录</Text>
        </View>
    </View>
  );
}
