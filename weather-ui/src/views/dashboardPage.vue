<template>
  <NavbarTop />
  <section class="main">
    <div v-if="initialLoad" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-else class="dashboard container-xxl">
      <h1 class="dashboard__title">
        Weather<span class="other-color">App</span>
      </h1>
      <div class="search-bar">
        <input
          class="form-control"
          v-model="city"
          placeholder="Wyszukaj miasto"
          @keyup.enter="fetchWeather"
        />
        <button class="btn btn-primary" @click="fetchWeather">Szukaj</button>
      </div>
      <div class="location-card">
        <div class="location-card__info">
          <span class="location-card__smaller-text">Current Location</span>
          <h2 class="location-card__name">
            {{ weather?.name }}, {{ weather?.country }}
          </h2>
        </div>
        <div class="location-card__box">
          <div class="weather-info">
            <div class="weather-info__shadow"></div>
            <div class="weather-info__temp">
              <img
                :src="weather?.icon"
                alt="Ikona pogody"
                class="weather-info__icon"
              />
              <p class="weather-info__temp-value">
                {{ formatTemperature(weather?.temp) }}
                <span class="smaller-text">°C</span>
              </p>
            </div>
            <div class="weather-info__description">
              <p class="date">{{ formatDate(weather?.date) }}</p>
              <p>{{ weather?.description }}</p>
            </div>
          </div>
          <div class="add-city">
            <button v-if="weather" @click="addToFavorites" class="btn">
              <img src="../assets/plus.svg" alt="" />
              <span> Add to favorities </span>
            </button>
          </div>
        </div>
      </div>

      <div class="highlights">
        <div class="highlight">
          <img src="../assets/humidity.svg" alt="" class="icon" />
          <h4 class="highlight__title">Humidity</h4>
          <p class="highlight__info">{{ weather?.humidity }}%</p>
        </div>
        <div class="highlight">
          <img src="../assets/wind.svg" alt="" class="icon" />
          <h4 class="highlight__title">Wind speed</h4>
          <p class="highlight__info">{{ weather?.windSpeed }} km/h</p>
        </div>
        <div class="highlight">
          <img src="../assets/sunrise.svg" alt="" class="icon" />
          <h4 class="highlight__title">Sunrise</h4>
          <p class="highlight__info">{{ weather?.sunrise }}</p>
        </div>
        <div class="highlight">
          <img src="../assets/sunset.svg" alt="" class="icon" />
          <h4 class="highlight__title">Sunset</h4>
          <p class="highlight__info">{{ weather?.sunset }}</p>
        </div>
      </div>

      <div class="favorites-city">
        <h3 class="favorites-city__title">
          Your favorite <span class="other-color">cities</span>
        </h3>
        <template v-for="(fav, index) in favoriteCities" :key="index">
          <FavoriteCity :city="fav" @scroll-to-chart="scrollToChartSection" />
        </template>
        <p v-if="favoriteCities.length == 0">
          You don't currently have any favorite cities
        </p>
      </div>
    </div>
    <div class="details-panel" v-if="selectedCity" ref="chartSection">
      <WeatherChart :weatherData="selectedCity.weather_data" />
    </div>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
} from "vue";
import { getWeather } from "@/services/weatherService";
import { CityData, WeatherModel } from "@/models/models";
import NavbarTop from "@/components/navbarTop.vue";
import { useStore } from "vuex";
import { RootState } from "@/store";
import FavoriteCity from "@/components/favoriteCity.vue";
import WeatherChart from "@/components/weatherChart.vue";
import { useToast } from "@/services/toastService";

export default defineComponent({
  components: {
    NavbarTop,
    FavoriteCity,
    WeatherChart,
  },
  methods: {
    formatTemperature(value: number | undefined): string {
      return (value ?? 0).toFixed(0);
    },
    formatDate(dateString: string | undefined): string {
      if (!dateString) {
        return "";
      }

      const [datePart, timePart] = dateString.split(", ");
      const [day, month, year] = datePart.split(".");

      const formattedDateString = `${year}-${month}-${day}T${timePart}`;
      const date = new Date(formattedDateString);

      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      const optionsDate: Intl.DateTimeFormatOptions = {
        weekday: "long",
      };

      const optionsTime: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      const formattedDate = date.toLocaleDateString("en-US", optionsDate);
      const formattedTime = date.toLocaleTimeString("en-US", optionsTime);

      return `${formattedDate}, ${formattedTime}`;
    },
    handleViewDetails(city: CityData) {
      console.log("View details for", city.name);
    },
  },
  setup() {
    const store = useStore<RootState>();
    const { showToast } = useToast();
    const city = ref("Warsaw");
    const weather = ref<WeatherModel | null>(null);
    const selectedCity = computed(() => store.state.cities.selectedCity);
    const chartSection = ref<HTMLElement | null>(null);
    const initialLoad = ref(true);
    const fetchWeather = async () => {
      try {
        const weatherData = await getWeather(city.value);
        weather.value = new WeatherModel(weatherData);
      } catch (error) {
        showToast("Please check the city name and try again.", "danger");
      } finally {
        initialLoad.value = false;
      }
    };

    const scrollToChartSection = () => {
      console.log(chartSection);
      if (chartSection.value) {
        chartSection.value.scrollIntoView({ behavior: "smooth" });
      }
    };
    const addToFavorites = async () => {
      if (weather.value) {
        const cityData: CityData = {
          city_id: weather.value.id.toString(),
          name: weather.value.name,
          weather_data: [
            {
              temperature: weather.value.temp,
              humidity: weather.value.humidity,
              timestamp: new Date().toISOString(),
            },
          ],
        };

        const result = await store.dispatch("addCityToFavorites", cityData);

        showToast(
          result,
          result === "City added successfully!" ? "success" : "danger"
        );
      }
    };

    const favoriteCities = computed(
      () => store.getters["favoriteCities"] || []
    );
    watch(selectedCity, async (newCity) => {
      if (newCity) {
        await nextTick();
        scrollToChartSection();
      }
    });

    onMounted(() => {
      fetchWeather();
      store.dispatch("fetchFavoriteCities");
    });
    return {
      city,
      weather,
      favoriteCities,
      fetchWeather,
      addToFavorites,
      selectedCity,
      scrollToChartSection,
      chartSection,
      initialLoad,
    };
  },
});
</script>

<style scoped lang="scss">
.spinner-border {
  position: absolute;
  top: 50%;
}
.dashboard {
  display: flex;
  flex-direction: column;
  margin: 40px auto;
  padding: 20px;

  &__title {
    align-self: self-start;
    margin-bottom: 60px;
    position: relative;
    font-size: 3rem;
    .other-color {
      color: #0d6efd;
    }

    &::before,
    &::after {
      content: "";
      position: absolute;
      height: 4px;
      background-color: #0d6efd;
      width: 100%;
      left: 0;
    }

    &::before {
      bottom: -5px;
      transform: translateY(-100%) rotate(3deg);
    }

    &::after {
      bottom: -15px;
      transform: translateY(-100%) rotate(3deg);
    }
  }
  .search-bar {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
    input {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
  .location-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #ffffff;
    &__box {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-self: stretch;
      gap: 15px;
    }
    &__info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    &__smaller-text {
      color: #888;
    }
  }

  .weather-info {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    flex-grow: 1;
    padding: 20px;
    height: 250px;
    background-image: url(../assets/wallpaperflare.jpg);
    background-size: cover;
    background-position: center center;
    border-radius: 8px;
    color: #fff;
    overflow: hidden;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    &__shadow {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 0;
    }
    &__temp {
      display: flex;
      gap: 10px;
      z-index: 1;
    }
    &__icon {
      width: 100px;
      transform: translate(-20px, -20px);
    }
    &__temp-value {
      display: flex;
      align-items: flex-start;
      transform: translateX(-30px);
      font-size: 3rem;
      font-weight: bold;
      line-height: 1;
      .smaller-text {
        font-size: 1rem;
      }
    }
    &__description {
      z-index: 1;
      .date {
        font-weight: bold;
      }
      p {
        margin: 0;
        text-align: right;
      }
    }
  }
  .add-city {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    background-color: #f0f0f0;
    border-radius: 8px;
    box-shadow: 0 0 0 2px transparent;
    transition: box-shadow 0.2s ease;
    &:focus-within {
      box-shadow: 0 0 0 2px #007bff;
    }
    .btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      outline: none;
      border: none;
      box-shadow: none;
      font-weight: 500;
      &:focus,
      &:active {
        outline: none !important;
        border: none !important;
      }
    }
  }
  .highlights {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 30px;
    .highlight {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      &__title {
        margin: 0;
        font-size: 1rem;
        color: #000;
        font-weight: 500;
      }
      &__info {
        font-weight: bold;
        font-size: 1.2rem;
        margin: 0;
      }
    }
  }
  .favorites-city {
    display: flex;
    flex-direction: column;
    margin-top: 60px;
    gap: 20px;
    &__title {
      margin-bottom: 20px;
      font-weight: bold;
      font-size: 2.2rem;
      .other-color {
        color: #0d6efd;
      }
    }
  }
}
@media (min-width: 768px) {
  .dashboard {
    .location-card {
      &__box {
        display: flex;
        flex-direction: row;
      }
    }
    .weather-info {
      height: 350px;
    }
    .highlights {
      flex-direction: row;
      gap: 20px;
      .highlight {
        flex-grow: 1;
      }
    }
  }
}
@media (min-width: 1400px) {
  .dashboard {
    .location-card {
      &__box {
        gap: 20px;
      }
    }
    padding: 20px 0;
    .highlights {
      margin-top: 50px;
      gap: 40px;
    }
  }
}
</style>
