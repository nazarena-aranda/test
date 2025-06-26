import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../Styles/RegisterStyle';

const RegisterScreen = () => {
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
                Alert.alert('Registro exitoso', 'Ahora vamos a registrar tu rostro.');
                navigation.navigate("LoginScreen", {
                    mode: "biometric",
                    tipoDoc: selectedDocumentType,
                    valorDoc: document,
                });
            } else {
                const error = await response.text();
                console.log("Error al registrar:", error);
                Alert.alert('Error', 'No se pudo registrar al usuario.');
                const data = await response.json();
                Alert.alert('Registro exitoso', 'Tus datos se han enviado correctamente.');
                const errorData = await response.json();
                if (errorData.message === 'Usuario ya registrado') {
                    Alert.alert('Error', 'Usuario ya registrado.');
                } else {
                    Alert.alert('Error', 'Hubo un problema al enviar tus datos.');
                }
            }
        } catch (error) {
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

export default RegisterScreen
