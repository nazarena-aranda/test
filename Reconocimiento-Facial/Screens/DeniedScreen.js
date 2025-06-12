import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DeniedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Acceso denegado</Text>
      <Text style={styles.subtext}>Por favor, intentá nuevamente.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2dede',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: '#a94442',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#a94442',
  },
});
