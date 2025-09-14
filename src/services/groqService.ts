import Groq from 'groq-sdk';
import { config } from '../config/env';
import { AppError } from '../types/error';
import { getSystemPrompt, getChainOfThoughtPrompt, EXTERNAL_DATA_SECTION_TEMPLATE, TRAVEL_RESPONSE_TEMPLATE, CHAIN_OF_THOUGHT_TEMPLATE } from '../prompts';

export class GroqService {
    private groq: Groq;

    constructor() {
        this.groq = new Groq({
            apiKey: config.groq.apiKey,
        });
    }

    async generateResponse(prompt: string): Promise<string> {
        try {
            const completion = await this.groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.1-8b-instant',
                temperature: 0.7,
                max_tokens: 1000,
            });
            return completion.choices[0]?.message?.content || 'No response generated';
        } catch (error: any) {
            console.error('Groq API Error:', error);
            throw new AppError(`Failed to generate response: ${error.message}`, 500);
        }
    }

    async generateTravelResponse(userQuery: string, history: any[], externalData: any[]): Promise<string> {
        const systemPrompt = getSystemPrompt();

        let historyContext = '';
        if (history && history.length > 0) {
            historyContext = '\n\nPrevious conversation:\n';
            history.forEach(msg => {
                const role = msg.role === 'user' ? 'User' : 'Ellie';
                historyContext += `${role}: ${msg.content}\n`;
            });
        }

        const externalDataSection = EXTERNAL_DATA_SECTION_TEMPLATE(externalData);
        const fullPrompt = TRAVEL_RESPONSE_TEMPLATE(systemPrompt, historyContext, userQuery, externalDataSection);
        return this.generateResponse(fullPrompt);
    }

    async generateChainOfThoughtResponse(queryType: string, userQuery: string, history: any[], externalData: any[], customPrompt?: string): Promise<{ response: string; reasoning: string }> {
        const chainOfThoughtPrompt = customPrompt || getChainOfThoughtPrompt(queryType);

        let historyContext = '';
        if (history && history.length > 0) {
            historyContext = '\n\nPrevious conversation:\n';
            history.forEach(msg => {
                const role = msg.role === 'user' ? 'User' : 'Ellie';
                historyContext += `${role}: ${msg.content}\n`;
            });
        }

        const externalDataSection = EXTERNAL_DATA_SECTION_TEMPLATE(externalData);
        const fullPrompt = CHAIN_OF_THOUGHT_TEMPLATE(chainOfThoughtPrompt, historyContext, userQuery, externalDataSection);
        const fullResponse = await this.generateResponse(fullPrompt);

        let reasoning = 'No reasoning provided';
        let response = fullResponse;

        const patterns = [
            /---\s*\n\s*IMPORTANT:[\s\S]*?\n\s*([\s\S]*)/,
            /---\s*\n\s*([\s\S]*)/,

            /\*\*FINAL ANSWER\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*|$)/,
            /FINAL ANSWER\s*([\s\S]*?)(?=\n\n|\n\*\*|$)/,
            /\*\*FINAL ANSWER:\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*|$)/,
            /FINAL ANSWER:\s*([\s\S]*?)(?=\n\n|\n\*\*|$)/,
            /\*\*How should I respond\?\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*|$)/,
            /How should I respond\?\s*([\s\S]*?)(?=\n\n|\n\*\*|$)/,

            /\*\*FINAL ANSWER:\*\*\s*\[([\s\S]*?)\]/,
            /FINAL ANSWER:\s*\[([\s\S]*?)\]/,
            /\*\*FINAL ANSWER\*\*\s*\[([\s\S]*?)\]/,
            /FINAL ANSWER\s*\[([\s\S]*?)\]/
        ];

        let found = false;
        for (const pattern of patterns) {
            const match = fullResponse.match(pattern);
            if (match) {
                response = match[1].trim();
                if (response.startsWith('"') && response.endsWith('"')) {
                    response = response.slice(1, -1);
                }
                const beforeAnswer = fullResponse.split(match[0])[0];
                if (beforeAnswer.trim()) {
                    reasoning = beforeAnswer.trim();
                }
                found = true;
                break;
            }
        }

        if (!found) {
            const separatorMatch = fullResponse.match(/---\s*\n\s*([\s\S]*)/);
            if (separatorMatch) {
                response = separatorMatch[1].trim();
                if (response.startsWith('"') && response.endsWith('"')) {
                    response = response.slice(1, -1);
                }
                const beforeSeparator = fullResponse.split('---')[0];
                if (beforeSeparator.trim()) {
                    reasoning = beforeSeparator.trim();
                }
                found = true;
            } else {
                response = fullResponse.trim();
                if (response.startsWith('"') && response.endsWith('"')) {
                    response = response.slice(1, -1);
                }
                reasoning = 'No reasoning provided';
                found = true;
            }
        }
        return {
            reasoning: reasoning,
            response: response
        };
    }
}

export const groqService = new GroqService();
