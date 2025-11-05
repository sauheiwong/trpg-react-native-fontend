import 'react-native-gesture-handler'; // 確保這行在最上面

import * as React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';

import { useFonts } from 'expo-font';
import { Feather } from '@expo/vector-icons';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { View, Text } from 'react-native';

import { COLORS } from './src/constants/color';

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: COLORS.highlight2, backgroundColor: COLORS.black, minWidth: '40%' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: COLORS.text,
      }}
    />
  ),
};

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
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
}

