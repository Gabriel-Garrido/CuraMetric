import SignInComponent from "../../components/SignInComponent";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogOutBtn from "../../components/LogOutBtn";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {

    const router = useRouter();
  const [userInfo, setUserInfo] = React.useState();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "10970491800-vrir16rlhhr47grgqnheb907amg4efpk.apps.googleusercontent.com",
    androidClientId:
      "10970491800-np2t9dte7b4d4aipfm7h908s13jr9kql.apps.googleusercontent.com",
    webClientId:
      "10970491800-kbvm30kb2l216jm121qaiurevpic6i5a.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  const getLocalUser = async () => {
    try {
        const userJSON = await AsyncStorage.getItem('@user')
        const userData = userJSON ? JSON.parse(userJSON) : null
        setUserInfo(userData)
    } catch (e){
        console.log(e, 'error getting local user')
    }
  }

  React.useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;

      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
        .then((res) => res.json())
        .then((userInfo) => {
          console.log("Información del usuario:", userInfo);

          // Si necesitas vincular esto a Firebase:
          const credential = GoogleAuthProvider.credential(null, access_token);
          return signInWithCredential(auth, credential);
        })
        .then((userCredential) => {
          console.log("Usuario autenticado en Firebase:", userCredential.user);
        })
        .catch((error) => {
          console.error("Error al iniciar sesión:", error);
        });
    }
  }, [response]);

  React.useEffect(() => {
    getLocalUser()
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await AsyncStorage.setItem("@user", JSON.stringify(user));
        console.log("Usuario autenticado:", user);
        router?.push("(tabs)");
        
      } else {
        console.log("Usuario no autenticado.");
      }
      return () => unsubscribe();
    });
  }, []);

  return (
      <ScrollView>
      <SignInComponent promptAsync={promptAsync} />

      </ScrollView>)
    }
