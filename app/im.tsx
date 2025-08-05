import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function Im() {
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