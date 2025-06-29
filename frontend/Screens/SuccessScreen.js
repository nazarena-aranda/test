import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SuccessScreen({ route }) {
  const { user } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Acceso concedido</Text>
      {user && <Text style={styles.userText}>Bienvenida/o, {user}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dff0d8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: '#3c763d',
    marginBottom: 10,
  },
  userText: {
    fontSize: 18,
    color: '#3c763d',
  },
});
