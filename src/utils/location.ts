import * as Location from "expo-location";

export const getCurrentAddress = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") throw new Error("Permission denied");

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });

    const address = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    return `${address[0].city}, ${address[0].country}`;
  } catch (e) {
    return "Unknown Location";
  }
};