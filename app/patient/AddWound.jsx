import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "../../components/Header";
import Colors from "../../constant/Colors";
import BackBtn from "../../components/BackBtn";
import DateField from "../../components/DateField";
import PickerComponent from "../../components/PickerComponent";

export default function AddWound() {
  const { id } = useLocalSearchParams(); // ID del paciente
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Campos del formulario
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date()); // Fecha actual por defecto
  const [origin, setOrigin] = useState(""); // Picker

  // Función para guardar la herida en Firestore
  const handleSaveWound = async () => {
    if (!id) {
      Alert.alert("Error", "No se encontró el ID del paciente.");
      return;
    }

    // Validación de campos obligatorios
    if (!location.trim() || !origin) {
      Alert.alert("Error", "Debe completar todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const patientDocRef = doc(db, "patients", id);
      const woundRef = collection(patientDocRef, "wounds");

      await addDoc(woundRef, {
        location,
        date: Timestamp.fromDate(date),
        origin,
        createdAt: Timestamp.now(),
      });

      setLoading(false);
      Alert.alert("Éxito", "Herida agregada correctamente.");
      router.push(`/patient/${id}/WoundList`);
    } catch (error) {
      setLoading(false);
      console.error("Error al guardar la herida:", error);
      Alert.alert("Error", "No se pudo guardar la herida.");
    }
  };

  return (
    <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header />
        <ScrollView style={styles.container}>
          <View style={styles.nameRow}>
            <BackBtn />
            <Text style={styles.title}>Agregar Nueva Herida</Text>
          </View>

          <Text style={styles.label}>Localización de la herida</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Ej: Tobillo derecho"
          />

          <Text style={styles.label}>Fecha de origen</Text>
          <DateField dateValue={date} onDateChange={setDate} />

          <Text style={styles.label}>Origen de la herida</Text>
          <PickerComponent
            selectedValue={origin}
            setSelectedValue={setOrigin}
            options={[
              "Úlcera por presión",
              "Herida quirúrgica",
              "Quemadura",
              "Herida traumática",
              "Úlcera venosa",
              "Úlcera arterial",
              "Pie diabético",
            ]}
            label="Origen de la herida"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveWound}>
            <Text style={styles.saveButtonText}>Guardar Herida</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primaryBlue,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.neutralWhite,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.neutralWhite,
  },
});
