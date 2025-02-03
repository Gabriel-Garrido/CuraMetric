import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, FlatList, StyleSheet, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import NoPatients from '../../components/NoPatients';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { getLocalStorage } from '../../service/Storage';
import Colors from '../../constant/Colors';
import PatientItem from '../../components/PatientItem';

export default function PatientList() {
  const router = useRouter();
  const [patientList, setPatientList] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  // 🔄 Función para obtener pacientes de Firestore
  const fetchPatients = async () => {
    setLoading(true);
    setRefreshing(true);
    const user = await getLocalStorage('@user');

    try {
      const patientQuery = query(
        collection(db, 'patients'),
        where('userEmail', '==', user?.email)
      );

      const snapshot = await getDocs(patientQuery);
      let patients = [];
      snapshot.forEach((doc) => {
        patients.push({ ...doc.data(), id: doc.id });
      });

      setPatientList(patients);
      setFilteredPatients(patients);
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
      setError(error);
    }

    setLoading(false);
    setRefreshing(false);
  };

  // 🔍 Filtrar pacientes en tiempo real
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text) {
      setFilteredPatients(patientList);
      return;
    }

    const queryText = text.toLowerCase();
    const filteredData = patientList.filter(
      (patient) =>
        patient.name.toLowerCase().includes(queryText) || patient.rut.includes(queryText)
    );
    setFilteredPatients(filteredData);
  };

  // 🔄 Maneja el "Pull to Refresh"
  const onRefresh = useCallback(() => {
    fetchPatients();
  }, []);

  // 🔽 Carga más pacientes al scrollear al final (puedes agregar paginación aquí si deseas)
  const onEndReached = () => {
    console.log("Usuario llegó al final, refrescando...");
    fetchPatients();
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
      ) : filteredPatients.length > 0 ? (
        error ? (
          <Text>Error: {error.message}</Text>
        ) : (
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/NewPatient')}
            >
              <Text style={styles.addButtonText}>Agregar paciente</Text>
            </TouchableOpacity>

        {/* Buscador */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Buscar por nombre o RUT"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
            {/* Lista de pacientes con Pull to Refresh */}
            <FlatList
              data={filteredPatients}
              renderItem={({ item }) => <PatientItem item={item} />}
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              onEndReachedThreshold={0.2} // 20% antes del final de la lista
            />
          </View>
        )
      ) : (
        <NoPatients />
      )}
    </View>
  );
}

// 🎨 Estilos mejorados
const styles = StyleSheet.create({
  searchContainer: {
    padding: 15,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.borderGray,
  },
  addButton: {
    backgroundColor: Colors.primaryGreen,
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

