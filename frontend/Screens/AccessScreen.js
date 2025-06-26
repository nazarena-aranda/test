import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function AccessScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acceso Concedido ✅</Text>
      <Text style={styles.text}>¡Bienvenido!</Text>
      <Button title="Volver" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
