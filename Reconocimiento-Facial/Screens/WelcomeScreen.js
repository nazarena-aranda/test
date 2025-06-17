import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import styles from '../Styles/WelcomeStyle';

const WelcomeScreen = ({ navigation }) => {
    return (
        <ImageBackground 
        source={require('../Screens/background.jpg')}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.h1}>Bienvenido!</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.buttonText}>Ir al Registro</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default WelcomeScreen;