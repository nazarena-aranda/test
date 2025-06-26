import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../Styles/WelcomeStyle';

const WelcomeScreen = ({ navigation }) => {
    return (
        <ImageBackground 
            source={require('../Screens/background.jpg')}
            style={styles.background}
        >
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.settingsIcon}
                    onPress={() => navigation.navigate('Admin')}
                >
                    <Icon name="settings-outline" size={30} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.h1}>Bienvenido a FaceGo!</Text>
                <Text style={styles.subtitle}>
                    Un sistema de acceso rápido y seguro mediante reconocimiento facial.
                </Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.buttonText}>Registrarme</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.buttonText}>Ingresar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

export default WelcomeScreen;