import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import GoogleLogin from "../components/GoogleLogin";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const handleLoginSuccess = async (googleToken) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/google/`,
        { token: googleToken },
        { withCredentials: true }
      );
      setUser(response.data); // Guarda el usuario autenticado
    } catch (error) {
      console.error("Error al verificar la autenticación:", error);
      setUser(null);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    setLoadingAuth(false); // Finaliza la carga inicial
  }, []);

  return (
    <AuthContext.Provider value={{ user, loadingAuth }}>
      {user ? (
        children
      ) : (
        <GoogleLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </AuthContext.Provider>
  );
};
