import React, { useState } from 'react';
import { View, Text, Picker } from 'react-native';
import styles from '../Styles/AdminStyle';
const AdminScreen = () => {
    const [selectedDoor, setSelectedDoor] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Administrador</Text>
            <Text style={styles.label}>Seleccione su puerta</Text>
            <Picker
                selectedValue={selectedDoor}
                style={styles.dropdown}
                onValueChange={(itemValue) => setSelectedDoor(itemValue)}
            >
                <Picker.Item label="JCKSV HOLBERTON PB L004C" value="JCKSV HOLBERTON PB L004C" />
                <Picker.Item label="Biotec L146 Pta. Principal" value="Biotec L146 Pta. Principal" />
            </Picker>
        </View>
    );
};

export default AdminScreen;