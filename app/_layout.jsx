import { Stack } from "expo-router";
import { Platform, View, StyleSheet } from "react-native"; // Importa Platform y StyleSheet correctamente
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  if (Platform.OS === "web") {
    return (
      <AuthProvider>
        <View style={styles.webContainer}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login/index" />
          </Stack>
        </View>
      </AuthProvider>
    );
  } else {
    return (
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login/index" />
        </Stack>
      </AuthProvider>
    );
  }
}

const styles = StyleSheet.create({
  webContainer: {
    maxWidth: 900, // Ancho máximo para el diseño móvil
    marginHorizontal: "auto", // Centrar horizontalmente
    width: "100%", // Asegura que no se exceda del ancho
    height: "100%", // Llena toda la altura disponible
    // Asegura que el contenedor respete el contenido
  },
});
