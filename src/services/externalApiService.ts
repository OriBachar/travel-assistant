import { config } from '../config/env';
import { groqService } from './groqService';
import { getLocationExtractionPrompt } from '../prompts';
import {
    WeatherData,
    CountryData,
    ExternalDataPoint,
    Coordinates,
} from '../types/external-apis';

export class ExternalApiService {

    /**
     * Get weather data for a destination
     */
    async getWeatherData(location: string): Promise<WeatherData | null> {
        try {
            const cityCoordinates = await this.getCityCoordinates(location);

            if (!cityCoordinates) {
                console.log(`No coordinates found for ${location}, skipping weather data`);
                return null;
            }

            const response = await fetch(
                `${config.externalApis.openMeteo}/forecast?latitude=${cityCoordinates.lat}&longitude=${cityCoordinates.lon}&current_weather=true&timezone=${cityCoordinates.timezone}`
            );

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();

            return {
                temperature: data.current_weather.temperature,
                condition: data.current_weather.weathercode,
                humidity: 0,
                location: location,
                date: new Date().toISOString()
            };
        } catch (error) {
            console.error('Weather API Error:', error);
            return null;
        }
    }

    /**
     * Get coordinates for a location using free Nominatim geocoding API
     */
    private async getCityCoordinates(location: string): Promise<Coordinates | null> {
        try {
            const encodedLocation = encodeURIComponent(location);
            const response = await fetch(
                `${config.externalApis.nominatim}/search?q=${encodedLocation}&format=json&limit=1&addressdetails=1`
            );

            if (!response.ok) {
                throw new Error(`Geocoding API error: ${response.status}`);
            }

            const data = await response.json();

            if (!data || data.length === 0) {
                console.log(`No coordinates found for ${location}`);
                return null;
            }

            const result = data[0];
            const lat = parseFloat(result.lat);
            const lon = parseFloat(result.lon);

            const timezone = await this.getTimezoneFromCoordinates(lat, lon);

            return {
                lat,
                lon,
                timezone: timezone || 'UTC'
            };

        } catch (error) {
            console.error('Error getting coordinates:', error);
            return null;
        }
    }

    /**
     * Get timezone from coordinates using free API
     */
    private async getTimezoneFromCoordinates(lat: number, lon: number): Promise<string | null> {
        try {
            const response = await fetch(
                `${config.externalApis.timezoneDb}/get-time-zone?key=demo&format=json&by=position&lat=${lat}&lng=${lon}`
            );

            if (!response.ok) {
                return 'UTC';
            }

            const data = await response.json();
            return data.zoneName || 'UTC';

        } catch (error) {
            console.error('Error getting timezone:', error);
            return 'UTC';
        }
    }

    /**
     * Get country information
     */
    async getCountryData(countryName: string): Promise<CountryData | null> {
        try {
            const response = await fetch(`${config.externalApis.restCountries}/name/${countryName}`);

            if (!response.ok) {
                throw new Error(`Country API error: ${response.status}`);
            }

            const data = await response.json();
            const country = data[0];

            return {
                name: country.name.common,
                capital: country.capital[0],
                population: country.population,
                currency: Object.keys(country.currencies)[0],
                languages: Object.values(country.languages),
                region: country.region
            };
        } catch (error) {
            console.error('Country API Error:', error);
            return null;
        }
    }

    /**
     * Get city/destination information using Wikipedia/MediaWiki API
     */
    async getCityInformation(cityName: string): Promise<string | null> {
        try {
            const response = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`
            );

            if (!response.ok) {
                throw new Error(`Wikipedia API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.extract) {
                return data.extract;
            }

            return null;

        } catch (error) {
            console.error('Wikipedia API Error:', error);
            return null;
        }
    }

    /**
     * Get timezone information using WorldTimeAPI
     */
    async getTimezoneInfo(timezone: string): Promise<any | null> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(
                `https://worldtimeapi.org/api/timezone/${encodeURIComponent(timezone)}`,
                {
                    signal: controller.signal,
                    headers: {
                        'User-Agent': 'TravelAssistant/1.0'
                    }
                }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`WorldTimeAPI error: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('WorldTimeAPI Error:', error);
            return {
                timezone: timezone,
                utc_offset: '+00:00',
                datetime: new Date().toISOString(),
                note: 'Fallback timezone info due to API error'
            };
        }
    }


    /**
     * Determine which external data to fetch based on user query
     */
    async getRelevantExternalData(userQuery: string, userId?: string, conversationHistory?: any[]): Promise<ExternalDataPoint[]> {
        const externalData: ExternalDataPoint[] = [];
        const lowerQuery = userQuery.toLowerCase();

        const { location, country } = await this.extractLocationAndCountry(userQuery, conversationHistory);

        if (location) {
            const coordinates = await this.getCityCoordinates(location);
            if (coordinates) {
                externalData.push({
                    source: 'Nominatim + TimeZoneDB',
                    data: coordinates,
                    relevanceScore: 0.7,
                    timestamp: new Date()
                });
            }
        }

        if (lowerQuery.includes('weather') || lowerQuery.includes('climate') || lowerQuery.includes('temperature') || lowerQuery.includes('forecast')) {
            if (location) {
                const weatherData = await this.getWeatherData(location);
                if (weatherData) {
                    externalData.push({
                        source: 'Open-Meteo Weather API',
                        data: weatherData,
                        relevanceScore: 0.9,
                        timestamp: new Date()
                    });
                } else {
                    console.log(`No weather data received for: ${location}`);
                }
            }

        }

        if (country) {
            const countryData = await this.getCountryData(country);
            if (countryData) {
                externalData.push({
                    source: 'RestCountries API',
                    data: countryData,
                    relevanceScore: 0.8,
                    timestamp: new Date()
                });
            } else {
                console.log(`No country data received for: ${country}`);
            }
        }

        if (location && (lowerQuery.includes('about') || lowerQuery.includes('information') || lowerQuery.includes('culture') || lowerQuery.includes('history') || lowerQuery.includes('attractions'))) {
            const cityInfo = await this.getCityInformation(location);
            if (cityInfo) {
                externalData.push({
                    source: 'Wikipedia API',
                    data: { summary: cityInfo },
                    relevanceScore: 0.8,
                    timestamp: new Date()
                });
            }
        }
        return externalData;
    }

    /**
     * Extract location and country from user query using Groq
     */
    private async extractLocationAndCountry(query: string, conversationHistory?: any[]): Promise<{ location: string | null; country: string | null }> {
        try {
            let extractionPrompt = getLocationExtractionPrompt(query);

            if (conversationHistory && conversationHistory.length > 0) {
                const contextInfo = conversationHistory
                    .filter(msg => msg.role === 'user')
                    .slice(-3)
                    .map(msg => msg.content)
                    .join(' | ');

                extractionPrompt += `\n\nConversation Context: ${contextInfo}`;
            }

            const response = await groqService.generateResponse(extractionPrompt);

            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                return {
                    location: result.location && result.location !== 'null' ? result.location : null,
                    country: result.country && result.country !== 'null' ? result.country : null
                };
            }

            return { location: null, country: null };

        } catch (error) {
            console.error('Location/Country extraction error:', error);
            return { location: null, country: null };
        }
    }
}

export const externalApiService = new ExternalApiService();
