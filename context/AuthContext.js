import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const loginWithGoogle = async (token) => {
        try {
            const response = await fetch("http://localhost:8000/auth/google/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data);
                if (data.access) {
                    await AsyncStorage.setItem("token", data.access);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};
