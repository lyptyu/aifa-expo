import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';

export default function Im() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'http://192.168.0.115:8080' }}
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