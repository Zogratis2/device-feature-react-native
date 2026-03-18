import React, { useState } from "react";
import {
  View,
  Image,
  Button,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getCurrentAddress } from "../../utils/location";
import { getEntries, saveEntries } from "../../utils/storage";
import { sendNotification } from "../../utils/notification";
import { Formik } from "formik";
import * as Yup from "yup";
import { styles } from "./AddEntryStyles"; // ✅ added styles

export default function AddEntryScreen({ navigation }: any) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState("");

  const takePicture = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

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
        <Formik
          initialValues={{}}
          validationSchema={Yup.object({})}
          onSubmit={saveEntry}
        >
          {({ handleSubmit }: any) => (
            <View>
              <Button title="Take Picture" onPress={takePicture} />

              {imageUri && (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                />
              )}

              {/* ✅ show address */}
              {address !== "" && (
                <Text style={styles.address}>{address}</Text>
              )}

              {/* ✅ FIXED */}
              <Button
                title="Save Entry"
                onPress={() => handleSubmit()}
              />
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}