import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './Screens/LoginScreen';
import WelcomeScreen from './Screens/WelcomeScreen';
import RegisterScreen from './Screens/RegisterScreen';
import SuccesScreen from './Screens/SuccesScreen';
import DeniedScreen from './Screens/DeniedScreen';
import AccessScreen from './Screens/AccessScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Success" component={SuccesScreen} />
        <Stack.Screen name="Denied" component={DeniedScreen} />
        <Stack.Screen name="Access" component={AccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
