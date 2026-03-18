import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider } from "./src/context/ThemeContext";
import * as Notifications from "expo-notifications";
import { requestNotificationPermission } from "./src/utils/notification";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}