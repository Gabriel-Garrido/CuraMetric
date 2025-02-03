import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/FirebaseConfig';
import Header from '../../../components/Header';
import Colors from '../../../constant/Colors';
import BackBtn from '../../../components/BackBtn';
import { Temporal } from '@js-temporal/polyfill';

export default function PatientDetails() {
  const { id } = useLocalSearchParams(); // Recibe el ID del paciente desde la URL
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPatientData(id);
      console.log('ID del paciente:', id);
      
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
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
    }
    setLoading(false);
  };

  // 🔹 Nueva función para calcular correctamente la edad con `Temporal`
  const calculateAge = (dobString) => {
    if (!dobString) return "Edad no disponible";

    try {
      const dob = Temporal.PlainDate.from(dobString.split("T")[0]); // Obtiene la fecha de nacimiento
      const today = Temporal.Now.plainDateISO(); // Fecha actual en formato ISO
      const difference = today.since(dob, { largestUnit: "years" }); // Calcula la diferencia en años
      return `${difference.years} años`;
    } catch (error) {
      console.error("Error al calcular la edad:", error);
      return "Fecha inválida";
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.neutralWhite }}>
      <Header />

      {loading ? (
        <ActivityIndicator size={'large'} style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}/>
      ) : patientData ? (
        <View style={styles.container}>
          {/* Nombre en una fila con el botón de regreso */}
          <View style={styles.nameRow}>
            <BackBtn />
            <Text style={styles.patientName}>{patientData.name}</Text>
          </View>

          {/* Datos del paciente */}
          <View style={styles.patientInfo}>
            <Text style={styles.infoLabel}>Edad:</Text>
            <Text style={styles.infoText}>{calculateAge(patientData.dob)}</Text>

            <Text style={styles.infoLabel}>RUT:</Text>
            <Text style={styles.infoText}>{patientData.rut}</Text>

            <Text style={styles.infoLabel}>Registrado por:</Text>
            <Text style={styles.infoText}>
              {patientData.userName} ({patientData.userEmail})
            </Text>
          </View>

          {/* Condiciones Crónicas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Condiciones Crónicas</Text>
            <FlatList
              data={patientData.selectedRelevantConditions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.listItem}>• {item}</Text>}
              ListEmptyComponent={<Text style={styles.emptyText}>Sin condiciones registradas</Text>}
            />
          </View>

          {/* Condiciones Predisponentes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Condiciones Predisponentes</Text>
            <FlatList
              data={patientData.selectedPredispositions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.listItem}>• {item}</Text>}
              ListEmptyComponent={<Text style={styles.emptyText}>Sin predisposiciones registradas</Text>}
            />
          </View>
        </View>
      ) : (
        <Text style={styles.errorText}>No se encontró información del paciente.</Text>
      )}
    </View>
  );
}

// Estilos mejorados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
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
  patientInfo: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.secondaryLightBlue,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutralDarkGray,
  },
  infoText: {
    fontSize: 16,
    color: Colors.neutralGray,
    marginBottom: 8,
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryBlue,
    marginBottom: 8,
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
