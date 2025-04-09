import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
interface Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

class WeatherService {
  private API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
  private API_KEY = process.env.API_KEY || 'YOUR_API_KEY';

  // Fetch weather data for a city
  async getWeatherByCity(cityName: string): Promise<{ current: Weather; future: any[] }> {
    try {
      const weatherUrl = `${this.API_BASE_URL}/forecast?q=${cityName}&appid=${this.API_KEY}&units=metric`;

      const response = await fetch(weatherUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();

      const currentWeather: Weather = this.parseCurrentWeather(data);
      const futureWeather = this.buildForecastArray(data);

      return { current: currentWeather, future: futureWeather };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Unable to retrieve weather data');
    }
  }

  // Fetch weather data using coordinates
  async getWeatherByCoordinates(coordinates: Coordinates): Promise<{ current: Weather; future: any[] }> {
    try {
      const weatherUrl = `${this.API_BASE_URL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.API_KEY}&units=metric`;

      const response = await fetch(weatherUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();

      const currentWeather: Weather = this.parseCurrentWeather(data);
      const futureWeather = this.buildForecastArray(data);

      return { current: currentWeather, future: futureWeather };
    } catch (error) {
      console.error('Error fetching weather data by coordinates:', error);
      throw new Error('Unable to retrieve weather data by coordinates');
    }
  }

  // Parse current weather data
  private parseCurrentWeather(data: any): Weather {
    const current = data.list[0];
    return {
      temperature: current.main.temp,
      humidity: current.main.humidity,
      windSpeed: current.wind.speed,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
    };
  }

  // Build the 5-day forecast array
  private buildForecastArray(data: any): any[] {
    const forecast = data.list.filter((entry: any) => entry.dt_txt.includes('12:00:00'));
    return forecast.map((entry: any) => ({
      date: entry.dt_txt.split(' ')[0],
      temperature: entry.main.temp,
      humidity: entry.main.humidity,
      windSpeed: entry.wind.speed,
      description: entry.weather[0].description,
      icon: entry.weather[0].icon,
    }));
  }
}

const weatherService = new WeatherService();

const coordinates: Coordinates = { lat: 40.7128, lon: -74.0060 }; // Example for New York City
const weatherData = await weatherService.getWeatherByCoordinates(coordinates);

console.log(weatherData.current); // Current weather
console.log(weatherData.future);  // 5-day forecast

export default weatherService;