import { StyleSheet } from "react-native";

export const getStyles = (darkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? "#1A1A2E" : "#F4F3FF",
      paddingBottom: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 16,
      backgroundColor: darkMode ? "#16213E" : "#fff",
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      elevation: 4,
    },
    greeting: {
      fontSize: 26,
      fontWeight: "700",
      color: darkMode ? "#fff" : "#2D2D2D",
    },
    subtitle: {
      fontSize: 13,
      color: darkMode ? "#aaa" : "#999",
      marginTop: 2,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      fontSize: 18,
      fontWeight: "600",
      color: darkMode ? "#555" : "#bbb",
      marginTop: 12,
    },
    emptySubText: {
      fontSize: 13,
      color: darkMode ? "#444" : "#ccc",
      marginTop: 4,
    },
  });