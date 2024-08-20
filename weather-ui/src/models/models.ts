export class WeatherModel {
  id: string;
  name: string;
  country: string;
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
  date: string;

  constructor(weatherData: any) {
    this.id = weatherData.id;
    this.name = weatherData.name;
    this.country = weatherData.sys.country;
    this.temp = weatherData.main.temp;
    this.description = weatherData.weather[0].description;
    this.icon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`;
    this.humidity = weatherData.main.humidity;
    this.windSpeed = weatherData.wind.speed;
    this.sunrise = new Date(
      weatherData.sys.sunrise * 1000
    ).toLocaleTimeString();
    this.sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
    this.date = new Date().toLocaleString();
  }
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  timestamp: string;
}

export interface CityData {
  city_id: string;
  name: string;
  weather_data: WeatherData[];
}
