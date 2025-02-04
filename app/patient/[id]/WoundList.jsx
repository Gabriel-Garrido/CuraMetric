import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";
import Header from "../../../components/Header";
import Colors from "../../../constant/Colors";
import BackBtn from "../../../components/BackBtn";

export default function WoundList() {
  const { id } = useLocalSearchParams(); // ID del paciente
  const router = useRouter();
  const [wounds, setWounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchWounds(id);
    }
  }, [id]);

  const fetchWounds = async (patientId) => {
    try {
      const woundRef = collection(db, "patients", patientId, "wounds");
      const snapshot = await getDocs(woundRef);
      let woundList = [];

      snapshot.forEach((doc) => {
        woundList.push({ id: doc.id, ...doc.data() });
      });

      setWounds(woundList);
    } catch (error) {
      console.error("Error al obtener heridas:", error);
      Alert.alert("Error", "No se pudieron cargar las heridas.");
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={styles.container}>
        <View style={styles.nameRow}>
          <BackBtn />
          <Text style={styles.title}>Lista de Heridas</Text>
        </View>

        {/* Botón para agregar nueva herida */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push({ pathname: `/patient/AddWound`, params: { id } })}
        >
          <Text style={styles.addButtonText}>+ Agregar Nueva Herida</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
        ) : wounds.length === 0 ? (
          <Text style={styles.emptyText}>No hay heridas registradas.</Text>
        ) : (
          <FlatList
            data={wounds}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.woundItem}>
                <View style={styles.woundInfo}>
                  <Text style={styles.woundText}>Localización: {item.location}</Text>
                  <Text style={styles.woundDate}>
                    Fecha de origen: {new Date(item.date.seconds * 1000).toLocaleDateString("es-ES")}
                  </Text>
                  <Text style={styles.woundOrigin}>Origen: {item.origin}</Text>
                </View>

                {/* Botón para agregar una nueva curación a esta herida */}
                <TouchableOpacity
                  style={styles.newCareButton}
                  onPress={() => router.push({ pathname: `/patient/AddWoundCare`, params: { id, woundId: item.id } })}
                >
                  <Text style={styles.newCareButtonText}>Nueva Curación</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
    marginTop: 10
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primaryBlue,
    marginLeft: 10,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.neutralGray,
    textAlign: "center",
    marginTop: 20,
  },
  woundItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: Colors.secondaryLightBlue,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  woundInfo: {
    flex: 1,
  },
  woundText: {
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
  addButton: {
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.neutralWhite,
  },
  newCareButton: {
    backgroundColor: Colors.primaryBlue,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  newCareButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.neutralWhite,
  },
});
