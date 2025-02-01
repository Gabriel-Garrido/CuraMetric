import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";

export default function LoginScreen() {

    const router = useRouter()

  return (
    <View>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 0,
        }}
      >
      </View>

      <View style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: 0
      }}>
        <Image source={require('../../assets/images/background-login.png')} 
            style={styles?.image}
        />
      </View>


      <View
        style={{
          padding: 25,
          backgroundColor: Colors.primaryBlue,
          height: "100%",
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
          }}
        >
        Registra las curaciones que realizas
        </Text>
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 17,
            marginTop: 20,
          }}
        >
          Lleva un registro con imágenes y descripciones.
          Visualiza con gráficos la evolución de las curaciones que realizas
        </Text>

        <TouchableOpacity
          style={styles?.button}
          onPress={() => router.push("login/signIn")}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              color: Colors.primaryBlue,
            }}
          >
            Continuar
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            color: "white",
            marginTop: 8,
          }}
        >
          Nota: al presionar 'continuar' aceptas los términos y condiciones
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 400,
    height: 500,
  },
  button: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 99,
    marginTop: 25,
  },
});
