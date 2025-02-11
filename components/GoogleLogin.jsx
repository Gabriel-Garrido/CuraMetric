import React, { useEffect, useState } from "react";
import { Button, Text, View, Platform } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from "expo-web-browser";

// Cierra la ventana emergente en Web después de autenticarse
if (Platform.OS === "web") {
  WebBrowser.maybeCompleteAuthSession();
}

// Dirección del backend Django
const BACKEND_URL = "http://127.0.0.1:8000"; // Cambia "127.0.0.1" por tu IP local si pruebas en un celular real

// CLIENT_ID de Google desde Google Cloud Console
const GOOGLE_CLIENT_ID = {
  android: "10970491800-np2t9dte7b4d4aipfm7h908s13jr9kql.apps.googleusercontent.com",
  ios: "10970491800-vrir16rlhhr47grgqnheb907amg4efpk.apps.googleusercontent.com",
  web: "10970491800-kbvm30kb2l216jm121qaiurevpic6i5a.apps.googleusercontent.com",
};

// CLIENT_SECRET solo para OAuth Web Client
const GOOGLE_CLIENT_SECRET = "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";

// URL de Google para intercambiar el `code` por un `access_token`
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export default function GoogleLogin({ onLoginSuccess }) {
  const [userInfo, setUserInfo] = useState(null);
  const [codeVerifier, setCodeVerifier] = useState(null); // Guardamos el `codeVerifier`

  // Configurar discovery de Google
  const discovery = AuthSession.useAutoDiscovery("https://accounts.google.com");

  // Configurar la solicitud de autenticación con Google
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID[Platform.OS] || GOOGLE_CLIENT_ID.web,
      scopes: ["openid", "profile", "email"],
      redirectUri: AuthSession.makeRedirectUri({
        useProxy: Platform.OS !== "web",
        native: "com.tuapp://redirect", // Cambia "com.tuapp" por el esquema de tu app
      }),
      responseType: "code",
      codeChallengeMethod: "S256",
    },
    discovery
  );

  // Guardar el `codeVerifier` cuando se haga la solicitud de autenticación
  useEffect(() => {
    if (request?.codeVerifier) {
      console.log("✅ Code Verifier generado:", request.codeVerifier);
      setCodeVerifier(request.codeVerifier); // Guardamos el `codeVerifier`
    }
  }, [request]);

  // Manejar la respuesta de Google
  useEffect(() => {
    if (response?.type === "success" && response.params?.code && codeVerifier) {
      console.log("✅ Código de autorización recibido:", response.params.code);
      exchangeCodeForToken(response.params.code, codeVerifier);
    } else if (response) {
      console.log("⚠️ Respuesta de Google sin `code`:", response);
    }
  }, [response, codeVerifier]);

  // Función para intercambiar `code` por `access_token`
  const exchangeCodeForToken = async (code, verifier) => {
    try {
      console.log("🔄 Intercambiando `code` por `access_token`...");
      console.log("🔑 Enviando Code Verifier:", verifier);

      const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: code,
          client_id: GOOGLE_CLIENT_ID.web,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: AuthSession.makeRedirectUri({ useProxy: Platform.OS !== "web" }),
          grant_type: "authorization_code",
          code_verifier: verifier, // Se asegura de enviar el `codeVerifier` correcto
        }).toString(),
      });

      const tokenData = await tokenResponse.json();
      console.log("🔄 Token de acceso de Google:", tokenData);

      if (tokenData.access_token) {
        sendTokenToDjango(tokenData.access_token);
      } else {
        console.error("❌ Error obteniendo el token de Google:", tokenData);
      }
    } catch (error) {
      console.error("❌ Error intercambiando `code` por `access_token`:", error);
    }
  };

  const sendTokenToDjango = async (accessToken) => {
    try {
      console.log("🚀 Enviando `access_token` a Django...");
  
      if (Platform.OS !== "web") {
        try {
          await SecureStore.setItemAsync("google_access_token", accessToken);
          console.log("✅ Token guardado en SecureStore");
        } catch (error) {
          console.error("❌ No se pudo guardar en SecureStore. Continuando sin guardar:", error);
        }
      } else {
        try {
          localStorage.setItem("google_access_token", accessToken);
          console.log("✅ Token guardado en localStorage");
        } catch (error) {
          console.error("❌ No se pudo guardar en localStorage:", error);
        }
      }
  
      // Enviar el token a Django
      const loginResponse = await fetch(`${BACKEND_URL}/auth/app/google/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken }),
      });
  
      const data = await loginResponse.json();
      console.log("🔄 Respuesta de Django:", data);
  
      if (data.access) {
        if (Platform.OS !== "web") {
          try {
            await SecureStore.setItemAsync("jwt_token", data.access);
            console.log("✅ JWT guardado en SecureStore");
          } catch (error) {
            console.error("❌ No se pudo guardar el JWT en SecureStore:", error);
          }
        } else {
          localStorage.setItem("jwt_token", data.access);
          console.log("✅ JWT guardado en localStorage");
        }
        setUserInfo(data.user);
      } else {
        console.log("⚠️ Error en la autenticación con Django:", data);
      }
    } catch (error) {
      console.error("❌ Error enviando el token a Django:", error);
    }
  };
  
  return (
    <View>
      <Button
        title="Iniciar sesión con Google"
        onPress={() => promptAsync({ useProxy: Platform.OS !== "web" })}
        disabled={!request}
      />
      {userInfo && <Text>Bienvenido, {userInfo.email}</Text>}
    </View>
  );
}
