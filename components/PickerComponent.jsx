import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Colors from "../constant/Colors";

export default function PickerComponent({ selectedValue, setSelectedValue, options, label }) {
  const [modalVisible, setModalVisible] = useState(false);

  return Platform.OS === "web" ? (
    <Picker
      selectedValue={selectedValue}
      onValueChange={(itemValue) => setSelectedValue(itemValue)}
      style={styles.picker}
    >
      <Picker.Item label={`Seleccione ${label}`} value="" />
      {options.map((option, index) => (
        <Picker.Item key={index} label={option} value={option} />
      ))}
    </Picker>
  ) : (
    <>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.pickerText}>
          {selectedValue || ` ${label}`}
        </Text>
      </TouchableOpacity>

      {modalVisible && (
        <Modal
          transparent
          animationType="slide"
          visible={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={options}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setSelectedValue(item);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
}

const styles = {
  pickerButton: {
    borderWidth: 1,
    borderColor: Colors.borderGray,
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.neutralWhite,
    justifyContent: "center",
    marginBottom: 15,
    marginHorizontal: 5,
        flex: 1,
    width: '100%'
  },
  pickerText: {
    fontSize: 16,
    color: Colors.neutralDarkGray,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: Colors.neutralWhite,
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.primaryBlue,
  },
};
