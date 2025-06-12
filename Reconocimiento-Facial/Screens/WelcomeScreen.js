import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../Styles/WelcomeStyle';

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.buttonText}>Ir a Registro</Text>
            </TouchableOpacity>
        </View>
    );
};

export default WelcomeScreen;