import { Request, Response } from 'express';
import { geminiService } from '../services/geminiService';
import { AppError } from '../types/error';
import { ConversationRequest, ConversationResponse } from '../types/travel';

export class ConversationController {
    async handleConversation(req: Request, res: Response): Promise<void> {
        try {
            const { message, sessionId, userId, context }: ConversationRequest = req.body;

            if (!message || !sessionId) {
                throw new AppError('Message and sessionId are required', 400);
            }

            const response = await geminiService.generateTravelResponse(message, context);

            const conversationResponse: ConversationResponse = {
                message: response,
                sessionId,
                queryType: 'general_travel' as any,
                externalDataUsed: [],
                confidence: 0.8,
                followUpQuestions: [
                    "What type of travel experience are you looking for?",
                    "Do you have any specific destinations in mind?",
                    "What's your budget range for this trip?"
                ],
                timestamp: new Date()
            };

            res.status(200).json({
                success: true,
                data: conversationResponse
            });

        } catch (error: any) {
            console.error('Conversation Controller Error:', error);

            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        }
    }

    async getHealth(req: Request, res: Response): Promise<void> {
        res.status(200).json({
            status: 'OK',
            message: 'Travel Assistant API is running',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    }
}

export const conversationController = new ConversationController();
