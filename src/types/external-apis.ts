export interface OpenMeteoResponse {
    current_weather: {
        temperature: number;
        windspeed: number;
        winddirection: number;
        weathercode: number;
        time: string;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        precipitation: number[];
        weathercode: number[];
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_sum: number[];
        weathercode: number[];
    };
}

export interface RestCountriesResponse {
    name: {
        common: string;
        official: string;
        nativeName?: Record<string, { official: string; common: string }>;
    };
    capital: string[];
    population: number;
    languages: Record<string, string>;
    currencies: Record<string, { name: string; symbol: string }>;
    region: string;
    subregion: string;
    timezones: string[];
    flags: {
        png: string;
        svg: string;
        alt?: string;
    };
    cca2: string;
    cca3: string;
    ccn3: string;
    independent: boolean;
    status: string;
    unMember: boolean;
    landlocked: boolean;
    area: number;
    demonyms: Record<string, { f: string; m: string }>;
    maps: {
        googleMaps: string;
        openStreetMaps: string;
    };
    borders: string[];
    continents: string[];
}


export interface ApiError {
    source: string;
    error: string;
    statusCode?: number;
    timestamp: Date;
    retryable: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
    timestamp: Date;
    source: string;
}

export interface WeatherData {
    temperature: number;
    condition: string;
    humidity: number;
    location: string;
    date: string;
}

export interface CountryData {
    name: string;
    capital: string;
    population: number;
    currency: string;
    languages: string[];
    region: string;
}

export interface ExternalDataPoint {
    source: string;
    data: any;
    relevanceScore: number;
    timestamp: Date;
}

export interface Coordinates {
    lat: number;
    lon: number;
    timezone: string;
}
