import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import Header from '../../components/Header'
import NoPatients from '../../components/NoPatients'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config/FirebaseConfig'
import { getLocalStorage } from '../../service/Storage'
import Colors from '../../constant/Colors'
import PatientItem from '../../components/PatientItem'

export default function HomeScreen() {
  const router = useRouter()
  const [patientList, setPatientList] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getPatients()
  }, [])

  const getPatients = async () => {
    const user = await getLocalStorage('@user')
    setPatientList([])
    try {
      const response = query(
        collection(db, 'patients'),
        where('userEmail', '==', user?.email)
      )

      const data = await getDocs(response)
      data.forEach((doc) => { 
        console.log("docId: ", doc.id + " => " + JSON.stringify(doc.data()));
        // doc.data() contiene la info del paciente
        // doc.id es el ID del documento en Firestore

        // Agregamos el ID del documento como parte del objeto que guardamos en el array
        setPatientList(prev => [...prev, { ...doc.data(), id: doc.id }])
      })

      setLoading(false)

    } catch(error) {
      console.log('Error: ', error)
      setError(error)
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />

      {loading ? (
        <ActivityIndicator size={'large'}  />
      ) : patientList?.length > 0 ? (
        error ? (
          <Text>error: {error.message}</Text>
        ) : (
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.primaryGreen,
                padding: 15,
                borderRadius: 10,
                margin: 20
              }}
              onPress={() => router.push('/NewPatient')}
            >
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 20
                }}
              >
                Agregar paciente
              </Text>
            </TouchableOpacity>

            {/* Lista de pacientes */}
            <FlatList
              data={patientList}
              renderItem={({ item }) => (
                <PatientItem item={item}/>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )
      ) : (
        <NoPatients/>
      )}
    </View>
  )
}
