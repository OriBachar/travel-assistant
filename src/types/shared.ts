export enum TravelQueryType {
    DESTINATION_RECOMMENDATION = "destination_recommendation",
    PACKING_SUGGESTIONS = "packing_suggestions",
    LOCAL_ATTRACTIONS = "local_attractions",
    WEATHER_INFO = "weather_info",
    TRAVEL_PLANNING = "travel_planning",
    GENERAL_TRAVEL = "general_travel"
}

export interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    metadata?: {
        queryType?: TravelQueryType;
        externalDataUsed?: string[];
        confidence?: number;
    };
}

export interface UserPreferences {
    travelStyle: 'budget' | 'luxury' | 'adventure' | 'cultural' | 'relaxation';
    budgetRange: 'low' | 'medium' | 'high';
    interests: string[];
    previousDestinations: string[];
    activityLevel: 'low' | 'medium' | 'high';
    groupSize?: number;
    ageGroup?: 'young' | 'adult' | 'senior' | 'family';
    specialNeeds?: string[];
}

export interface ExternalDataPoint {
    source: string;
    data: any;
    relevanceScore: number;
    timestamp: Date;
}
