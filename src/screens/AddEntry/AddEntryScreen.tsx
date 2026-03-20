import React, { useState, useContext, useRef } from "react";
import {
  View,
  Image,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Pressable,
  Keyboard,
  Text,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { getCurrentAddress } from "../../utils/location";
import { getEntries, saveEntries } from "../../utils/storage";
import { sendNotification } from "../../utils/notification";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { getStyles } from "./AddEntryStyles";
import { useFocusEffect } from "@react-navigation/native";

type FormValues = {
  title: string;
  notes: string;
};

export default function AddEntryScreen({ navigation }: any) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [photoError, setPhotoError] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const styles = getStyles(darkMode);
  const formikRef = useRef<FormikProps<FormValues>>(null);

  useFocusEffect(
    React.useCallback(() => {
      setImageUri(null);
      setAddress("");
      setPhotoError(false);
      setRemoveModalVisible(false);
      formikRef.current?.resetForm();
    }, [])
  );

  const takePicture = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Camera permission denied");
      return;
    }

    const locationPromise = getCurrentAddress();

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setPhotoError(false);
      setAddress("Locating...");
      const addr = await locationPromise;
      setAddress(addr);
    }
  };

  const removePhoto = () => {
    setImageUri(null);
    setAddress("");
    setRemoveModalVisible(false);
  };

  const saveEntry = async (values: FormValues) => {
    if (!imageUri) {
      setPhotoError(true);
      return;
    }

    if (!values.title.trim()) {
      Alert.alert("Please enter a title");
      return;
    }

    const entries = await getEntries();

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newEntry = {
      id: Date.now().toString(),
      image: imageUri,
      address,
      title: values.title,
      notes: values.notes,
      date: formattedDate,
    };

    const updated = [...entries, newEntry];
    await saveEntries(updated);

    await sendNotification();

    setImageUri(null);
    setAddress("");
    setPhotoError(false);
    formikRef.current?.resetForm();
    navigation.navigate("Home");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="create-outline" size={28} color="#6C63FF" />
              <Text style={styles.headerTitle}>New Entry</Text>
            </View>
            <Pressable onPress={() => setDarkMode(!darkMode)}>
              <Ionicons
                name={darkMode ? "sunny-outline" : "moon-outline"}
                size={28}
                color="#6C63FF"
              />
            </Pressable>
          </View>

          <Formik
            innerRef={formikRef}
            initialValues={{ title: "", notes: "" }}
            validationSchema={Yup.object({
              title: Yup.string().required("Title is required"),
              notes: Yup.string(),
            })}
            onSubmit={saveEntry}
          >
            {({ handleChange, handleSubmit, values, errors, touched }: any) => (
              <ScrollView
                contentContainerStyle={styles.formContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Image Preview or Placeholder */}
                {imageUri ? (
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: imageUri }} style={styles.image} />

                    {/* X Button — opens modal */}
                    <Pressable
                      onPress={() => setRemoveModalVisible(true)}
                      style={styles.removeImageButton}
                    >
                      <Ionicons name="close-circle" size={30} color="#E53935" />
                    </Pressable>

                    {/* Address */}
                    {address !== "" && (
                      <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={16} color="#6C63FF" />
                        <TextInput
                          style={styles.addressInput}
                          value={address}
                          onChangeText={setAddress}
                          placeholder="Location..."
                          placeholderTextColor={darkMode ? "#555" : "#bbb"}
                          multiline
                        />
                      </View>
                    )}
                  </View>
                ) : (
                  <View>
                    <View style={[
                      styles.imagePlaceholder,
                      photoError && styles.imagePlaceholderError,
                    ]}>
                      <Ionicons
                        name="image-outline"
                        size={64}
                        color={photoError ? "#E53935" : darkMode ? "#555" : "#ccc"}
                      />
                    </View>
                    {photoError && (
                      <Text style={styles.photoErrorText}>Photo is required</Text>
                    )}
                  </View>
                )}

                {/* Title Input */}
                <View style={[
                  styles.inputContainer,
                  touched.title && errors.title && styles.inputError
                ]}>
                  <Ionicons name="pencil-outline" size={18} color="#6C63FF" />
                  <TextInput
                    style={styles.input}
                    placeholder="Entry title..."
                    placeholderTextColor={darkMode ? "#555" : "#bbb"}
                    value={values.title}
                    onChangeText={handleChange("title")}
                  />
                </View>
                {touched.title && errors.title && (
                  <Text style={styles.errorText}>{errors.title}</Text>
                )}

                {/* Notes Input */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color="#6C63FF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.notesInput]}
                    placeholder="Write your notes..."
                    placeholderTextColor={darkMode ? "#555" : "#bbb"}
                    value={values.notes}
                    onChangeText={handleChange("notes")}
                    multiline
                  />
                </View>

                {/* Take Picture / Retake Photo Button */}
                <Pressable
                  style={imageUri ? styles.retakeButton : styles.photoButton}
                  onPress={takePicture}
                >
                  <Ionicons
                    name={imageUri ? "refresh-outline" : "camera-outline"}
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.buttonText}>
                    {imageUri ? "Retake Photo" : "Take Picture"}
                  </Text>
                </Pressable>

                {/* Save Entry Button */}
                <Pressable
                  style={styles.saveButton}
                  onPress={() => {
                    if (!imageUri) {
                      setPhotoError(true);
                    }
                    handleSubmit();
                  }}
                >
                  <Ionicons name="save-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Save Entry</Text>
                </Pressable>

              </ScrollView>
            )}
          </Formik>

          {/* Remove Photo Confirmation Modal */}
          <Modal
            transparent
            animationType="fade"
            visible={removeModalVisible}
            onRequestClose={() => setRemoveModalVisible(false)}
          >
            <View style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 32,
            }}>
              <View style={{
                backgroundColor: darkMode ? "#16213E" : "#fff",
                borderRadius: 20,
                padding: 24,
                width: "100%",
                alignItems: "center",
                elevation: 10,
              }}>
                {/* Icon */}
                <View style={{
                  backgroundColor: "#FFE5E5",
                  borderRadius: 50,
                  padding: 16,
                  marginBottom: 16,
                }}>
                  <Ionicons name="image" size={32} color="#E53935" />
                </View>

                {/* Title */}
                <Text style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: darkMode ? "#fff" : "#2D2D2D",
                  marginBottom: 8,
                }}>
                  Remove Photo
                </Text>

                {/* Message */}
                <Text style={{
                  fontSize: 14,
                  color: darkMode ? "#aaa" : "#888",
                  textAlign: "center",
                  marginBottom: 24,
                }}>
                  Are you sure you want to remove this photo? This action cannot be undone.
                </Text>

                {/* Buttons */}
                <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
                  {/* Cancel */}
                  <Pressable
                    onPress={() => setRemoveModalVisible(false)}
                    style={({ pressed }: { pressed: boolean }) => ({
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 12,
                      alignItems: "center",
                      backgroundColor: pressed ? "#eee" : "#F4F3FF",
                      elevation: 1,
                    })}>
                    <Text style={{ fontWeight: "700", color: "#6C63FF", fontSize: 15 }}>
                      Cancel
                    </Text>
                  </Pressable>

                  {/* Confirm Remove */}
                  <Pressable
                    onPress={removePhoto}
                    style={({ pressed }: { pressed: boolean }) => ({
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 12,
                      alignItems: "center",
                      backgroundColor: pressed ? "#c62828" : "#E53935",
                      elevation: 2,
                    })}>
                    <Text style={{ fontWeight: "700", color: "#fff", fontSize: 15 }}>
                      Remove
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}