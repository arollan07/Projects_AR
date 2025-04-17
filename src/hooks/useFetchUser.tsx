import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import axios from "axios";

// Fetch user data from Firestore and augment it with weather information
const fetchUserWithWeather = async (uid: string | undefined): Promise<{
  email: string;
  createdAt: string;
  username?: string;
  bio?: string;
  photoURL?: string;
  weather?: string;
  weatherIcon?: string;
} | null> => {
  if (!uid) return null; // Return null if no user ID is provided

  const docRef = doc(db, "users", uid); // Reference to the user's document
  const docSnap = await getDoc(docRef); // Fetch the document

  if (!docSnap.exists()) return null; // Return null if the document doesn't exist

  const userData = docSnap.data() as {
    email: string;
    createdAt: string;
    username?: string;
    bio?: string;
    photoURL?: string;
    weather?: string;
    weatherIcon?: string;
  };

  try {
    // Get user's geolocation
    const coords = await new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        (err) => reject(err),
        { timeout: 10000 }
      );
    });

    // Fetch weather data using the coordinates
    const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
      params: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        current_weather: true,
      },
    });

    const { temperature, weathercode } = weatherRes.data.current_weather;
    const fahrenheit = Math.round((temperature * 9) / 5 + 32); // Convert temperature to Fahrenheit

    // Map weather codes to icons
    const iconMap: Record<number, string> = {
      0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
      45: "🌫️", 48: "🌫️", 51: "🌦️", 61: "🌧️",
      71: "❄️", 95: "⛈️",
    };

    userData.weather = `${fahrenheit}°F`; // Add weather info to user data
    userData.weatherIcon = iconMap[weathercode] || "🌈"; // Add weather icon
  } catch {
    userData.weather = undefined; // Handle errors gracefully
    userData.weatherIcon = undefined;
  }

  return userData;
};

// Custom hook to fetch user data with caching
export default function useFetchUser(uid: string | undefined) {
  return useQuery({
    queryKey: ["user", uid], // Unique query key
    queryFn: () => fetchUserWithWeather(uid), // Fetch function
    enabled: !!uid, // Only run if UID is provided
  });
}
