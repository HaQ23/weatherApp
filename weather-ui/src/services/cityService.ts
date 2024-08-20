import axios from "axios";
import { CityData, WeatherData } from "@/models/models";
import store from "@/store";
import { getWeather } from "./weatherService";
const BASE_URL = "http://127.0.0.1:8000";

export const getFavoriteCities = async (): Promise<CityData[]> => {
  try {
    const email = store.state.auth.email;

    if (!email) {
      throw new Error("User is not authenticated.");
    }

    const response = await axios.get(`${BASE_URL}/cities/${email}/`);
    return response.data.cities;
  } catch (error) {
    console.error("Error fetching favorite cities:", error);
    throw error;
  }
};

export const addCityToFavorites = async (
  city: CityData
): Promise<CityData | string> => {
  try {
    const email = store.state.auth.email;

    if (!email) {
      return "User is not authenticated.";
    }

    const weather_data = city.weather_data.map((data) => ({
      temperature: data.temperature,
      humidity: data.humidity,
      timestamp: new Date(data.timestamp).toISOString(),
    }));

    const response = await axios.post(`${BASE_URL}/add_city/`, {
      email: email,
      city_id: city.city_id,
      name: city.name,
      weather_data: weather_data,
    });

    if (typeof response.data === "string") {
      return response.data;
    }

    return {
      city_id: response.data.city_id,
      name: response.data.name,
      weather_data: response.data.weather_data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error adding city to favorites:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      return error.message;
    } else {
      console.error("Error adding city to favorites:", error);
      return "An unexpected error occurred.";
    }
  }
};

export const deleteCityFromFavorites = async (
  cityId: string
): Promise<void> => {
  try {
    const email = store.state.auth.email;

    if (!email) {
      throw new Error("User is not authenticated.");
    }

    await axios.delete(`${BASE_URL}/remove_city/`, {
      data: { email: email, city_id: cityId },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting city from favorites:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error("Error deleting city from favorites:", error);
    }
    throw error;
  }
};
export const updateWeatherDataForCity = async (
  cityName: string,
  cityId: string
): Promise<WeatherData> => {
  try {
    const email = store.state.auth.email;

    if (!email) {
      throw new Error("User is not authenticated.");
    }
    const weatherResponse = await getWeather(cityName);
    const weatherData: WeatherData = {
      temperature: weatherResponse.main.temp,
      humidity: weatherResponse.main.humidity,
      timestamp: new Date().toISOString(),
    };

    const response = await axios.post(`${BASE_URL}/city/weather/`, {
      email: email,
      city_id: cityId,
      temperature: weatherData.temperature,
      humidity: weatherData.humidity,
      timestamp: weatherData.timestamp,
    });

    if (response.data.message !== "Weather data added successfully") {
      throw new Error(`Unexpected server response: ${response.data.message}`);
    }

    return weatherData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating weather data for city:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error("Error updating weather data for city:", error);
    }
    throw error;
  }
};
