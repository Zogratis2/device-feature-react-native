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
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const styles = getStyles(darkMode);
  const formikRef = useRef<FormikProps<FormValues>>(null);

  useFocusEffect(
    React.useCallback(() => {
      setImageUri(null);
      setAddress("");
      setPhotoError(false);
      formikRef.current?.resetForm();
    }, [])
  );

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
      setPhotoError(false);
      const addr = await getCurrentAddress();
      setAddress(addr);
    }
  };

  const removePhoto = () => {
    setImageUri(null);
    setAddress("");
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

    const newEntry = {
      id: Date.now().toString(),
      image: imageUri,
      address,
      title: values.title,
      notes: values.notes,
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
                    {/* X Button */}
                    <Pressable onPress={removePhoto} style={styles.removeImageButton}>
                      <Ionicons name="close-circle" size={30} color="#E53935" />
                    </Pressable>
                    {/* Address */}
                    {address !== "" && (
                      <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={16} color="#6C63FF" />
                        <Text style={styles.address}>{address}</Text>
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
                    {/* Photo error */}
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

                {/* Take Picture Button */}
                <Pressable style={styles.photoButton} onPress={takePicture}>
                  <Ionicons name="camera-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Take Picture</Text>
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
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}