import React, { useEffect } from "react";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {

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
        name="WoundList"
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
