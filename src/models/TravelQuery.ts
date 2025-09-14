import mongoose, { Document, Schema } from 'mongoose';
import { TravelQueryType } from '../types/shared';

export interface TravelQueryDocument extends Document {
    sessionId: string;
    userId?: string;
    queryType: TravelQueryType;
    userQuery: string;
    response: string;
    externalDataUsed: string[];
    confidence: number;
    processingTime: number;
    createdAt: Date;
}

const TravelQuerySchema = new Schema({
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: String,
        index: true
    },
    queryType: {
        type: String,
        enum: Object.values(TravelQueryType),
        required: true,
        index: true
    },
    userQuery: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    },
    externalDataUsed: {
        type: [String],
        default: []
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    processingTime: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

TravelQuerySchema.index({ sessionId: 1, createdAt: -1 });
TravelQuerySchema.index({ userId: 1, createdAt: -1 });
TravelQuerySchema.index({ queryType: 1, createdAt: -1 });
TravelQuerySchema.index({ confidence: -1 });

export const TravelQuery = mongoose.model<TravelQueryDocument>('TravelQuery', TravelQuerySchema);
