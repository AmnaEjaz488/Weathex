import { Router } from 'express';
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { cityName } = req.body;

    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const weatherData = await WeatherService.getWeatherByCity(cityName);

    if (!weatherData) {
      return res.status(404).json({ error: 'Weather data not found' });
    }

    await HistoryService.saveCityToHistory(cityName);

    res.status(200).json({
      message: 'Weather data retrieved successfully',
      currentWeather: weatherData.current,
      futureWeather: weatherData.future,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

export default router;