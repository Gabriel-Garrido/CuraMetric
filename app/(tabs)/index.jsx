import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext"; // Importa el contexto de autenticación
import Header from "../../components/Header";
import Colors from "../../constant/Colors";

export default function Home() {
  const router = useRouter();
  const { user, loadingAuth } = useContext(AuthContext); // Obtiene el usuario del contexto
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    if (!loadingAuth && !user) {
      router.replace("/login"); // Redirige si no está autenticado
    }
  }, [user, loadingAuth]);
  

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={{ flex: 1 }}>
          <Header />
          <Image
            source={require("../../assets/images/background-login.png")}
            style={{ width: "100%", height: 300 }}
          />
          <View style={styles.container}>
            <Text style={styles.welcomeText}>
              Hola, {user ? user.username : "Usuario"} 👋
            </Text>
            <Text style={styles.subtitle}>Bienvenido a CuraMetric</Text>

            {/* Acceso rápido a la lista de pacientes */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/PatientList")}
            >
              <Text style={styles.buttonText}>📋 Ver lista de pacientes</Text>
            </TouchableOpacity>

            {/* Resumen rápido de datos */}
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                {loading ? (
                  <ActivityIndicator
                    size={"large"}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                ) : (
                  <Text style={styles.statNumber}>{patients.length}</Text>
                )}
                <Text style={styles.statLabel}>Pacientes registrados</Text>
              </View>
              <View style={styles.statBox}>
                {loading ? (
                  <ActivityIndicator
                    size={"large"}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                ) : (
                  <Text style={styles.statNumber}>--</Text>
                )}
                <Text style={styles.statLabel}>Curaciones registradas</Text>
              </View>
            </View>

            {/* Últimos pacientes agregados */}
            <Text style={styles.sectionTitle}>Últimos pacientes</Text>
            {loading ? (
              <Text style={styles.loadingText}>Cargando...</Text>
            ) : (
              <FlatList
                data={patients.slice(0, 5)} // Muestra solo los 5 más recientes
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.patientItem}
                    onPress={() => router.push(`/patient/${item.id}`)}
                  >
                    <Text style={styles.patientName}>{item.name}</Text>
                    <Text style={styles.patientRut}>RUT: {item.rut}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    No has registrado pacientes aún.
                  </Text>
                }
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}

// Estilos mejorados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutralWhite,
    paddingHorizontal: 20,
    paddingTop: 10,
    bottom: 0,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primaryBlue,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.neutralGray,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.neutralWhite,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.secondaryLightBlue,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primaryBlue,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.neutralGray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.neutralGray,
    textAlign: "center",
  },
  patientItem: {
    backgroundColor: Colors.neutralWhite,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    marginBottom: 10,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  patientRut: {
    fontSize: 14,
    color: Colors.neutralGray,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
  },
});

