import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CheckinProvider } from './src/context/CheckinContext';
import StackNavigator from './src/navigation/StackNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <CheckinProvider>
        <StackNavigator />
      </CheckinProvider>
    </SafeAreaProvider>
  );
}
