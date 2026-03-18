import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const sendNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Travel Entry Saved!",
      body: "Your travel entry has been successfully saved.",
    },
    trigger: null,
  });
};