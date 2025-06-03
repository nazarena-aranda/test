import React, { useState } from 'react'; 
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../Styles/RegisterStyle';

const RegisterScreen = () => {
    const [open, setOpen] = useState(false);
    const [selectedDocumentType, setSelectedDocumentType] = useState('cedula');
    const [items, setItems] = useState([
        { label: 'Cédula Uruguaya', value: 'cedula' },
        { label: 'Pasaporte', value: 'pasaporte' },
        { label: 'Credencial', value: 'credencial' },
        { label: 'DNI (Argentino)', value: 'dni argentino' },
        { label: 'Documento Brasilero', value: 'documento brasilero' },
        { label: 'Otro', value: 'otro' },
    ]);

    const [showPassword, setShowPassword] = useState(false);

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
            <TextInput style={styles.input} placeholder="Documento" />
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputWithIcon}
                    placeholder="Contraseña"
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                        name={showPassword ? 'eye-slash' : 'eye'} 
                        style={styles.eyeIcon}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => {}}>
                <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RegisterScreen;
