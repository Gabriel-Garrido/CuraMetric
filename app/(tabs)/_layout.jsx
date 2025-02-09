import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { getLocalStorage } from "../../service/Storage";

export default function TabLayout() {
  const router = useRouter();

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
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={35} color={color} />
          ),
        }}
      />
        <Tabs.Screen
          name="PatientList"
          options={{
            tabBarLabel: "Pacientes",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="list" size={size} color={color} />
            ),
          }}
        />

    </Tabs>
  );
}
