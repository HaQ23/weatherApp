import { Module } from "vuex";
import { CityData, WeatherData } from "@/models/models";
import * as cityService from "@/services/cityService";

export interface CitiesState {
  favoriteCities: CityData[];
  selectedCity: CityData | null;
}

export const cities: Module<CitiesState, any> = {
  state: {
    favoriteCities: [],
    selectedCity: null,
  },
  mutations: {
    SET_FAVORITE_CITIES(state, cities: CityData[]) {
      state.favoriteCities = cities;
    },
    ADD_FAVORITE_CITY(state, city: CityData) {
      state.favoriteCities.push(city);
    },
    REMOVE_FAVORITE_CITY(state, cityId: string) {
      state.favoriteCities = state.favoriteCities.filter(
        (city) => city.city_id !== cityId
      );
    },
    UPDATE_CITY_WEATHER(
      state,
      { city_id, weather_data }: { city_id: string; weather_data: WeatherData }
    ) {
      const city = state.favoriteCities.find(
        (city) => city.city_id === city_id
      );
      if (city) {
        city.weather_data.push(weather_data);
      }
    },
    SET_SELECTED_CITY(state, city) {
      state.selectedCity = city;
    },
  },
  actions: {
    async fetchFavoriteCities({ commit }) {
      try {
        const cities = await cityService.getFavoriteCities();
        commit("SET_FAVORITE_CITIES", cities);
      } catch (error) {
        console.error("Error fetching favorite cities:", error);
      }
    },
    async addCityToFavorites({ commit }, city: CityData) {
      try {
        const result = await cityService.addCityToFavorites(city);
        if (typeof result === "string") {
          return result;
        }
        commit("ADD_FAVORITE_CITY", result);
        return "City added successfully!";
      } catch (error) {
        console.error("Error adding city to favorites:", error);
        return "Failed to add city.";
      }
    },
    async deleteCityFromFavorites({ commit }, cityId: string) {
      try {
        await cityService.deleteCityFromFavorites(cityId);
        commit("REMOVE_FAVORITE_CITY", cityId);
      } catch (error) {
        console.error("Error deleting city from favorites:", error);
      }
    },
    async updateWeatherForCity({ commit }, { cityName, cityId }) {
      try {
        const weatherData = await cityService.updateWeatherDataForCity(
          cityName,
          cityId
        );
        commit("UPDATE_CITY_WEATHER", {
          city_id: cityId,
          weather_data: weatherData,
        });
      } catch (error) {
        console.error("Error updating weather data for city:", error);
      }
    },
  },
  getters: {
    favoriteCities(state): CityData[] {
      return state.favoriteCities;
    },
    selectedCity(state): CityData | null {
      return state.selectedCity;
    },
  },
};
