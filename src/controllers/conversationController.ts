import { Request, Response } from 'express';
import { groqService } from '../services/groqService';
import { externalApiService } from '../services/externalApiService';
import { conversationService } from '../services/conversationService';
import { getClassificationPrompt, getErrorHandlingPrompt, ERROR_DETECTION_PROMPT } from '../prompts';
import { AppError } from '../types/error';
import { ConversationRequest, ConversationResponse } from '../types/shared';

export class ConversationController {
    async handleConversation(req: Request, res: Response): Promise<void> {
        try {
            const { message, sessionId, userId, context }: ConversationRequest = req.body;

            if (!message || !sessionId) {
                throw new AppError('Message and sessionId are required', 400);
            }

            await conversationService.saveMessage(
                sessionId,
                userId,
                'user',
                message,
                'general',
                [],
                0.8
            );

            const history = await conversationService.getRecentContext(sessionId, 10);
            const externalData = await externalApiService.getRelevantExternalData(message, userId, history);

            const errorDetection = await this.detectErrorHandlingNeeds(message, history);

            let response: string;
            let reasoning: string | undefined;
            let classification: any;

            if (errorDetection.needsErrorHandling) {
                const errorHandlingPrompt = getErrorHandlingPrompt(errorDetection.errorType);
                const chainResponse = await groqService.generateChainOfThoughtResponse(
                    'error_handling',
                    message,
                    history,
                    externalData,
                    errorHandlingPrompt
                );
                response = chainResponse.response;
                reasoning = chainResponse.reasoning;
                classification = {
                    queryType: 'error_handling',
                    confidence: errorDetection.confidence
                };
            } else {
                classification = await this.classifyQueryIntelligently(message);

                if (true) {
                    const chainResponse = await groqService.generateChainOfThoughtResponse(
                        classification.queryType,
                        message,
                        history,
                        externalData
                    );
                    response = chainResponse.response;
                    reasoning = chainResponse.reasoning;
                } else {
                    response = await groqService.generateTravelResponse(message, history, externalData);
                }
            }

            await conversationService.saveMessage(
                sessionId,
                userId,
                'assistant',
                response,
                classification.queryType,
                externalData.map(data => data.source),
                classification.confidence
            );

            const conversationResponse: ConversationResponse = {
                message: response,
                sessionId,
                queryType: classification.queryType as any,
                externalDataUsed: externalData.map(data => data.source),
                confidence: classification.confidence,
                timestamp: new Date(),
                ...(reasoning && { reasoning })
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

    /**
     * Intelligent query classification using Groq
     */
    private async classifyQueryIntelligently(message: string): Promise<{
        queryType: string;
        confidence: number;
        reasoning: string;
        shouldUseChainOfThought: boolean;
    }> {
        try {
            const classificationPrompt = getClassificationPrompt(message);
            const response = await groqService.generateResponse(classificationPrompt);

            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            console.error('Classification parsing error:', error);
        }

        return {
            queryType: 'general',
            confidence: 0.5,
            reasoning: 'Fallback classification due to parsing error',
            shouldUseChainOfThought: false
        };
    }


    async getHealth(req: Request, res: Response): Promise<void> {
        res.status(200).json({
            status: 'OK',
            message: 'Travel Assistant API is running',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    }

    /**
     * Detect if the user's message needs error handling
     */
    private async detectErrorHandlingNeeds(message: string, history: any[]): Promise<{
        needsErrorHandling: boolean;
        errorType: string;
        confidence: number;
        reasoning: string;
    }> {
        try {
            let historyContext = '';
            if (history && history.length > 0) {
                historyContext = history
                    .slice(-3)
                    .map(msg => `${msg.role}: ${msg.content}`)
                    .join('\n');
            }

            const errorDetectionPrompt = ERROR_DETECTION_PROMPT
                .replace('{userQuery}', message)
                .replace('{conversationHistory}', historyContext);

            const response = await groqService.generateResponse(errorDetectionPrompt);

            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            return {
                needsErrorHandling: false,
                errorType: 'none',
                confidence: 0.5,
                reasoning: 'Could not parse error detection response'
            };

        } catch (error) {
            console.error('Error detecting error handling needs:', error);
            return {
                needsErrorHandling: false,
                errorType: 'none',
                confidence: 0.0,
                reasoning: 'Error in error detection'
            };
        }
    }
}

export const conversationController = new ConversationController();
