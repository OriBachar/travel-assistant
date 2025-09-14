import { ConversationContext } from './conversation';
import { TravelQueryType, UserPreferences, ExternalDataPoint } from './shared';

export interface WeatherData {
    source: string;
    location: string;
    currentTemperature: number;
    weatherCode: number;
    precipitation: number;
    timestamp: Date;
    relevanceScore: number;
}

export interface CountryData {
    source: string;
    countryName: string;
    capital: string;
    population: number;
    languages: string[];
    currencies: string[];
    region: string;
    subregion: string;
    timezones: string[];
    flags: any;
    timestamp: Date;
    relevanceScore: number;
}

export interface TravelFactsData {
    source: string;
    destination: string;
    facts: string[];
    culturalTips: string[];
    safetyInfo: any;
    bestTimeToVisit: string;
    timestamp: Date;
    relevanceScore: number;
}

export interface LocalAttractionsData {
    source: string;
    location: string;
    attractions: any[];
    events: any[];
    restaurants: any[];
    shopping: any[];
    timestamp: Date;
    relevanceScore: number;
}

export interface ActivityData {
    source: string;
    activity: string;
    type: string;
    participants: number;
    price: number;
    accessibility: number;
    travelRelevance: number;
    timestamp: Date;
    relevanceScore: number;
}

export interface PetCompanionData {
    source: string;
    breed: string;
    imageUrl: string;
    travelCompatibility: 'high' | 'medium' | 'low';
    timestamp: Date;
    relevanceScore: number;
}

export interface GeolocationData {
    source: string;
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
    timezone: string;
    timestamp: Date;
    relevanceScore: number;
}

export interface UserPreferencesData {
    source: string;
    userId: number;
    name: string;
    interests: string[];
    activityLevel: 'low' | 'medium' | 'high';
    timestamp: Date;
    relevanceScore: number;
}

export interface DestinationInfoData {
    source: string;
    destination: string;
    description: string;
    highlights: string[];
    transportation: any;
    accommodation: any;
    localCuisine: string[];
    timestamp: Date;
    relevanceScore: number;
}

export interface ConversationRequest {
    message: string;
    sessionId: string;
    userId?: string;
    context?: Partial<ConversationContext>;
}

export interface ConversationResponse {
    message: string;
    sessionId: string;
    queryType: TravelQueryType;
    externalDataUsed: string[];
    confidence: number;
    followUpQuestions?: string[];
    timestamp: Date;
}

export interface DataDecisionContext {
    queryType: TravelQueryType;
    userQuery: string;
    conversationContext: ConversationContext;
    availableExternalData: ExternalDataPoint[];
    dataRelevanceScore: number;
}
