import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/FirebaseConfig';
import Header from '../../../components/Header';
import Colors from '../../../constant/Colors';
import BackBtn from '../../../components/BackBtn';
import { Temporal } from '@js-temporal/polyfill';

export default function PatientDetails() {
  const { id } = useLocalSearchParams(); // ID del paciente desde la URL
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPatientData(id);
    }
  }, [id]);

  const fetchPatientData = async (patientId) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'patients', patientId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPatientData(docSnap.data());
      } else {
        console.log('No se encontró el documento.');
      }
    } catch (error) {
      console.error('Error al obtener datos del paciente:', error);
    }
    setLoading(false);
  };

  const calculateAge = (dobString) => {
    if (!dobString) return "Edad no disponible";
    try {
      const dob = Temporal.PlainDate.from(dobString.split("T")[0]); 
      const today = Temporal.Now.plainDateISO(); 
      const difference = today.since(dob, { largestUnit: "years" }); 
      return `${difference.years} años`;
    } catch (error) {
      console.error("Error al calcular la edad:", error);
      return "Fecha inválida";
    }
  };

  return (
    <View style={styles.screen}>
      <Header />
      
      {loading ? (
        <ActivityIndicator size="large" style={styles.loadingIndicator} />
      ) : patientData ? (
        <View>
          {/* Header con nombre y botón de regreso */}
      <View style={styles.nameRow}>
            <BackBtn />
            <Text style={styles.patientName}>{patientData.name}</Text>
          </View>

        
        <ScrollView contentContainerStyle={styles.container}>
          

          {/* Información General */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>📌 Información General</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📅 Edad:</Text>
              <Text style={styles.infoText}>{calculateAge(patientData.dob)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🆔 RUT:</Text>
              <Text style={styles.infoText}>{patientData.rut}</Text>
            </View>
          </View>

          {/* Condiciones Crónicas */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>⚕️ Condiciones Crónicas</Text>
            <FlatList
            scrollEnabled={false}
              data={patientData.selectedRelevantConditions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.listItem}>• {item}</Text>}
              ListEmptyComponent={<Text style={styles.emptyText}>Sin condiciones registradas</Text>}
            />
          </View>

          {/* Condiciones Predisponentes */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>🩺 Condiciones Predisponentes</Text>
            <FlatList
              scrollEnabled={false}
              data={patientData.selectedPredispositions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.listItem}>• {item}</Text>}
              ListEmptyComponent={<Text style={styles.emptyText}>Sin predisposiciones registradas</Text>}
            />
          </View>
        </ScrollView>
        </View>
      ) : (
        <Text style={styles.errorText}>No se encontró información del paciente.</Text>
      )}
    </View>
  );
}

// **Estilos mejorados**
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.neutralWhite,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
    marginTop:20,
    marginStart: 20
  },
  patientName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primaryBlue,
    marginLeft: 10,
  },
  infoCard: {
    backgroundColor: Colors.secondaryLightBlue,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryBlue,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutralDarkGray,
  },
  infoText: {
    fontSize: 16,
    color: Colors.neutralGray,
  },
  listItem: {
    fontSize: 16,
    color: '#333',
    marginVertical: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});


