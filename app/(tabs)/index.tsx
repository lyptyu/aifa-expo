import { useWebVersion } from '@/hooks/useApi';
import { useAuth } from '@/store/AuthContext';
import { Text, View } from 'react-native';


export default function HomeScreen() {
  const { uguid, logout } = useAuth();
  // 调用API获取版本信息
  const { data } = useWebVersion(uguid || '');

  return (
    <View>
      <View>
        <Text>当前UGUID: {uguid}</Text>
        
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
