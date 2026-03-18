import * as Notifications from "expo-notifications";

export const sendNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Travel Entry Saved!",
      body: "Your travel entry has been successfully saved.",
    },
    trigger: null,
  });
};