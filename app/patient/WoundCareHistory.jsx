import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import BackBtn from "../../components/BackBtn";
import { db } from "../../config/FirebaseConfig";
import Header from "../../components/Header";
import Colors from "../../constant/Colors";
import { LineChart } from "react-native-chart-kit";

export default function WoundCareHistory() {
  const { id, woundId } = useLocalSearchParams(); // ID del paciente y la herida
  const [woundCareHistory, setWoundCareHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !woundId) {
      setError("No se encontraron los datos de la herida.");
      setLoading(false);
      return;
    }
    fetchWoundCareHistory(id, woundId);
  }, [id, woundId]);

  // Obtiene el historial de curaciones de la herida específica
  const fetchWoundCareHistory = async (patientId, woundId) => {
    try {
      const woundCareRef = collection(db, "patients", patientId, "wounds", woundId, "woundCare");
      const woundCareQuery = query(woundCareRef, orderBy("createdAt", "asc")); // Ordenado por fecha ascendente
      const snapshot = await getDocs(woundCareQuery);
      let historyList = [];

      snapshot.forEach((doc) => {
        historyList.push({ id: doc.id, ...doc.data() });
      });

      setWoundCareHistory(historyList);
    } catch (error) {
      console.error("Error al obtener historial de curaciones:", error);
      setError("No se pudo obtener el historial de curaciones.");
    } finally {
      setLoading(false);
    }
  };

  // Extrae los datos para los gráficos
  const getChartData = (key) => {
    return woundCareHistory.map((item) => item[key] || 0);
  };

  const getChartLabels = () => {
    return woundCareHistory.map((item, index) => `#${index + 1}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={styles.container}>
      <View style={styles.nameRow}>
                <BackBtn />
                <Text style={styles.title}>Evolución de la Herida</Text>
              </View>
        {loading ? (
          <ActivityIndicator size="large" style={styles.loading} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : woundCareHistory.length > 0 ? (
          <ScrollView nestedScrollEnabled={true}>
            {/* 📊 Gráficos en un View normal */}
            <View style={styles.chartContainer}>
              

              {/* 📊 Evolución del Tamaño */}
              <Text style={styles.chartTitle}>Evolución del Tamaño (cm)</Text>
              <LineChart
                data={{
                  labels: getChartLabels(),
                  datasets: [
                    { data: getChartData("width"), color: () => "#ff6b6b" },
                    { data: getChartData("height"), color: () => "#4ecdc4" },
                    { data: getChartData("depth"), color: () => "#ffa502" },
                  ],
                }}
                width={350}
                height={220}
                yAxisSuffix="cm"
                chartConfig={chartConfig}
                bezier
              />

              {/* 📊 Evolución de Tejidos */}
              <Text style={styles.chartTitle}>Evolución de los Tejidos (%)</Text>
              <LineChart
                data={{
                  labels: getChartLabels(),
                  datasets: [
                    { data: getChartData("granulationTissue"), color: () => "#FF69B4" }, // Rosado
                    { data: getChartData("slough"), color: () => "#FFD700" }, // Amarillo
                    { data: getChartData("necroticTissue"), color: () => "#000000" }, // Negro
                  ],
                }}
                width={350}
                height={220}
                yAxisSuffix="%"
                chartConfig={chartConfig}
                bezier
              />

              {/* 🔹 Leyenda de colores */}
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: "#FF69B4" }]} />
                  <Text style={styles.legendText}>Granulación</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: "#FFD700" }]} />
                  <Text style={styles.legendText}>Esfacelado</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: "#000000" }]} />
                  <Text style={styles.legendText}>Necrótico</Text>
                </View>
              </View>
            </View>

            {/* 📋 Lista de Curaciones dentro de un ScrollView */}
            <Text style={styles.sectionTitle}>Historial de Curaciones</Text>
            <FlatList
              scrollEnabled={false}
              data={woundCareHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.woundCareItem}>
                  <Text style={styles.woundCareDate}>
                    {item.createdAt?.seconds
                      ? new Date(item.createdAt.seconds * 1000).toLocaleString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Fecha desconocida"}
                  </Text>

                  <Text style={styles.sectionTitle}>Tamaño:</Text>
                  <Text style={styles.detailText}>
                    Ancho: {item.width} cm | Alto: {item.height} cm | Profundidad: {item.depth} cm
                  </Text>
                </View>
              )}
            />
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>No hay curaciones registradas.</Text>
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
    chartContainer: {
      paddingBottom: 20, 
    },
    historyContainer: {
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
    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: Colors.primaryBlue,
      marginLeft: 10,
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: Colors.primaryBlue,
      marginTop: 20,
    },
    woundCareItem: {
      padding: 15,
      marginVertical: 8,
      backgroundColor: Colors.secondaryLightBlue,
      borderRadius: 10,
    },
    woundCareDate: {
      fontSize: 16,
      fontWeight: "bold",
      color: Colors.primaryBlue,
      marginBottom: 5,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: Colors.neutralDarkGray,
      marginTop: 5,
    },
    detailText: {
      fontSize: 14,
      color: Colors.neutralGray,
    },
    emptyText: {
      fontSize: 16,
      color: Colors.neutralGray,
      textAlign: "center",
      marginTop: 20,
    },
  });
  
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 1,
    color: () => "#333",
  };
  ''