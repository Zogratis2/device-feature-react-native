import * as Location from "expo-location";

export const getCurrentAddress = async (): Promise<string> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") throw new Error("Permission denied");

    // Force high accuracy and don't accept cached locations older than 5 seconds
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const addressArray = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    if (addressArray.length > 0) {
      const a = addressArray[0];
      
      // Sometimes 'name' holds the specific building, 'district' holds the barangay,
      // and 'subregion' holds the city/municipality if 'city' is null.
      const parts: (string | null)[] = [
        a.name,
        a.streetNumber,
        a.street,
        a.district,
        a.city || a.subregion, 
        a.region,
        a.country,
      ];

      // Filter out null/undefined and tell TS that the resulting array only contains strings
      const validParts = parts.filter((part): part is string => Boolean(part));

      // Remove duplicate strings (e.g., if 'name' and 'street' are identical)
      const uniqueParts = [...new Set(validParts)];

      return uniqueParts.join(", ");
    }

    return "Unknown Location";
  } catch (e: unknown) {
    console.error("Location Error: ", e);
    return "Unknown Location";
  }
};