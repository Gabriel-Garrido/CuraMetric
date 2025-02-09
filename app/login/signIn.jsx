import React, { useContext } from "react";
import { View, Button } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { AuthContext } from "../../context/AuthContext";

export default function LoginScreen() {
    const { loginWithGoogle } = useContext(AuthContext);

    const [, response, promptAsync] = Google.useAuthRequest({
      expoClientId: "10970491800-kbvm30kb2l216jm121qaiurevpic6i5a.apps.googleusercontent.com",
      iosClientId:
        "10970491800-vrir16rlhhr47grgqnheb907amg4efpk.apps.googleusercontent.com",
      androidClientId:
        "10970491800-np2t9dte7b4d4aipfm7h908s13jr9kql.apps.googleusercontent.com",
      webClientId:
        "10970491800-kbvm30kb2l216jm121qaiurevpic6i5a.apps.googleusercontent.com",
      scopes: ["profile", "email"],
    });

    React.useEffect(() => {
        if (response?.type === "success") {
            loginWithGoogle(response.authentication.accessToken);
        }
    }, [response]);

    return (
        <View>
            <Button title="Login con Google" onPress={() => promptAsync()} />
        </View>
    );
}
