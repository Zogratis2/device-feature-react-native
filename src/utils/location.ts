import * as Location from "expo-location";

export const getCurrentAddress = async (): Promise<string> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    // If permission is denied, just return an empty string to ignore it
    if (status !== "granted") return "";

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });

    const addressArray = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    if (addressArray.length > 0) {
      const a = addressArray[0];
      
      const parts: (string | null)[] = [
        a.name !== a.street ? a.name : null, 
        a.streetNumber,
        a.street,
        a.district,
        a.city || a.subregion,
        a.region,
        a.country,
      ];

      const validParts = parts.filter((part): part is string => Boolean(part));
      const uniqueParts = [...new Set(validParts)];

      return uniqueParts.join(", ");
    }

    // If the array is empty, return an empty string
    return "";
  } catch (e: unknown) {
    // If the GPS completely fails, log it but return an empty string so the app doesn't break
    console.error("Location Error: ", e);
    return "";
  }
};