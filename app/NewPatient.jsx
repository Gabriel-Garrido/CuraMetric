import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { Temporal } from "@js-temporal/polyfill";
import Header from "../components/Header";
import Colors from "../constant/Colors";
import { auth, db } from "../config/FirebaseConfig";
import DateField from "../components/DateField";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import Checkbox from "expo-checkbox";
import { id } from "react-native-paper-dates";
import BackBtn from "../components/BackBtn";

function showAlert(title, message) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

// Función para formatear el RUT con puntos y guion
const formatRut = (rut) => {
  let cleanRut = rut.replace(/\./g, "").replace(/-/g, "").replace(/[^0-9Kk]/g, "");
  if (cleanRut.length <= 1) return cleanRut;

  let body = cleanRut.slice(0, -1);
  let dv = cleanRut.slice(-1);

  // Agrega puntos cada 3 dígitos desde la derecha
  let formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedBody}-${dv}`;
};

// Función para validar el dígito verificador del RUT
const validateRut = (rut) => {
  let cleanRut = rut.replace(/\./g, "").replace("-", "").toUpperCase();
  if (cleanRut.length < 2) return false;

  let body = cleanRut.slice(0, -1);
  let dv = cleanRut.slice(-1);

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier < 7 ? multiplier + 1 : 2;
  }

  let calculatedDv = 11 - (sum % 11);
  calculatedDv = calculatedDv === 11 ? "0" : calculatedDv === 10 ? "K" : `${calculatedDv}`;
  return dv === calculatedDv;
};

// Listado de 12 condiciones crónicas/enfermedades más relevantes
const relevantConditionsList = [
  "Diabetes Mellitus",
  "Insuficiencia Venosa Crónica",
  "Insuficiencia Arterial Periférica",
  "Hipertensión Arterial",
  "Obesidad",
  "Insuficiencia Renal Crónica",
  "Cirrosis Hepática",
  "Artritis Reumatoide",
  "Cáncer en tratamiento activo",
  "Trastornos Autoinmunes",
  "Enfermedad Pulmonar Crónica",
  "Cardiopatías Graves",
];

// Listado de condiciones predisponentes
const predispositionsList = [
  "Tabaquismo",
  "Alcoholismo Crónico",
  "Drogadicción",
  "Inmovilidad",
  "Desnutrición",
  "Uso prolongado de Corticosteroides",
  "Uso de Inmunosupresores",
  "Radioterapia/Quimioterapia reciente",
];

export default function NewPatient() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Campos del formulario
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [rutError, setRutError] = useState("");
  const [dob, setDob] = useState(undefined);

  // Arreglos para almacenar las condiciones seleccionadas
  const [selectedRelevantConditions, setSelectedRelevantConditions] = useState([]);
  const [selectedPredispositions, setSelectedPredispositions] = useState([]);

  // Verifica autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });
    return unsubscribe;
  }, [router]);

  // Capitaliza las palabras a medida que el usuario ingresa el nombre
  const handleNameChange = (text) => {
    const words = text.split(" ");
    const capitalizedWords = words.map((w) => {
      if (!w) return "";
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    });
    setName(capitalizedWords.join(" "));
  };

  // Formatea y valida el RUT en tiempo real
  const handleRutChange = (text) => {
    let formattedRut = formatRut(text);
    setRut(formattedRut);

    if (!validateRut(formattedRut)) {
      setRutError("RUT inválido.");
    } else {
      setRutError("");
    }
  };

  // Maneja selección de condiciones relevantes
  const handleRelevantConditionToggle = (condition, isChecked) => {
    if (isChecked) {
      setSelectedRelevantConditions((prev) => [...prev, condition]);
    } else {
      setSelectedRelevantConditions((prev) =>
        prev.filter((item) => item !== condition)
      );
    }
  };

  // Maneja selección de condiciones predisponentes
  const handlePredispositionToggle = (condition, isChecked) => {
    if (isChecked) {
      setSelectedPredispositions((prev) => [...prev, condition]);
    } else {
      setSelectedPredispositions((prev) =>
        prev.filter((item) => item !== condition)
      );
    }
  };

  // Función de guardado en Firestore
  const handleSave = async () => {
    // Validación de nombre
    setLoading(true);
    if (!name.trim()) {
      showAlert("Error", "El nombre no puede estar vacío.");
      return;
    }

    // Validación de RUT
    if (!validateRut(rut)) {
      showAlert("Error", "Debe ingresar un RUT válido.");
      return;
    }

    // Validación de fecha de nacimiento
    if (!dob) {
      showAlert("Error", "Debe ingresar una fecha de nacimiento válida.");
      return;
    }

    // Validación final con Temporal para asegurarse de que la fecha sea correcta
    try {
      const dateObj = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
      const dobIso = dateObj.toISOString().slice(0, 10);
      Temporal.PlainDate.from(dobIso);

    } catch (error) {
      showAlert("Error", "La fecha seleccionada no es válida.");
      return;
    }

    // Preparar datos
    const docId = `patient_${Date.now()}`;
    const patientData = {
      name,
      rut,
      dob: dob.toISOString(), // Se guarda en formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
      selectedRelevantConditions, // Arreglo con condiciones crónicas seleccionadas
      selectedPredispositions,    // Arreglo con condiciones predisponentes seleccionadas
      userEmail: user?.email || "Unknown User",
      userName: user?.displayName || "Unknown User",
    };

    console.log(patientData);
    
    // Guardar en Firestore
    try {
      await setDoc(doc(db, "patients", docId), {
        ...patientData,
        createdAt: Timestamp.now(),
        id: docId,
      });
      showAlert("Éxito", "Paciente guardado correctamente.");
      setLoading(false);
      router.push("/");
    } catch (err) {
      showAlert("Error al guardar", err.message);
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView style={styles.container}>
        <View style={styles.headerRow}>
          <BackBtn/>
          <Text style={styles.title}>Nuevo paciente</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nombre completo del paciente</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el nombre completo"
            value={name}
            onChangeText={handleNameChange}
            placeholderTextColor={Colors.neutralGray}
          />

          <Text style={styles.label}>Rut del paciente</Text>
          <TextInput
            style={[styles.input, rutError && { borderColor: "red" }]}
            placeholder="12.345.678-9"
            value={rut}
            onChangeText={handleRutChange}
            placeholderTextColor={Colors.neutralGray}
          />
          {rutError ? <Text style={{ color: "red" }}>{rutError}</Text> : null}

          <Text style={styles.label}>Fecha de nacimiento del paciente</Text>
          <DateField dateValue={dob} onDateChange={setDob} />

          {/* Sección de selección múltiple para las 12 condiciones relevantes */}
          <Text style={styles.label}>
            Condiciones crónicas
          </Text>
          {relevantConditionsList.map((condition) => (
            <View key={condition} style={styles.checkboxContainer}>
              <Checkbox
                style={styles.checkbox}
                value={selectedRelevantConditions.includes(condition)}
                onValueChange={(isChecked) =>
                  handleRelevantConditionToggle(condition, isChecked)
                }
                color={
                  selectedRelevantConditions.includes(condition)
                    ? Colors.primaryBlue
                    : undefined
                }
              />
              <Text style={styles.checkboxLabel}>{condition}</Text>
            </View>
          ))}

          {/* Sección de selección múltiple para condiciones predisponentes */}
          <Text style={[styles.label, { marginTop: 10 }]}>
            Condiciones predisponentes
          </Text>
          {predispositionsList.map((condition) => (
            <View key={condition} style={styles.checkboxContainer}>
              <Checkbox

                style={styles.checkbox}
                value={selectedPredispositions.includes(condition)}
                onValueChange={(isChecked) =>
                  handlePredispositionToggle(condition, isChecked)
                }
                color={
                  selectedPredispositions.includes(condition)
                    ? Colors.primaryBlue
                    : undefined
                }
              />
              <Text style={styles.checkboxLabel}>{condition}</Text>
            </View>
          ))}
          {loading?<ActivityIndicator size="large" color={Colors.primaryBlue} />:
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>}
        </View>
      </ScrollView>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutralWhite,
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 0,
    color: Colors.primaryBlue,
    marginBottom: 5,
  },
  form: {
    marginTop: 10,
    paddingBottom: 50,
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: Colors.secondaryLightBlue,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.neutralDarkGray,
    marginBottom: 5,
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  checkbox: {
    marginRight: 8,
    padding: 5,
  },
  checkboxLabel: {
    fontSize: 16,
    color: Colors.neutralDarkGray,
  },
  saveButton: {
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.neutralWhite,
  },
});
