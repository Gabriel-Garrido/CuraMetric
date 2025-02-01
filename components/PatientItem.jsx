import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

export default function PatientItem({item}) {

    const router = useRouter()

  return (
    <TouchableOpacity
                  onPress={() => router.push(`../patient/${item.id}`)}
                >
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: 'lightgray'
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold'
                        }}
                      >
                        {item.name}
                      </Text>
                      {/* Si quisieras mostrar la edad, podrías calcularla o guardarla en DB */}
                      {/* <Text>{item.age} años</Text> */}
                      <Text>{item.rut}</Text>
                    </View>

                    {/* Muestra la foto si existe. Si no hay foto, no se rompe. */}
                    {item.photoURL ? (
                      <Image
                        source={{ uri: item.photoURL }}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25
                        }}
                      />
                    ) : (
                      <Image
                        source={{ uri: 'https://via.placeholder.com/50' }}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
  )
}