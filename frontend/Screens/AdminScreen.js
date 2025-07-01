import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Styles/AdminStyle';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';



const AdminScreen = () => {
    const navigation = useNavigation();
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
            const body = {
                doorId: selectedDoor,
            };

            console.log('Body que se envía:', body);

            const response = await fetch('http://172.20.10.11:5001/api/zonamerica/door/open', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                console.log('Puerta enviada correctamente');
            } else {
                const errorText = await response.text();
                console.error('Error al enviar la puerta:', errorText);
}

        } catch (error) {
            console.error('Error de red o AsyncStorage:', error);
        }
    };

    return (
        <>
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
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={sendDoorToBackend}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
        </View>

        
    </>
    );
};

export default AdminScreen;