export interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    metadata?: {
        queryType?: string;
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

export interface ConversationRequest {
    message: string;
    sessionId: string;
    userId?: string;
    context?: Partial<ConversationContext>;
}

export interface ConversationResponse {
    message: string;
    sessionId: string;
    queryType: string;
    externalDataUsed: string[];
    confidence: number;
    timestamp: Date;
    reasoning?: string;
}

export interface ConversationContext {
    destination?: string;
    travelDates?: string;
    budget?: string;
    interests?: string[];
    previousMessages?: ConversationMessage[];
}
