import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccessScreen from './Screens/AccessScreen';
import SuccessScreen from './Screens/SuccessScreen';
import DeniedScreen from './Screens/DeniedScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Access">
        <Stack.Screen
          name="Access"
          component={AccessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SuccessScreen"
          component={SuccessScreen}
          options={{ title: 'Acceso concedido' }}
        />
        <Stack.Screen
          name="DeniedScreen"
          component={DeniedScreen}
          options={{ title: 'Acceso denegado' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
