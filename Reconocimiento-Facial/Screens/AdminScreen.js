import React, { useState } from 'react';
import { View, Text, StyleSheet, Picker } from 'react-native';

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    dropdown: {
        height: 50,
        width: '100%',
    },
});

export default AdminScreen;