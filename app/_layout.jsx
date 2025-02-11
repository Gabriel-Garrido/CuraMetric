import React, { useContext } from "react";
import { Stack } from "expo-router";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { AuthContext, AuthProvider } from "../context/AuthContext";
export default function RootLayout() {

  return (
    <AuthProvider>

    <Stack screenOptions={{ headerShown: false }}>

        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
    </Stack>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
