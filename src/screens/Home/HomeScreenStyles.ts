import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F3FF",
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2D2D2D",
  },
  subtitle: {
    fontSize: 13,
    color: "#999",
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
    color: "#bbb",
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 13,
    color: "#ccc",
    marginTop: 4,
  },
});