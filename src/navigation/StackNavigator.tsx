import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScanFrontScreen from '../screens/ScanFrontScreen';
import ScanFrontCheckedScreen from '../screens/ScanFrontCheckedScreen';
import ScanBackScreen from '../screens/ScanBackScreen';
import ScanBackCheckedScreen from '../screens/ScanBackCheckedScreen';
import PersonalDataScreen from '../screens/PersonalDataScreen';
import DocumentDataScreen from '../screens/DocumentDataScreen';

export type RootStackParamList = {
  ScanFront: undefined;
  ScanFrontChecked: undefined;
  ScanBack: undefined;
  ScanBackChecked: undefined;
  PersonalData: undefined;
  DocumentData: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ScanFront">
        <Stack.Screen
          name="ScanFront"
          component={ScanFrontScreen}
          options={{ title: 'Escanea la parte delantera' }}
        />
        <Stack.Screen
          name="ScanFrontChecked"
          component={ScanFrontCheckedScreen}
          options={{ title: 'Escanea la parte delantera' }}
        />
        <Stack.Screen
          name="ScanBack"
          component={ScanBackScreen}
          options={{ title: 'Escanea la parte trasera' }}
        />
        <Stack.Screen
          name="ScanBackChecked"
          component={ScanBackCheckedScreen}
          options={{ title: 'Escanea la parte trasera' }}
        />
        <Stack.Screen
          name="PersonalData"
          component={PersonalDataScreen}
          options={{ title: 'Datos personales' }}
        />
        <Stack.Screen
          name="DocumentData"
          component={DocumentDataScreen}
          options={{ title: 'Datos del documento' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;


