import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useChat } from '@/store/ChatContext';

export default function Im() {
  const { resetUnreadMessageCount } = useChat();

  // 监听页面焦点变化，离开页面时重置未读消息数量
  useFocusEffect(
    useCallback(() => {
      return () => {
        // 页面失去焦点时执行，即离开页面时
        resetUnreadMessageCount();
      };
    }, [resetUnreadMessageCount])
  );

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'http://192.168.0.115:8080?userID=aifa2' }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});