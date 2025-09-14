import { Conversation, ConversationDocument } from '../models/Conversation';
import { ConversationMessage, ExternalDataPoint } from '../types/shared';

export class ConversationService {

    /**
     * Get conversation history for a session
     */
    async getConversationHistory(sessionId: string): Promise<ConversationMessage[]> {
        try {
            const conversation = await Conversation.findOne({ sessionId });
            return conversation?.messages || [];
        } catch (error) {
            console.error('Error retrieving conversation history:', error);
            return [];
        }
    }

    /**
     * Save a new message to the conversation
     */
    async saveMessage(
        sessionId: string,
        userId: string | undefined,
        role: 'user' | 'assistant',
        content: string,
        queryType: string,
        externalDataUsed: string[] = [],
        confidence: number = 0.8
    ): Promise<void> {
        try {
            const message: ConversationMessage = {
                role,
                content,
                timestamp: new Date(),
                metadata: {
                    queryType: queryType,
                    externalDataUsed,
                    confidence
                }
            };

            await Conversation.updateOne(
                { sessionId },
                {
                    $push: { messages: message },
                    $set: {
                        userId: userId || null,
                        queryType: queryType,
                        updatedAt: new Date()
                    }
                },
                {
                    upsert: true
                }
            );

            console.log(`Message saved for session: ${sessionId}`);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    }

    /**
     * Get the last few messages for context
     */
    async getRecentContext(sessionId: string, limit: number = 5): Promise<ConversationMessage[]> {
        try {
            const conversation = await Conversation.findOne({ sessionId });
            if (!conversation || !conversation.messages) {
                return [];
            }

            return conversation.messages.slice(-limit);
        } catch (error) {
            console.error('Error retrieving recent context:', error);
            return [];
        }
    }

    /**
     * Update conversation context with user preferences
     */
    async updateContext(
        sessionId: string,
        contextUpdate: Partial<{
            currentQueryType: string;
            userPreferences: any;
            conversationState: string;
            userPersona: any;
        }>
    ): Promise<void> {
        try {
            await Conversation.findOneAndUpdate(
                { sessionId },
                {
                    $set: {
                        'context.currentQueryType': contextUpdate.currentQueryType,
                        'context.userPreferences': contextUpdate.userPreferences,
                        'context.conversationState': contextUpdate.conversationState,
                        'context.userPersona': contextUpdate.userPersona,
                        'context.lastInteraction': new Date(),
                        updatedAt: new Date()
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            console.error('Error updating context:', error);
        }
    }

    /**
     * Get full conversation for a session
     */
    async getConversation(sessionId: string): Promise<ConversationDocument | null> {
        try {
            return await Conversation.findOne({ sessionId });
        } catch (error) {
            console.error('Error retrieving conversation:', error);
            return null;
        }
    }

    /**
     * Delete a conversation
     */
    async deleteConversation(sessionId: string): Promise<void> {
        try {
            await Conversation.deleteOne({ sessionId });
            console.log(`Conversation deleted for session: ${sessionId}`);
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    }
}

export const conversationService = new ConversationService();
