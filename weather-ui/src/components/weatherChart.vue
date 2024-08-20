<template>
  <div class="charts-container">
    <div class="chart-controls">
      <label for="timeFormat">Select Time Interval: </label>
      <select
        class="form-select"
        id="timeFormat"
        v-model="selectedTimeInterval"
      >
        <option value="daily">Daily</option>
        <option value="hourly">Hourly</option>
        <option value="minutely">Minutely</option>
      </select>
    </div>
    <p
      v-if="
        selectedTimeInterval === 'hourly' || selectedTimeInterval === 'minutely'
      "
    >
      {{ todayFormatted }}
    </p>
    <div class="charts-box">
      <LineChart :chart-data="temperatureChartData" :options="chartOptions" />
      <LineChart :chart-data="humidityChartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from "vue";
import { LineChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default defineComponent({
  name: "WeatherChart",
  components: {
    LineChart,
  },
  props: {
    weatherData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const selectedTimeInterval = ref("hourly");
    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];

    const todayFormatted = computed(() =>
      today.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
    );

    const formatTimeLabel = (date, interval) => {
      switch (interval) {
        case "daily":
          return date.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "numeric",
          });
        case "hourly":
          return date.toLocaleTimeString("en-US", { hour: "2-digit" }) + ":00";
        case "minutely":
          return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
        default:
          return date.toLocaleTimeString("en-US");
      }
    };

    const aggregateData = (interval) => {
      const aggregated = {};

      props.weatherData.forEach((data) => {
        const date = new Date(data.timestamp);
        const dateKey = date.toISOString().split("T")[0];

        let key;
        switch (interval) {
          case "daily":
            key = dateKey; // YYYY-MM-DD
            break;
          case "hourly":
            if (dateKey !== todayISO) return;
            key = `${dateKey} ${String(date.getHours()).padStart(
              2,
              "0"
            )}:00:00`; // YYYY-MM-DD HH:00:00
            break;
          case "minutely":
            if (dateKey !== todayISO) return;
            key = `${dateKey} ${String(date.getHours()).padStart(
              2,
              "0"
            )}:${String(date.getMinutes()).padStart(2, "0")}:00`; // YYYY-MM-DD HH:MM:00
            break;
          default:
            key = date.toISOString();
        }

        if (!aggregated[key]) {
          aggregated[key] = { temperature: [], humidity: [] };
        }

        aggregated[key].temperature.push(data.temperature);
        aggregated[key].humidity.push(data.humidity);
      });

      const labels = Object.keys(aggregated).map((key) => {
        const date = new Date(key.replace(" ", "T"));
        return formatTimeLabel(date, interval);
      });

      const temperatures = labels.map((_, index) => {
        const temps = aggregated[Object.keys(aggregated)[index]].temperature;
        return temps.reduce((sum, t) => sum + t, 0) / temps.length;
      });

      const humidities = labels.map((_, index) => {
        const hums = aggregated[Object.keys(aggregated)[index]].humidity;
        return hums.reduce((sum, h) => sum + h, 0) / hums.length;
      });

      return { labels, temperatures, humidities };
    };

    const temperatureChartData = computed(() => {
      const { labels, temperatures } = aggregateData(
        selectedTimeInterval.value
      );
      return {
        labels,
        datasets: [
          {
            label: "Temperature (°C)",
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            data: temperatures,
            tension: 0.4,
          },
        ],
      };
    });

    const humidityChartData = computed(() => {
      const { labels, humidities } = aggregateData(selectedTimeInterval.value);
      return {
        labels,
        datasets: [
          {
            label: "Humidity (%)",
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            data: humidities,
            tension: 0.4,
          },
        ],
      };
    });

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            color: "#ffffff",
          },
          grid: {
            color: "#444444",
          },
        },
        y: {
          ticks: {
            color: "#ffffff",
          },
          grid: {
            color: "#444444",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#ffffff",
          },
        },
        tooltip: {
          backgroundColor: "#333",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
        },
      },
    };

    return {
      selectedTimeInterval,
      todayFormatted,
      temperatureChartData,
      humidityChartData,
      chartOptions,
    };
  },
});
</script>

<style scoped lang="scss">
.charts-container {
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #110e3d;
  color: #fff;
}
.charts-box {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.chart-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;

  select {
    max-width: 250px;
  }
}
</style>
