export const CLASSIFICATION_PROMPT = `Hey! You're helping classify travel questions. Look at this user query and figure out what they really need:

User Query: "{userQuery}"

What type of help do they need? Pick the best category and decide if this needs careful thinking or just a quick friendly answer.

Return this exact JSON format:
{
    "queryType": "weather|destination|packing|attractions|planning|general",
    "confidence": 0.0-1.0,
    "reasoning": "Quick explanation of what they're asking",
    "shouldUseChainOfThought": true
}

Think about:
- Is this a simple question or something complex that needs planning?
- Do they need external data (weather, country info, etc.)?
- Is this a multi-step planning question?
- Do they want specific recommendations that need careful thinking?

Response:`;


/**
 * Get the classification prompt with user query
 */
export function getClassificationPrompt(userQuery: string): string {
    return CLASSIFICATION_PROMPT.replace('{userQuery}', userQuery);
}

