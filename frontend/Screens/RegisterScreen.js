import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../Styles/RegisterStyle';
import TokenManager from '../utils/TokenManager';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
    const navigation = useNavigation();
    const [open, setOpen] = useState(false);
    const [selectedDocumentType, setSelectedDocumentType] = useState('C');
    const [items, setItems] = useState([
        { label: 'Cédula Uruguaya', value: 'C' },
        { label: 'Pasaporte', value: 'P' },
        { label: 'Credencial', value: 'credencial' },
        { label: 'DNI (Argentino)', value: 'dni argentino' },
        { label: 'Documento Brasilero', value: 'documento brasilero' },
        { label: 'Otro', value: 'otro' },
    ]);

    const [document, setDocument] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        if (!document || !password) {
            Alert.alert('Error', 'Completa todos los campos.');
            return;
        }

        try {
            const response = await fetch('http://172.20.10.11:5001/api/zonamerica/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    TipoDoc: selectedDocumentType,
                    ValorDoc: document,
                    Password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Respuesta del backend:", data);

                const token = data.Token || data.token;
                console.log("Token recibido del backend:", token);

                if (!token) {
                    Alert.alert('Error', 'No se recibió el token del backend.');
                    return;
                }

                await TokenManager.setToken(token);

                Alert.alert('Registro exitoso', 'Ahora vamos a registrar tu rostro.');

                navigation.navigate("Login", {
                    mode: "biometric",
                    tipoDoc: selectedDocumentType,
                    valorDoc: document,
                });
            } else {
                let errorMessage = 'Contraseña de ZonaGo inexistente';
                try {
                    const errorData = await response.json();
                    if (errorData.message === 'An error occurred during registration.') {
                        errorMessage = 'Usuario ya registrado.';
                    } else {
                        console.log("Detalle del error:", errorData);
                    }
                } catch (parseError) {
                    const errorText = await response.text();
                    console.log("Error sin formato JSON:", errorText);
                }
                Alert.alert('Error', errorMessage);
            }
        } catch (error) {
            console.log("Error de red:", error);
            Alert.alert('Error', 'No se pudo conectar con el servidor.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>

            <Text style={styles.label}>Tipo de Documento</Text>
            <DropDownPicker
                open={open}
                value={selectedDocumentType}
                items={items}
                setOpen={setOpen}
                setValue={setSelectedDocumentType}
                setItems={setItems}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                textStyle={styles.dropdownText}
                placeholder="Seleccione un tipo de documento"
            />

            <TextInput
                style={styles.input}
                placeholder="Documento"
                value={document}
                onChangeText={setDocument}
            />

            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputWithIcon}
                    placeholder="Contraseña"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                        name={showPassword ? 'eye-slash' : 'eye'} 
                        style={styles.eyeIcon}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RegisterScreen;