import { router, Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";

export default function TabLayout() {
  const { user, loadingAuth } = useContext(AuthContext);
  const router = useRouter();

  console.log(user);

  if (loadingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
if (!user) {
    return router.replace("/login");
}
  return (
    
    <Tabs
    screenOptions={{
      headerShown: false,
      tabBarStyle: { height: 70, paddingBottom: 10 },
      tabBarLabelStyle: { fontSize: 12 },
      tabBarIconStyle: { marginBottom: 0 },
    }}
    >

      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => (
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
