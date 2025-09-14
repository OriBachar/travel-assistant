import mongoose, { Document, Schema } from 'mongoose';
import { Conversation as IConversation } from '../types/conversation';
import { ConversationMessage, UserPreferences, ExternalDataPoint } from '../types/shared';

type ConversationWithoutId = Omit<IConversation, '_id'>;

export interface ConversationDocument extends ConversationWithoutId, Document { }

const ConversationMessageSchema = new Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    metadata: {
        queryType: {
            type: String
        },
        externalDataUsed: [String],
        confidence: Number
    }
});

const UserPreferencesSchema = new Schema({
    travelStyle: {
        type: String,
        enum: ['budget', 'luxury', 'adventure', 'cultural', 'relaxation']
    },
    budgetRange: {
        type: String,
        enum: ['low', 'medium', 'high']
    },
    interests: [String],
    previousDestinations: [String],
    activityLevel: {
        type: String,
        enum: ['low', 'medium', 'high']
    },
    groupSize: Number,
    ageGroup: {
        type: String,
        enum: ['young', 'adult', 'senior', 'family']
    },
    specialNeeds: [String]
});

const ConversationContextSchema = new Schema({
    sessionId: {
        type: String,
        required: true
    },
    userId: String,
    currentQueryType: {
        type: String
    },
    userPreferences: UserPreferencesSchema,
    conversationHistory: [ConversationMessageSchema],
    lastInteraction: {
        type: Date,
        default: Date.now
    },
    conversationState: {
        type: String,
        enum: ['initial', 'gathering_preferences', 'planning', 'refining', 'completed', 'error'],
        default: 'initial'
    },
    userPersona: {
        type: {
            type: String,
            enum: ['adventure_seeker', 'culture_enthusiast', 'budget_traveler', 'luxury_traveler', 'family_traveler']
        },
        confidence: Number,
        detectedFrom: [String],
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }
});

const ExternalDataPointSchema = new Schema({
    source: {
        type: String,
        required: true
    },
    data: Schema.Types.Mixed,
    relevanceScore: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ConversationSchema = new Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: String,
        index: true
    },
    messages: [ConversationMessageSchema],
    context: ConversationContextSchema,
    queryType: {
        type: String,
        required: true
    },
    externalDataUsed: [ExternalDataPointSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

ConversationSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

ConversationSchema.index({ sessionId: 1, createdAt: -1 });
ConversationSchema.index({ userId: 1, createdAt: -1 });
ConversationSchema.index({ queryType: 1 });

export const Conversation = mongoose.model<ConversationDocument>('Conversation', ConversationSchema);
