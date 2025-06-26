import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'; // Cambiar la importación
import styles from '../Styles/AdminStyle';

const AdminScreen = () => {
    const [open, setOpen] = useState(false);
    const [selectedDoor, setSelectedDoor] = useState('');
    const [items, setItems] = useState([
        { label: 'JCKSV HOLBERTON PB L004C', value: 'JCKSV HOLBERTON PB L004C' },
        { label: 'Biotec L146 Pta. Principal', value: 'Biotec L146 Pta. Principal' },
    ]);

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
        </View>
    );
};

export default AdminScreen;