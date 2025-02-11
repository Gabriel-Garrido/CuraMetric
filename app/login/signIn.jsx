import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { AuthContext } from "../../context/AuthContext";
import Colors from "../../constant/Colors"; // Usa tu archivo de constantes de colores
import GoogleLogin from "../../components/GoogleLogin";

export default function LoginScreen() {
  const { loginWithGoogle } = useContext(AuthContext);

  const [, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "10970491800-kbvm30kb2l216jm121qaiurevpic6i5a.apps.googleusercontent.com",
    iosClientId:
      "10970491800-vrir16rlhhr47grgqnheb907amg4efpk.apps.googleusercontent.com",
    androidClientId:
      "10970491800-np2t9dte7b4d4aipfm7h908s13jr9kql.apps.googleusercontent.com",
    webClientId:
      "10970491800-kbvm30kb2l216jm121qaiurevpic6i5a.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    redirectUri:
      Platform.OS === "web"
        ? "http://localhost:8081"
        : "http://localhost:19006",
  });

  useEffect(() => {
    if (response?.type === "success") {
      loginWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      {/* Imagen de fondo */}
      <Image
        source={require("../../assets/images/background-login.png")} // Cambia esta ruta según tu proyecto
        style={styles.backgroundImage}
      />

      {/* Título y descripción */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Bienvenido a CuraMetric</Text>
        <Text style={styles.description}>
          Lleva un registro de las curaciones con imágenes y gráficos. Inicia
          sesión para continuar.
        </Text>
      </View>

      {/* Botón de inicio de sesión con Google */}
      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => promptAsync()}
      >
        <Image
          source={require("../../assets/images/google-logo.png")} // Añade un ícono de Google en tu proyecto
          style={styles.googleIcon}
        />
        <GoogleLogin
          onLoginSuccess={(user) => console.log("Usuario autenticado:", user)}
        />{" "}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBlue, // Cambia este color según tu diseño
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.1, // Hace que la imagen sea sutil
  },
  textContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.neutralWhite,
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: Colors.neutralWhite,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutralWhite,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Para sombra en Android
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primaryBlue,
  },
});
