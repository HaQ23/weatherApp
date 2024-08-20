<template>
  <div class="city">
    <h5 class="city__title">{{ city.name }}</h5>
    <div class="city__content">
      <div class="city__info-box">
        <p class="city__info">
          <span class="bolder"> Humidity: </span>
          {{ city.weather_data[city.weather_data.length - 1].humidity }}%
        </p>
        <p class="city__info">
          <span class="bolder"> Temperature: </span>
          {{ city.weather_data[city.weather_data.length - 1].temperature }}°C
        </p>
      </div>
      <div class="city__actions">
        <button class="btn btn-primary" @click="viewDetails">
          View details
        </button>
        <button class="btn btn-danger" @click="deleteCity">Delete</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, onUnmounted, Ref } from "vue";
import { CityData } from "@/models/models";
import { useStore } from "vuex";

export default defineComponent({
  name: "FavoriteCity",
  props: {
    city: {
      type: Object as PropType<CityData>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    let intervalId: number | null = null;

    const updateWeather = () => {
      store.dispatch("updateWeatherForCity", {
        cityName: props.city.name,
        cityId: props.city.city_id,
      });
    };
    const deleteCity = async () => {
      try {
        await store.dispatch("deleteCityFromFavorites", props.city.city_id);
      } catch (error) {
        console.error("Error deleting city:", error);
      }
    };
    const viewDetails = () => {
      store.commit("SET_SELECTED_CITY", props.city);
      emit("scroll-to-chart");
    };
    onMounted(() => {
      updateWeather();
      intervalId = setInterval(updateWeather, 60000);
    });

    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });
    return {
      viewDetails,
      deleteCity,
    };
  },
});
</script>

<style scoped lang="scss">
.city {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 8px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  &__title {
    font-weight: bold;
  }
  &__info-box {
    margin-top: 10px;
    .bolder {
      font-size: 1.1rem;
      font-weight: 500;
    }
  }
  &__actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
}
@media (min-width: 768px) {
  .city {
    align-items: flex-start;
    padding: 25px;
    &__title {
      font-size: 1.4rem;
    }
    &__content {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    &__info-box {
      display: flex;
      gap: 10px;
    }
    &__info {
      margin: 0;
    }
    &__actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
  }
}
</style>
