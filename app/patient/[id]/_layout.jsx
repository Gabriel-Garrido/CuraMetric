import React, { useEffect } from "react";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../config/FirebaseConfig";

export default function TabLayout() {
  const router = useRouter();
  const {id} = useLocalSearchParams("id"); // ✅ Obtiene el parámetro de la URL

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Usuario autenticado:", user.uid);
      } else {
        router.push("/login"); // ✅ Redirige al login si no está autenticado
      }
    });

    return () => unsubscribe(); // ✅ Limpieza del listener
  }, [router]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70, // Aumenta la altura de la barra inferior
          paddingBottom: 10, // Espacio inferior
          paddingTop: 0, // Espacio superior
        },
        tabBarLabelStyle: {
          fontSize: 12, // Tamaño de fuente del label
        },
        tabBarIconStyle: {
          marginBottom: 0, // Ajuste para la posición del ícono
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Datos del paciente",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
        initialParams={{ id }} // ✅ Pasa el parámetro a la pantalla
      />
      <Tabs.Screen
        name="AddWoundCare"
        options={{
          tabBarLabel: "Nueva curación",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="plus-circle" size={35} color={color} />
          ),
        }}
        initialParams={{ id }} // ✅ Pasa el parámetro a la pantalla
      />
      <Tabs.Screen
        name="History"
        options={{
          tabBarLabel: "Historial de curaciones",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="history" size={size} color={color} />
          ),
        }}
        initialParams={{ id }} // ✅ Pasa el parámetro a la pantalla
      />
    </Tabs>
  );
}
