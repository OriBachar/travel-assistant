import dotenv from 'dotenv';
import path from 'path';
import { AppError } from '../types/error';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const getEnv = (key: string, required = false): string => {
    const value = process.env[key];
    if (required && !value) {
        throw new AppError(`Environment variable ${key} is required`, 500);
    }
    return value || '';
}

export const config = {
    server: {
        port: getEnv('PORT') || '3000',
        env: getEnv('NODE_ENV') || 'development',
        whitelist: getEnv('CORS_WHITELIST') ? getEnv('CORS_WHITELIST').split(',') : []
    },
    mongodb: {
        uri: getEnv('MONGODB_URI'),
        dbName: getEnv('DB_NAME') || 'travel-assistant'
    },
    gemini: {
        apiKey: getEnv('GEMINI_API_KEY', true)
    },
    externalApis: {
        openMeteo: getEnv('OPEN_METEO_BASE_URL') || 'https://api.open-meteo.com/v1',
        restCountries: getEnv('REST_COUNTRIES_API_URL') || 'https://restcountries.com/v3.1',
        jsonPlaceholder: getEnv('JSON_PLACEHOLDER_URL') || 'https://jsonplaceholder.typicode.com',
        dogApi: getEnv('DOG_API_URL') || 'https://dog.ceo/api',
        boredApi: getEnv('BORED_API_URL') || 'https://www.boredapi.com/api/activity',
        travelFacts: getEnv('TRAVEL_FACTS_URL') || 'https://api.travelfacts.com',
        destinationInfo: getEnv('DESTINATION_INFO_URL') || 'https://api.destinationinfo.com',
        localAttractions: getEnv('LOCAL_ATTRACTIONS_URL') || 'https://api.localattractions.com',
        ipGeolocation: getEnv('IP_GEOLOCATION_URL') || 'http://ip-api.com/json'
    }
};