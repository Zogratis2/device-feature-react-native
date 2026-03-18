import React, { useState, useContext } from "react";
import { View, Text, Image, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";
import type { Entry } from "../types/props";

export default function EntryItem({ item, onDelete }: { item: Entry; onDelete: (id: string) => void }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  return (
    <View style={{
      backgroundColor: darkMode ? "#16213E" : "#fff",
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

        {/* --- NEW: Title and Date Row --- */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          {/* Title */}
          <Text style={{ 
            fontSize: 16, 
            fontWeight: "700", 
            color: darkMode ? "#fff" : "#2D2D2D", 
            flex: 1, // Ensures long titles wrap and don't push the date off-screen
            marginRight: 8 
          }}>
            {item.title}
          </Text>

          {/* Date */}
          {item.date ? (
            <Text style={{ 
              fontSize: 12, 
              color: darkMode ? "#aaa" : "#888", 
              fontWeight: "600",
              marginTop: 2 // A tiny push down so it centers perfectly with the taller title text
            }}>
              {item.date}
            </Text>
          ) : null}
        </View>

        {/* Notes */}
        {item.notes !== "" && (
          <Text style={{ 
            fontSize: 14, 
            color: darkMode ? "#aaa" : "#666", 
            marginBottom: 8 
          }}>
            {item.notes}
          </Text>
        )}

        {/* Location and Delete Row (Bottom) */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          
          {/* Left Side: Location */}
          {item.address ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flex: 1, marginRight: 8 }}>
              <Ionicons name="location-outline" size={16} color="#6C63FF" />
              <Text 
                numberOfLines={2} 
                style={{ fontSize: 13, color: "#6C63FF", fontWeight: "500", flexShrink: 1 }}
              >
                {item.address}
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1 }} /> 
          )}

          {/* Right Side: Just the Delete Button now! */}
          <Pressable
            onPress={() => setModalVisible(true)}
            style={({ pressed }: { pressed: boolean }) => ({
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#E53935",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 12,
              gap: 6,
              opacity: pressed ? 0.8 : 1,
              elevation: 2,
            })}>
            <Ionicons name="trash" size={16} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
              Remove
            </Text>
          </Pressable>

        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
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
              backgroundColor: darkMode ? "#2D1B1B" : "#FFE5E5",
              borderRadius: 50,
              padding: 16,
              marginBottom: 16,
            }}>
              <Ionicons name="trash" size={32} color="#E53935" />
            </View>

            {/* Title */}
            <Text style={{
              fontSize: 18,
              fontWeight: "700",
              color: darkMode ? "#fff" : "#2D2D2D",
              marginBottom: 8,
            }}>
              Remove Entry
            </Text>

            {/* Message */}
            <Text style={{
              fontSize: 14,
              color: darkMode ? "#aaa" : "#888",
              textAlign: "center",
              marginBottom: 24,
            }}>
              Are you sure you want to remove{" "}
              <Text style={{ fontWeight: "700", color: darkMode ? "#fff" : "#2D2D2D" }}>
                "{item.title}"
              </Text>
              ? This action cannot be undone.
            </Text>

            {/* Buttons */}
            <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
              {/* Cancel */}
              <Pressable
                onPress={() => setModalVisible(false)}
                style={({ pressed }: { pressed: boolean }) => ({
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  backgroundColor: pressed 
                    ? (darkMode ? "#2D2D2D" : "#eee") 
                    : (darkMode ? "#1A1A2E" : "#F4F3FF"),
                  elevation: 1,
                })}>
                <Text style={{ fontWeight: "700", color: "#6C63FF", fontSize: 15 }}>
                  Cancel
                </Text>
              </Pressable>

              {/* Confirm Delete */}
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  onDelete(item.id);
                }}
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
    </View>
  );
}