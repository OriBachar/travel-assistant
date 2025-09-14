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
    groq: {
        apiKey: getEnv('GROQ_API_KEY', true)
    },
    externalApis: {
        openMeteo: getEnv('OPEN_METEO_BASE_URL') || 'https://api.open-meteo.com/v1',
        restCountries: getEnv('REST_COUNTRIES_API_URL') || 'https://restcountries.com/v3.1',
        nominatim: getEnv('NOMINATIM_BASE_URL') || 'https://nominatim.openstreetmap.org',
        timezoneDb: getEnv('TIMEZONE_DB_BASE_URL') || 'https://api.timezonedb.com/v2.1',
        wikipedia: getEnv('WIKIPEDIA_API_URL') || 'https://en.wikipedia.org/api/rest_v1',
        worldTimeApi: getEnv('WORLD_TIME_API_URL') || 'https://worldtimeapi.org/api'
    }
};