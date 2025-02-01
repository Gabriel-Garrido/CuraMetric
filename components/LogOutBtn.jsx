import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Colors from '../constant/Colors';

export default function LogOutBtn({ toggleMenu }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          try {
            await signOut(auth);
            await AsyncStorage.removeItem('@user');
            toggleMenu();
            router.push('/login');
          } catch (error) {
            console.log('Error al cerrar sesión:', error);
          }
        }}
      >
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.alertRed, // Rojo llamativo
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: Colors.borderGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Sombra para Android
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
