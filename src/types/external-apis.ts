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

export interface JSONPlaceholderUser {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        };
    };
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    };
}

export interface JSONPlaceholderPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export interface JSONPlaceholderTodo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

export interface DogApiResponse {
    message: string;
    status: string;
}

export interface BoredApiResponse {
    activity: string;
    type: string;
    participants: number;
    price: number;
    link: string;
    key: string;
    accessibility: number;
}

export interface TravelFactsResponse {
    destination: string;
    facts: string[];
    cultural_tips: string[];
    safety_info: {
        general: string;
        health: string;
        transportation: string;
    };
    best_time: string;
    currency: string;
    language: string[];
    visa_requirements: string;
}

export interface DestinationInfoResponse {
    name: string;
    description: string;
    highlights: string[];
    transportation: {
        airport: string;
        public_transport: string[];
        taxi: string;
        car_rental: string;
    };
    accommodation: {
        budget: string[];
        mid_range: string[];
        luxury: string[];
    };
    local_cuisine: string[];
    best_time_to_visit: string;
    currency: string;
    language: string[];
}

export interface LocalAttractionsResponse {
    location: string;
    attractions: Array<{
        name: string;
        type: string;
        description: string;
        rating: number;
        address: string;
        opening_hours: string;
        price_range: string;
    }>;
    events: Array<{
        name: string;
        date: string;
        description: string;
        venue: string;
        price: string;
    }>;
    restaurants: Array<{
        name: string;
        cuisine: string;
        rating: number;
        price_range: string;
        address: string;
        specialties: string[];
    }>;
    shopping: Array<{
        name: string;
        type: string;
        description: string;
        address: string;
        opening_hours: string;
    }>;
}

export interface IPGeolocationResponse {
    status: string;
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
    timezone: string;
    isp: string;
    org: string;
    as: string;
    query: string;
}

export interface UniversitiesResponse {
    name: string;
    country: string;
    alpha_two_code: string;
    domains: string[];
    web_pages: string[];
    'state-province'?: string;
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
