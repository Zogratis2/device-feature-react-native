import React, { useState, useCallback } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEntries, saveEntries } from "../../utils/storage";
import EntryItem from "../../components/EntryItem";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./HomeScreenStyles";

type Entry = {
  id: string;
  image: string;
  address: string;
};

export default function HomeScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
          <Ionicons name="journal" size={36} color="#6C63FF" />
        </View>
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
        <Ionicons name="journal" size={36} color="#6C63FF" />
      </View>
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