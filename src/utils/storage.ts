import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Entry } from "../types/props";

const KEY = "TRAVEL_ENTRIES";

export const saveEntries = async (entries: Entry[]) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(entries));
};

export const getEntries = async (): Promise<Entry[]> => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};