import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { DatePickerInput } from "react-native-paper-dates";
import Colors from "../constant/Colors";

/**
 * Componente DateField
 * @param {Date | undefined} dateValue - La fecha en un objeto Date (o undefined si no se ha ingresado).
 * @param {(date: Date | undefined) => void} onDateChange - Callback para actualizar la fecha en el padre.
 */
export default function DateField({ dateValue, onDateChange }) {
  // Mantiene un mensaje de error local, para mostrarlo bajo el input
  const [dateError, setDateError] = useState("");

  return (
    <View style={styles.container}>
      <DatePickerInput
        locale="es"               // Idioma: "es", "en", etc.
        label="Selecciona fecha"
        value={dateValue}         // Objeto Date | undefined
        onChange={onDateChange}   // Se llama cuando la fecha cambia
        inputMode="start"
        mode="outlined"           // O "flat", según estilo preferido
        style={styles.datePicker}
        // Callback que se llama si la librería detecta un error de formato
        onValidationError={(error) => {
          // Si 'error' es un string, lo guardamos; si es null/undefined, limpiamos
          setDateError(error ? "Fecha inválida. Verifique." : "");
        }}
      />
      {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  datePicker: {
    backgroundColor: Colors.neutralWhite,
  },
  errorText: {
    marginTop: 5,
    color: "red",
    fontSize: 14,
  },
});
