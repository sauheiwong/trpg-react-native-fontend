import 'react-native-gesture-handler'; // 確保這行在最上面
import * as React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style='auto'/>
        <AppNavigator/>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

