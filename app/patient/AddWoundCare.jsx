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
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import Header from "../../components/Header";
import Colors from "../../constant/Colors";

/** Componentes */
import PickerComponent from "../../components/PickerComponent";
import BackBtn from "../../components/BackBtn";

export default function AddWoundCare() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { id, woundId } = useLocalSearchParams(); // Recibimos el ID del paciente y la herida

  // Campos del formulario
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [depth, setDepth] = useState("");
  const [borders, setBorders] = useState(""); // Picker
  const [surroundingSkin, setSurroundingSkin] = useState(""); // Picker
  const [exudateAmount, setExudateAmount] = useState(""); // Picker
  const [exudateType, setExudateType] = useState(""); // Picker
  const [edema, setEdema] = useState(""); // Picker
  const [granulationTissue, setGranulationTissue] = useState("");
  const [slough, setSlough] = useState("");
  const [necroticTissue, setNecroticTissue] = useState("");

  // Validación de campos numéricos
  const isNumeric = (value) => /^\d+(\.\d+)?$/.test(value);

  // Función para guardar la curación en Firestore
  const handleSaveWoundCare = async () => {
    if (!id || !woundId) {
      Alert.alert("Error", "No se encontró el ID del paciente o la herida.");
      return;
    }

    // Validación de campos numéricos
    if (
      !isNumeric(width) ||
      !isNumeric(height) ||
      !isNumeric(depth) ||
      !isNumeric(granulationTissue) ||
      !isNumeric(slough) ||
      !isNumeric(necroticTissue)
    ) {
      Alert.alert("Error", "Las medidas deben ser valores numéricos.");
      return;
    }

    // Validar que la suma de los tejidos no supere el 100%
    const totalTissue =
      parseFloat(granulationTissue || 0) +
      parseFloat(slough || 0) +
      parseFloat(necroticTissue || 0);

    if (totalTissue > 100) {
      Alert.alert(
        "Error",
        "La suma de los porcentajes de tejidos no puede superar el 100%."
      );
      return;
    }

    setLoading(true);

    try {
      const woundCareRef = collection(
        db,
        "patients",
        id,
        "wounds",
        woundId,
        "woundCare"
      );

      await addDoc(woundCareRef, {
        width: parseFloat(width),
        height: parseFloat(height),
        depth: parseFloat(depth),
        borders,
        surroundingSkin,
        exudateAmount,
        exudateType,
        edema,
        granulationTissue: parseFloat(granulationTissue),
        slough: parseFloat(slough),
        necroticTissue: parseFloat(necroticTissue),
        createdAt: Timestamp.now(),
      });

      setLoading(false);
      Alert.alert("Éxito", "Curación agregada correctamente.");
      router.push(`/patient/${id}/WoundList`); // Redirige al listado de heridas del paciente
    } catch (error) {
      setLoading(false);
      console.error("Error al guardar la curación:", error);
      Alert.alert("Error", "No se pudo guardar la curación.");
    }
  };

  return (
    <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header />
        <ScrollView style={styles.container}>
          <View style={styles.nameRow}>
            <BackBtn />
            <Text style={styles.title}>Nueva Curación</Text>
          </View>

          <Text style={styles.label}>Tamaño (cm)</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.smallInput]}
              keyboardType="numeric"
              value={width}
              onChangeText={setWidth}
              placeholder="Ancho"
              placeholderTextColor={Colors.neutralGray}
            />
            <TextInput
              style={[styles.input, styles.smallInput]}
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
              placeholder="Alto"
              placeholderTextColor={Colors.neutralGray}
            />
            <TextInput
              style={[styles.input, styles.smallInput]}
              keyboardType="numeric"
              value={depth}
              onChangeText={setDepth}
              placeholder="Prof."
              placeholderTextColor={Colors.neutralGray}
            />
          </View>

          <Text style={styles.label}>Tejidos (%)</Text>
          <View style={styles.row}>
            {[
              { label: "Granulatorio", value: granulationTissue, setValue: setGranulationTissue },
              { label: "Esfacelado", value: slough, setValue: setSlough },
              { label: "Necrótico", value: necroticTissue, setValue: setNecroticTissue },
            ].map((item, index) => (
              <View key={index} style={styles.tejidoContainer}>
                <Text style={styles.tejidoLabel}>{item.label}</Text>
                <TextInput
                  style={[styles.input, styles.tejidoInput]}
                  keyboardType="numeric"
                  value={item.value}
                  onChangeText={(value) => {
                    if (parseFloat(value) > 100) return;
                    item.setValue(value);
                  }}
                  placeholder="0"
                  placeholderTextColor={Colors.neutralGray}
                />
              </View>
            ))}
          </View>

          <Text style={styles.label}>Bordes</Text>
          <PickerComponent selectedValue={borders} setSelectedValue={setBorders} options={["Regulares", "Irregulares", "Engrosados", "Invertidos", "Socavados"]} label={"Bordes"} />

          <Text style={styles.label}>Piel circundante</Text>
          <PickerComponent selectedValue={surroundingSkin} setSelectedValue={setSurroundingSkin} options={["Sana", "Eritematosa", "Descamativa", "Macerada"]} label={"Piel Circundante"} />

          <Text style={styles.label}>Edema</Text>
          <PickerComponent selectedValue={edema} setSelectedValue={setEdema} options={["+", "++", "+++"]} label={"Edema"} />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveWoundCare}>
            <Text style={styles.saveButtonText}>Guardar Curación</Text>
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.neutralDarkGray,
    marginBottom: 5,
    marginTop: 10,
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
  smallInput: {
    flex: 1,
    marginRight: 8,
    textAlign: "center",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
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
  tejidoContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  tejidoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.neutralDarkGray,
    marginBottom: 5,
  },
  tejidoInput: {
    textAlign: "center",
    flex: 1,
    width: "100%",
  },
});
