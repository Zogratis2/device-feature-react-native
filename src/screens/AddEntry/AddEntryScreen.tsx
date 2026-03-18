import React, { useState } from "react";
import {
  View,
  Image,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { getCurrentAddress } from "../../utils/location";
import { getEntries, saveEntries } from "../../utils/storage";
import { sendNotification } from "../../utils/notification";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./AddEntryStyles";

export default function AddEntryScreen({ navigation }: any) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState("");

  const takePicture = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Camera permission denied");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      const addr = await getCurrentAddress();
      setAddress(addr);
    }
  };

  const saveEntry = async () => {
    if (!imageUri) return;

    const entries = await getEntries();

    const newEntry = {
      id: Date.now().toString(),
      image: imageUri,
      address,
    };

    const updated = [...entries, newEntry];
    await saveEntries(updated);

    await sendNotification();

    setImageUri(null);
    navigation.navigate("Home");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>

          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="create-outline" size={28} color="#6C63FF" />
            <Text style={styles.headerTitle}>New Entry</Text>
          </View>

          <Formik
            initialValues={{}}
            validationSchema={Yup.object({})}
            onSubmit={saveEntry}
          >
            {({ handleSubmit }: any) => (
              <View style={styles.formContainer}>

                {/* Image Preview or Placeholder */}
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={64} color="#ccc" />
                    <Text style={styles.imagePlaceholderText}>No photo yet</Text>
                  </View>
                )}

                {/* Address */}
                {address !== "" && (
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={16} color="#6C63FF" />
                    <Text style={styles.address}>{address}</Text>
                  </View>
                )}

                {/* Take Picture Button */}
                <TouchableOpacity style={styles.photoButton} onPress={takePicture}>
                  <Ionicons name="camera-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Take Picture</Text>
                </TouchableOpacity>

                {/* Save Entry Button */}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleSubmit()}
                >
                  <Ionicons name="save-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Save Entry</Text>
                </TouchableOpacity>

              </View>
            )}
          </Formik>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}