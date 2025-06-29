import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Styles/AdminStyle';

const AdminScreen = () => {
    const [open, setOpen] = useState(false);
    const [selectedDoor, setSelectedDoor] = useState('');
    const [items, setItems] = useState([
        { label: 'JCKSV HOLBERTON PB L004C', value: 'JCKSV HOLBERTON PB L004C' },
        { label: 'Biotec L146 Pta. Principal', value: 'Biotec L146 Pta. Principal' },
    ]);

    useEffect(() => {
        const saveDoorToStorage = async () => {
            if (selectedDoor) {
                try {
                    await AsyncStorage.setItem('puerta', selectedDoor);
                } catch (error) {
                    console.error('Error al guardar en AsyncStorage:', error);
                }
            }
        };
        saveDoorToStorage();
    }, [selectedDoor]);

    const sendDoorToBackend = async () => {
        try {
            const puerta = await AsyncStorage.getItem('puerta');
            const body = {
                puerta: puerta,
            };

            const response = await fetch('http://mi-servidor.com/api/backend', { //Compañeritos el mi-servidor ese se cambia cada vez que cambie el http :)
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                console.log('Puerta enviada correctamente');
            } else {
                console.error('Error al enviar la puerta');
            }
        } catch (error) {
            console.error('Error de red o AsyncStorage:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Administrador</Text>
            <Text style={styles.label}>Seleccione su puerta</Text>
            <DropDownPicker
                open={open}
                value={selectedDoor}
                items={items}
                setOpen={setOpen}
                setValue={setSelectedDoor}
                setItems={setItems}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                textStyle={styles.dropdownText}
                placeholder="¿En qué puerta se encuentra?"
            />
            <TouchableOpacity style={styles.confirmButton} onPress={sendDoorToBackend}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AdminScreen;