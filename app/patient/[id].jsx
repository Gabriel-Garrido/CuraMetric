import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import Header from '../../components/Header';
import Colors from '../../constant/Colors';
import BackBtn from '../../components/BackBtn';

export default function PatientDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Param del paciente => /patient/[id]
  
  const [patientData, setPatientData] = useState(null);
  const [curations, setCurations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Campos para la nueva curación
  const [newCurationText, setNewCurationText] = useState('');

  useEffect(() => {
    if (id) {
      fetchPatientData(id);
      fetchCurations(id);
    }
  }, [id]);

  // Obtiene los datos del paciente (si deseas mostrarlos en la pantalla)
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
      setLoading(false);
    } catch (error) {
      console.log('Error fetching patient:', error);
      setLoading(false);
    }
  };

  // Obtiene la lista de curaciones (subcolección "curations") para el paciente con ID = id
  const fetchCurations = async (patientId) => {
    try {
      const curationCollectionRef = collection(db, 'patients', patientId, 'curations');
      const snapshot = await getDocs(curationCollectionRef);

      let tempCurations = [];
      snapshot.forEach((doc) => {
        tempCurations.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setCurations(tempCurations);
    } catch (error) {
      console.log('Error fetching curations:', error);
    }
  };

  // Maneja la creación de una nueva curación
  const handleAddCuration = async () => {
    if (!newCurationText.trim()) return; // Evita agregar textos vacíos

    try {
      const curationCollectionRef = collection(db, 'patients', id, 'curations');
      // Estructura de la nueva curación (puedes adaptarla a tu modelo)
      const newCurationData = {
        description: newCurationText,
        createdAt: Timestamp.now(),
      };

      // Guarda la nueva curación en Firestore
      const docRef = await addDoc(curationCollectionRef, newCurationData);

      // Limpia el campo de texto
      setNewCurationText('');

      // Refresca la lista de curaciones
      fetchCurations(id);
    } catch (error) {
      console.log('Error adding curation:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />
      {loading && <ActivityIndicator size="large" color={Colors.primaryBlue} />}

      {patientData && (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingStart: 16 }}>
            <BackBtn/>
        <View style={styles.patientInfoContainer}>
          <Text style={styles.patientName}>{patientData.name}</Text>
          <Text>{patientData.rut}</Text>
          {/* Muestra otras propiedades que desees, por ejemplo: */}
          {/* <Text>{patientData.dob}</Text> */}
          {/* <Text>{patientData.selectedRelevantConditions?.join(', ')}</Text> */}
        </View>
        </View>
      )}

      {/* Sección para ver Curaciones */}
      <Text style={styles.sectionTitle}>Curaciones</Text>
      <FlatList
        data={curations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.curationItem}>
            <Text style={styles.curationText}>- {item.description}</Text>
            <Text style={styles.curationDate}>
              {item.createdAt?.toDate().toLocaleString()}
            </Text>
          </View>
        )}
      />

      {/* Sección para agregar nueva Curación */}
      <View style={styles.addCurationContainer}>
        <TextInput
          value={newCurationText}
          onChangeText={setNewCurationText}
          placeholder="Describe la curación..."
          style={styles.textInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCuration}>
          <Text style={styles.addButtonText}>Agregar curación</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  patientInfoContainer: {
    padding: 16,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryBlue
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginLeft: 16
  },
  curationItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0.3,
    borderBottomColor: '#ccc'
  },
  curationText: {
    fontSize: 16
  },
  curationDate: {
    fontSize: 12,
    color: '#888'
  },
  addCurationContainer: {
    flexDirection: 'column',
    padding: 16
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.borderGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 10
  },
  addButton: {
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  }
});
