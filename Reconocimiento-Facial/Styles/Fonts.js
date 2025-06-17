import { useFonts } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';

export const loadFonts = async () => {
    SplashScreen.preventAutoHideAsync();

    const [fontsLoaded] = useFonts({
        PoppinsRegular: require('@expo-google-fonts/poppins/Poppins_400Regular.ttf'),
        PoppinsBold: require('@expo-google-fonts/poppins/Poppins_700Bold.ttf'),
    });

    if (fontsLoaded) {
        SplashScreen.hideAsync();
    }
};