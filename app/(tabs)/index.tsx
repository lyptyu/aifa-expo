import { Image } from 'expo-image';
import { ScrollView, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useWebVersion } from '@/hooks/useApi';
import { useAuth } from '@/store/AuthContext';

export default function HomeScreen() {
  const { uguid, logout } = useAuth();
  // 调用API获取版本信息
  const { data, loading, error } = useWebVersion(uguid || '');

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      
      {/* 用户信息和退出按钮 */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">用户信息</ThemedText>
        <ThemedText>当前UGUID: {uguid}</ThemedText>
        <ThemedView style={styles.logoutButton} onTouchEnd={logout}>
          <ThemedText style={styles.logoutButtonText}>退出登录</ThemedText>
        </ThemedView>
      </ThemedView>
      
      {/* API响应数据显示区域 */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">API响应数据</ThemedText>
        {loading && <ThemedText>加载中...</ThemedText>}
        {error && <ThemedText style={styles.errorText}>错误: {error}</ThemedText>}
        {data && (
          <ScrollView style={styles.dataContainer}>
            <ThemedText style={styles.dataText}>
              {JSON.stringify(data, null, 2)}
            </ThemedText>
          </ScrollView>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  dataContainer: {
    maxHeight: 200,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  dataText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 16,
  },
  errorText: {
    color: '#ff4444',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
