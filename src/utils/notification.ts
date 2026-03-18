import * as Notifications from "expo-notifications";

export const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Notification permission not granted");
  }
};

export const sendNotification = async () => {
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    await requestNotificationPermission();
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Journal Entry Saved! 📓",
      body: "Your new journal entry has been successfully saved.",
      sound: true,
    },
    trigger: null,
  });
};