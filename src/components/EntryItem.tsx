import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Entry } from "../types/props";

export default function EntryItem({ item, onDelete }: { item: Entry; onDelete: (id: string) => void }) {
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
        style={{ height: 180, width: "100%" }}
      />
      <View style={{ padding: 12 }}>

        {/* Title */}
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#2D2D2D", marginBottom: 4 }}>
          {item.title}
        </Text>

        {/* Notes */}
        {item.notes !== "" && (
          <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
            {item.notes}
          </Text>
        )}

        {/* Location and Delete Row */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="location-outline" size={16} color="#6C63FF" />
            <Text style={{ fontSize: 13, color: "#6C63FF", fontWeight: "500" }}>
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
    </View>
  );
}