import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class City {
    id;
    name;
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class HistoryService {
    filePath = path.join(__dirname, '../../data/searchHistory.json');
    constructor() {
        this.ensureDataFolderExists();
    }
    async ensureDataFolderExists() {
        const folderPath = path.dirname(this.filePath);
        try {
            await fs.access(folderPath);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                // Create the folder if it doesn't exist
                await fs.mkdir(folderPath, { recursive: true });
            }
            else {
                throw error;
            }
        }
    }

    async read() {
        try {
            // Check if the file exists
            await fs.access(this.filePath);
        }
        catch (error) {
            if (error === 'ENOENT') {
                // If the file doesn't exist, create it with an empty array
                await fs.writeFile(this.filePath, '[]', 'utf-8');
                return [];
            }
            throw error;
        }
       
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    async write(cities) {
        await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf-8');
    }

   
    async saveCityToHistory(cityName) {
        const cities = await this.read();
        const cityExists = cities.some((city) => city.name.toLowerCase() === cityName.toLowerCase());
        if (cityExists) {
            return;
        }
        const newCity = new City(Date.now().toString(), cityName);
        cities.push(newCity);
        await this.write(cities);
    }
    async getSearchHistory() {
        return await this.read();
    }
    //delete
    async deleteCityFromHistory(id) {
        try {
            const cities = await this.read();
            const filteredCities = cities.filter((city) => city.id !== id);
            if (filteredCities.length === cities.length) {
                return false; // No city was removed
            }
            await this.write(filteredCities);
            return true; // City was successfully removed
        }
        catch (error) {
            console.error('Error deleting city from search history:', error);
            throw new Error('Failed to delete city from search history');
        }
    }
}
export default new HistoryService();
