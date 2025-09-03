import * as React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style='auto'/>
      <AppNavigator/>
    </AuthProvider>
  );
}

