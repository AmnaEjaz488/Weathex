import fs from 'fs/promises';
import path from 'path';

class City {
  constructor(public id: string, public name: string) {}
}

class HistoryService {
  private filePath = path.join(__dirname, '../../data/searchHistory.json');

  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error) {
      if (error === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf-8');
  }

  async saveCityToHistory(cityName: string): Promise<void> {
    const cities = await this.read();
    const cityExists = cities.some((city) => city.name.toLowerCase() === cityName.toLowerCase());
    if (cityExists) {
      return;
    }
    const newCity = new City(Date.now().toString(), cityName);
    cities.push(newCity);
    await this.write(cities);
  }

  async getSearchHistory(): Promise<City[]> {
    return await this.read();
  }
  async deleteCityFromHistory(id: string): Promise<boolean> {
    try {
      // Read the current search history
      const cities = await this.read();
  
      // Filter out the city with the specified ID
      const filteredCities = cities.filter((city) => city.id !== id);
  
      // Check if the city was found and removed
      if (filteredCities.length === cities.length) {
        return false; // No city was removed
      }
  
      // Write the updated history back to the file
      await this.write(filteredCities);
  
      return true; // City was successfully removed
    } catch (error) {
      console.error('Error deleting city from search history:', error);
      throw new Error('Failed to delete city from search history');
    }
  }
}

export default new HistoryService();