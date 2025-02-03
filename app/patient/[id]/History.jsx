import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Header from "../../../components/Header";
import BackBtn from "../../../components/BackBtn";
import Colors from "../../../constant/Colors";
import { db } from "../../../config/FirebaseConfig";

export default function History() {
  const { id } = useLocalSearchParams(); // Obtiene el ID del paciente
  const [patientData, setPatientData] = useState(null);
  const [curations, setCurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    if (!id) {
      console.log('id del paciente: ', id);
      
      setError("No se encontró el ID del paciente.");
      setLoading(false);
      return;
    }

    fetchPatientData(id);
    fetchCurations(id);
  }, [id]);

  // Obtiene los datos del paciente con mejor manejo de errores
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
      setError("Ocurrió un error al obtener los datos del paciente.");
    } finally {
      setLoading(false);
    }
  };

  // Obtiene las curaciones del paciente
  const fetchCurations = async (patientId) => {
    try {
      const curationsRef = collection(db, "patients", patientId, "curations");
      const snapshot = await getDocs(curationsRef);
      let curationList = [];

      snapshot.forEach((doc) => {
        curationList.push({ id: doc.id, ...doc.data() });
      });

      setCurations(curationList);
    } catch (error) {
      console.error("Error al obtener curaciones:", error);
      setError("Ocurrió un error al obtener el historial de curaciones.");
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

            <Text style={styles.sectionTitle}>Historial de Curaciones</Text>

            {/* Lista de curaciones */}
            <FlatList
              data={curations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.curationItem}>
                  <Text style={styles.curationLocation}>
                    {item.location}
                  </Text>
                  <Text style={styles.curationDate}>
                    {item.createdAt?.seconds
                      ? new Date(item.createdAt.seconds * 1000).toLocaleString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "Fecha desconocida"}
                  </Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No hay curaciones registradas.
                </Text>
              }
            />
          </View>
        ) : (
          <Text style={styles.errorText}>
            No se encontró información del paciente.
          </Text>
        )}
      </View>
    </View>
  );
}

// 🎨 Estilos mejorados
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
      flexDirection: 'row',
      alignItems: 'center',
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
  curationItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: Colors.secondaryLightBlue,
    borderRadius: 10,
  },
  curationLocation: {
    fontSize: 16,
    color: Colors.neutralDarkGray,
  },
  curationDate: {
    fontSize: 14,
    color: Colors.neutralGray,
    marginTop: 5,
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
