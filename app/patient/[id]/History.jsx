import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Header from "../../../components/Header";
import BackBtn from "../../../components/BackBtn";
import Colors from "../../../constant/Colors";
import { db } from "../../../config/FirebaseConfig";

export default function History() {
  const { id } = useLocalSearchParams(); // ID del paciente
  const router = useRouter();
  const [patientData, setPatientData] = useState(null);
  const [wounds, setWounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No se encontró el ID del paciente.");
      setLoading(false);
      return;
    }
    fetchPatientData(id);
    fetchWounds(id);
  }, [id]);

  // Obtiene los datos del paciente
  const fetchPatientData = async (patientId) => {
    try {
      const docRef = doc(db, "patients", patientId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPatientData(docSnap.data());
      } else {
        setError("No se encontró información del paciente.");
      }
    } catch (error) {
      console.error("Error al obtener paciente:", error);
      setError("Error al obtener los datos del paciente.");
    } finally {
      setLoading(false);
    }
  };

  // Obtiene las heridas del paciente
  const fetchWounds = async (patientId) => {
    try {
      const woundsRef = collection(db, "patients", patientId, "wounds");
      const snapshot = await getDocs(woundsRef);
      let woundList = [];

      snapshot.forEach((doc) => {
        woundList.push({ id: doc.id, ...doc.data() });
      });

      setWounds(woundList);
    } catch (error) {
      console.error("Error al obtener heridas:", error);
      setError("Error al obtener el historial de heridas.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" style={styles.loading} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : patientData ? (
          <View style={styles.patientContainer}>
            {/* Nombre en una fila con el botón de regreso */}
            <View style={styles.nameRow}>
              <BackBtn />
              <Text style={styles.patientName}>{patientData.name}</Text>
            </View>

            <Text style={styles.sectionTitle}>Historial de Heridas</Text>

            {/* Lista de heridas */}
            <FlatList
              data={wounds}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.woundItem}>
                  <Text style={styles.woundLocation}>
                    Localización: {item.location}
                  </Text>
                  <Text style={styles.woundDate}>
                    Fecha de origen:{" "}
                    {item.date?.seconds
                      ? new Date(item.date.seconds * 1000).toLocaleDateString("es-ES")
                      : "Desconocida"}
                  </Text>
                  <Text style={styles.woundOrigin}>Origen: {item.origin}</Text>

                  {/* Botón para ver evolución */}
                  <TouchableOpacity
                    style={styles.evolutionButton}
                    onPress={() => router.push({ 
                      pathname: `/patient/WoundCareHistory`, 
                      params: { id, woundId: item.id } 
                    })}
                  >
                    <Text style={styles.evolutionButtonText}>Ver Evolución</Text>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No hay heridas registradas.
                </Text>
              }
            />
          </View>
        ) : (
          <Text style={styles.errorText}>No se encontró información del paciente.</Text>
        )}
      </View>
    </View>
  );
}

// 🎨 **Estilos mejorados**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  patientContainer: {
    flex: 1,
    marginTop: 10,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  patientName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primaryBlue,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primaryBlue,
    marginTop: 20,
  },
  woundItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: Colors.secondaryLightBlue,
    borderRadius: 10,
  },
  woundLocation: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.neutralDarkGray,
  },
  woundDate: {
    fontSize: 14,
    color: Colors.neutralGray,
    marginTop: 5,
  },
  woundOrigin: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primaryBlue,
    marginTop: 5,
  },
  evolutionButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: Colors.primaryGreen,
    borderRadius: 8,
    alignItems: "center",
  },
  evolutionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.neutralWhite,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

