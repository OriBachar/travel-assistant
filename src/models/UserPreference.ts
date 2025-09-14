import mongoose, { Document, Schema } from 'mongoose';
import { UserPreferences } from '../types/shared';

export interface UserPreferenceDocument extends UserPreferences, Document {
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserPreferenceSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    travelStyle: {
        type: String,
        enum: ['budget', 'luxury', 'adventure', 'cultural', 'relaxation'],
        default: 'cultural'
    },
    budgetRange: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    interests: {
        type: [String],
        default: []
    },
    previousDestinations: {
        type: [String],
        default: []
    },
    activityLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    groupSize: {
        type: Number,
        default: 1
    },
    ageGroup: {
        type: String,
        enum: ['young', 'adult', 'senior', 'family'],
        default: 'adult'
    },
    specialNeeds: {
        type: [String],
        default: []
    },
    learnedPreferences: {
        type: Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

UserPreferenceSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

UserPreferenceSchema.index({ userId: 1 });
UserPreferenceSchema.index({ travelStyle: 1 });
UserPreferenceSchema.index({ interests: 1 });

export const UserPreference = mongoose.model<UserPreferenceDocument>('UserPreference', UserPreferenceSchema);
