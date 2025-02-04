import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  ActivityIndicator
} from "react-native";
import React, { useState } from "react";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";
import { auth } from '../../config/FirebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setLocalStorage } from "../../service/Storage";

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga

  const OnCreateAccount = async () => {
    if (!userName.trim() || !email.trim() || !password.trim()) {
      showMessage("Por favor, completa todos los campos", "error");
      return;
    }

    if (password.length < 6) {
      showMessage("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: userName });

      await setLocalStorage('@user', user);

      showMessage("Cuenta creada exitosamente", "success");

      router.push('(tabs)');
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar mensajes de error y éxito
  const showMessage = (message, type = "info") => {
    if (type === "error") {
      Alert.alert("Error", message);
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else if (type === "success") {
      Alert.alert("Éxito", message);
      ToastAndroid.show(message, ToastAndroid.LONG);
    }
  };

  // Manejo de errores de autenticación
  const handleAuthError = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        showMessage("Este correo ya está registrado", "error");
        break;
      case "auth/invalid-email":
        showMessage("Correo inválido. Verifica el formato", "error");
        break;
      case "auth/weak-password":
        showMessage("La contraseña es demasiado débil", "error");
        break;
      default:
        showMessage("Ocurrió un error. Inténtalo nuevamente", "error");
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Crear nueva cuenta</Text>
      <Text style={styles.subText}>Únete a CuraMetric</Text>

      <View style={styles.inputContainer}>
        <Text>Nombre y Apellido</Text>
        <TextInput
          placeholder="Nombre y apellido"
          style={styles.textInput}
          onChangeText={(value) => setUserName(value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Email</Text>
        <TextInput
          placeholder="Email"
          style={styles.textInput}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(value) => setEmail(value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Contraseña</Text>
        <TextInput
          placeholder="Mínimo 6 caracteres"
          style={styles.textInput}
          secureTextEntry={true}
          onChangeText={(value) => setPassword(value)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={OnCreateAccount} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Crear cuenta</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonCreate}
        onPress={() => router.push("login/signIn")}
      >
        <Text style={styles.textLogin}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

// **Estilos mejorados**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: Colors.neutralWhite,
  },
  textHeader: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 15,
  },
  subText: {
    fontSize: 18,
    color: Colors.neutralGray,
    marginTop: 5,
  },
  inputContainer: {
    marginTop: 20,
  },
  textInput: {
    padding: 12,
    borderWidth: 1,
    fontSize: 16,
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: "white",
    borderColor: Colors.borderGray,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.primaryBlue,
    borderRadius: 10,
    marginTop: 35,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 17,
    color: "white",
    fontWeight: "bold",
  },
  buttonCreate: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
    alignItems: "center",
  },
  textLogin: {
    fontSize: 16,
    color: Colors.primaryBlue,
    fontWeight: "600",
  },
});

