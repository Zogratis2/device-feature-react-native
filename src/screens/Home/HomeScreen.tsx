import React, { useState, useCallback, useContext } from "react";
import { View, Text, FlatList, RefreshControl, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEntries, saveEntries } from "../../utils/storage";
import EntryItem from "../../components/EntryItem";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { getStyles } from "./HomeScreenStyles";
import type { Entry } from "../../types/props";

export default function HomeScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const styles = getStyles(darkMode);

  const loadEntries = async () => {
    const data = await getEntries();
    setEntries(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const removeItem = async (id: string) => {
    const filtered = entries.filter((item: Entry) => item.id !== id);
    setEntries(filtered);
    await saveEntries(filtered);
  };

  if (!entries.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>My Journal</Text>
            <Text style={styles.subtitle}>Your personal diary</Text>
          </View>
          <Pressable onPress={() => setDarkMode(!darkMode)}>
            <Ionicons
              name={darkMode ? "sunny-outline" : "moon-outline"}
              size={28}
              color="#6C63FF"
            />
          </Pressable>
        </View>

        {/* Entry Count */}
        <Text style={styles.entryCount}>{entries.length} Entries</Text>

        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No Entries yet</Text>
          <Text style={styles.emptySubText}>Tap AddEntry to write your first one!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>My Journal</Text>
          <Text style={styles.subtitle}>Your personal diary</Text>
        </View>
        <Pressable onPress={() => setDarkMode(!darkMode)}>
          <Ionicons
            name={darkMode ? "sunny-outline" : "moon-outline"}
            size={28}
            color="#6C63FF"
          />
        </Pressable>
      </View>

      {/* Entry Count */}
      <Text style={styles.entryCount}>{entries.length} Entries</Text>

      <FlatList<Entry>
        data={entries}
        keyExtractor={(item: Entry) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadEntries} />
        }
        renderItem={({ item }: { item: Entry }) => (
          <EntryItem item={item} onDelete={removeItem} />
        )}
      />
    </SafeAreaView>
  );
}