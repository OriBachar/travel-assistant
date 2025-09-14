import { ConversationMessage, UserPreferences, ExternalDataPoint } from './shared';

export interface Conversation {
    _id?: string;
    sessionId: string;
    userId?: string;
    messages: ConversationMessage[];
    context: ConversationContext;
    queryType: string;
    externalDataUsed: ExternalDataPoint[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ConversationContext {
    sessionId: string;
    userId?: string;
    currentQueryType?: string;
    userPreferences?: UserPreferences;
    conversationHistory?: ConversationMessage[];
    lastInteraction?: Date;
    conversationState?: ConversationState;
    userPersona?: UserPersona;
}

export enum ConversationState {
    INITIAL = 'initial',
    GATHERING_PREFERENCES = 'gathering_preferences',
    PLANNING = 'planning',
    REFINING = 'refining',
    COMPLETED = 'completed',
    ERROR = 'error'
}

export interface UserPersona {
    type: 'adventure_seeker' | 'culture_enthusiast' | 'budget_traveler' | 'luxury_traveler' | 'family_traveler';
    confidence: number;
    detectedFrom: string[];
    lastUpdated: Date;
}

export interface ConversationMetrics {
    sessionId: string;
    totalMessages: number;
    averageResponseTime: number;
    userSatisfaction?: number;
    externalApiCalls: number;
    errorCount: number;
    conversationDuration: number;
    createdAt: Date;
}

export interface PromptTemplate {
    id: string;
    name: string;
    description: string;
    template: string;
    variables: string[];
    category: 'system' | 'user' | 'assistant' | 'chain_of_thought' | 'error_recovery';
    queryTypes: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface PromptContext {
    userQuery: string;
    conversationHistory: ConversationMessage[];
    userPreferences?: UserPreferences;
    externalData: ExternalDataPoint[];
    queryType: string;
    conversationState: ConversationState;
    userPersona?: UserPersona;
}

export interface PromptResponse {
    content: string;
    confidence: number;
    reasoning?: string;
    externalDataUsed: string[];
    conversationState: ConversationState;
}

export interface ErrorRecoveryContext {
    errorType: 'hallucination' | 'context_corruption' | 'api_failure' | 'validation_error';
    errorMessage: string;
    conversationContext: ConversationContext;
    lastSuccessfulMessage?: ConversationMessage;
    recoveryAttempts: number;
}

export interface ConversationValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
}
