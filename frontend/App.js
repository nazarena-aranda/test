import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './Screens/WelcomeScreen';
import RegisterScreen from './Screens/RegisterScreen';
import AdminLoginScreen from './Screens/AdminLoginScreen';
import AdminScreen from './Screens/AdminScreen';
import LoginScreen from './Screens/LoginScreen';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
    const [fontsLoaded] = useFonts({
        PoppinsRegular: Poppins_400Regular,
        PoppinsBold: Poppins_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return <View><Text>Cargando fuentes...</Text></View>;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
                <Stack.Screen name="AdminScreen" component={AdminScreen} />
                <Stack.Screen name="Admin" component={AdminScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;