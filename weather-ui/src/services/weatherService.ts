import axios from "axios";

const API_KEY = "394bfb25ca81de836704091a67394068";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const getWeather = async (city: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
