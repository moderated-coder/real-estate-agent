import React from 'react';
import {SafeAreaView, StyleSheet, Platform} from 'react-native';
import {WebView} from 'react-native-webview';

const LOCAL_HOST =
  Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';
const DEPLOYED_URL = 'https://your-deployed-react-app.com'; // 실제 배포된 주소

const App = () => {
  const webviewUrl = __DEV__ ? LOCAL_HOST : DEPLOYED_URL;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{uri: webviewUrl}}
        style={styles.webview}
        injectedJavaScript={`
          document.documentElement.style.webkitTouchCallout='none';
          document.documentElement.style.webkitUserSelect='none';
        `}
        onLoad={() => console.log('WebView Loaded')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default App;
