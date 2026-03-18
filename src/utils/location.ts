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

    const a = address[0];
    const parts = [
      a.streetNumber,
      a.street,
      a.district,
      a.city,
      a.region,
      a.country,
    ].filter(Boolean);

    return parts.join(", ");
  } catch (e) {
    return "Unknown Location";
  }
};