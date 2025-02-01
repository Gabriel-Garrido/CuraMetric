import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../constant/Colors'
import { useRouter } from 'expo-router'

export default function NoPatients() {

    const router = useRouter()
  return (
    <View>
      <View style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: 0,
        width: '100%',
        
      }}>

      <Image source={require('../assets/images/no-patient.png')} style={{
        width: '100%',
        height: 300,
      }}/>
      <Text style={{
        color: Colors.neutralDarkGray,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20
      }}>Sin pacientes todavía</Text>
      </View>
      <TouchableOpacity style={{
        backgroundColor: Colors.primaryGreen,
        padding: 15,
        borderRadius: 10,
        margin: 20
      }} onPress={() => router?.push('/NewPatient')}>
        <Text style={{
          color: 'white',
          textAlign: 'center',
          fontSize: 20
        }}>Agregar paciente</Text>
      </TouchableOpacity>
    </View>
  )
}