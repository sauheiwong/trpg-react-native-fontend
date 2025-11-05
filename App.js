import 'react-native-gesture-handler'; // 確保這行在最上面

import * as React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';

import { useFonts } from 'expo-font';
import { Feather } from '@expo/vector-icons';

export default function App() {
  const [fontsLoaded] = useFonts({
    // 這裡的 key 'Feather' 可以是任何您喜歡的名字
    // value 則必須是從 @expo/vector-icons 引入的字體物件
    'Feather': Feather.font,
    // 如果您還用了其他圖示庫 (例如 Ionicons)，也可以像這樣一起加入：
    // 'Ionicons': Ionicons.font,
  });

  // if (!fontsLoaded) {
  //   console.log('not fontsLoaded')
  //   return null;
  // }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style='auto'/>
        <AppNavigator/>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

