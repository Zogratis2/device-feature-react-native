import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type EntryItemProps = {
  item: {
    id: string;
    image: string;
    address: string;
  };
  onDelete: (id: string) => void;
};

export default function EntryItem({ item, onDelete }: EntryItemProps) {
  return (
    <View style={{
      backgroundColor: "#fff",
      borderRadius: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      overflow: "hidden",
      elevation: 4,
    }}>
      <Image
        source={{ uri: item.image }}
        style={{ height: 200, width: "100%" }}
      />
      <View style={{
        padding: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="location-outline" size={16} color="#6C63FF" />
          <Text style={{ fontSize: 14, color: "#333", fontWeight: "500" }}>
            {item.address}
          </Text>
        </View>
        <Pressable
          onPress={() => onDelete(item.id)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FFE5E5",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 10,
            gap: 4,
          }}>
          <Ionicons name="trash-outline" size={16} color="#E53935" />
          <Text style={{ color: "#E53935", fontWeight: "600", fontSize: 13 }}>
            Remove
          </Text>
        </Pressable>
      </View>
    </View>
  );
}