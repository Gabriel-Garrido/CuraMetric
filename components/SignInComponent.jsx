import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Colors from "../constant/Colors";
import { useRouter } from "expo-router";

export default function SignInComponent({ promptAsync }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const OnSignInClick = () => {
    if (!email || !password) {
      Alert.alert("Please enter email and password");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        await setLocalStorage('@user', user)
        router.replace('/(tabs)')
        // ...
      })
      .catch((error) => {

        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == "auth/invalid-credential") {
          Alert.alert("Invalid email or password");
        }
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.textHeader}>Te damos la bienvenida</Text>
        <Text style={styles.subText}>¡Vamos a comenzar</Text>
        <Text style={styles.subText}>a curar esas heridas!</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Iniciar sesión con tu cuenta</Text>
        <View style={styles.inputContainer}>
        <Text>Email</Text>
        <TextInput placeholder="Email" style={styles.textInput}
        onChangeText={(value)=>setEmail(value)} />

        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
          placeholder="Password"
          style={styles.textInput}
          secureTextEntry={true}
          onChangeText={(value)=>setPassword(value)}
        />

        </View>

        <TouchableOpacity style={styles.button} onPress={OnSignInClick}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Otras opciones de inicio de sesión
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../assets/images/google-logo.png")}
              style={{
                width: 30,
                height: 30,
                marginRight: 10,
              }}
            />
            <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Eres nuevo aquí?</Text>
        <TouchableOpacity
          style={styles.buttonCreate}
          onPress={() => router.push("login/signUp")}
        >
          <Text style={styles.createText}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  textHeader: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 50,
  },
  subText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    color: Colors.neutralGray,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: Colors.neutralDarkGray,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.neutralDarkGray,
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    fontSize: 17,
    borderRadius: 10,
    backgroundColor: "white",
    borderColor: Colors.neutralGray,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.primaryBlue,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 17,
    color: "white",
    textAlign: "center",
  },
  buttonCreate: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
  },
  createText: {
    fontSize: 17,
    color: Colors.primaryBlue,
    textAlign: "center",
  },
});
