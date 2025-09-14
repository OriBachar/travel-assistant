import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env';
import { AppError } from '../types/error';

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        if (!config.gemini.apiKey) {
            throw new AppError('Gemini API key is required', 500);
        }

        this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }

    async generateResponse(prompt: string): Promise<string> {
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('Gemini API Error:', error);
            throw new AppError(`Failed to generate response: ${error.message}`, 500);
        }
    }

    async generateTravelResponse(
        userQuery: string,
        context?: any,
        externalData?: any[]
    ): Promise<string> {
        const systemPrompt = this.buildSystemPrompt();
        const fullPrompt = this.buildFullPrompt(systemPrompt, userQuery, context, externalData);

        return await this.generateResponse(fullPrompt);
    }

    private buildSystemPrompt(): string {
        return `
You are Ellie, a seasoned travel expert with 15+ years of experience who has visited 60+ countries. 
You have a warm, enthusiastic personality and always remember that travel is about creating memories, not just checking boxes.

Your expertise includes:
- Cultural nuances and local customs
- Hidden gems and off-the-beaten-path experiences  
- Practical travel logistics and insider tips
- Budget-conscious and luxury travel options
- Solo, family, and group travel dynamics

You speak with authority but remain approachable, always asking follow-up questions to better understand your traveler's needs.

Guidelines for responses:
1. Be conversational and engaging, not robotic
2. Use specific details and personal insights
3. Ask clarifying questions to better understand needs
4. Provide actionable, practical advice
5. Maintain enthusiasm and positivity
6. If you're uncertain about something, say so honestly
7. Always end with a helpful follow-up question
        `;
    }

    private buildFullPrompt(
        systemPrompt: string,
        userQuery: string,
        context?: any,
        externalData?: any[]
    ): string {
        let prompt = systemPrompt + '\n\n';

        if (context) {
            prompt += `Conversation Context:\n${JSON.stringify(context, null, 2)}\n\n`;
        }

        if (externalData && externalData.length > 0) {
            prompt += `External Data Available:\n`;
            externalData.forEach((data, index) => {
                prompt += `Source ${index + 1} (${data.source}):\n${JSON.stringify(data.data, null, 2)}\n\n`;
            });
        }

        prompt += `User Query: ${userQuery}\n\n`;
        prompt += `Please provide a helpful, engaging response as Ellie, the travel expert.`;

        return prompt;
    }

    async generateChainOfThoughtResponse(
        queryType: string,
        userQuery: string,
        context?: any,
        externalData?: any[]
    ): Promise<string> {
        const chainOfThoughtPrompt = this.buildChainOfThoughtPrompt(queryType);
        const fullPrompt = this.buildFullPrompt(chainOfThoughtPrompt, userQuery, context, externalData);

        return await this.generateResponse(fullPrompt);
    }

    private buildChainOfThoughtPrompt(queryType: string): string {
        const basePrompt = `
You are Ellie, a seasoned travel expert. Let's think step by step about this ${queryType} query:

1. **Analyze the user's needs**: What are they really asking for? What's their travel goal?
2. **Consider the context**: What do we know about their preferences, budget, timeline?
3. **Review available data**: What external information can help inform the response?
4. **Plan the response**: How can I provide the most helpful, personalized advice?
5. **Craft the answer**: Be specific, practical, and engaging
6. **Suggest next steps**: What follow-up questions or actions would be most helpful?

Now provide a comprehensive response that follows this reasoning process.
        `;

        return basePrompt;
    }
}

export const geminiService = new GeminiService();
