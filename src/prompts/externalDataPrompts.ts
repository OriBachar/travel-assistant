// Shared hallucination prevention rules
export const HALLUCINATION_PREVENTION_RULES = `
CRITICAL: NEVER make up specific details like exact dates, prices, schedules, timezones, business names, addresses, exact locations, specific foreign words, or budget estimates unless you have real, current data.

NEVER use specific foreign words or any other specific terms from other languages.

IMPORTANT: Even if the data mentions specific place names, attractions, or businesses, do NOT recommend them specifically. Instead, use general terms like "cultural sites", "museums", "restaurants", "attractions".

GOOD: "Try traditional local cuisine" or "Visit cultural museums"
BAD: "Visit the National Museum" or "Try specific dish names" or "Visit specific building types"

**SAFETY RULES FOR EXTERNAL DATA:**
- ONLY be confident about data you actually received from external APIs
- If you have weather data: Use the exact temperatures and conditions provided
- If you have country data: Use the exact population, currency, language information provided
- If you have city data: Use the exact information from Wikipedia or other sources
- If external data is missing or unclear: Be honest about limitations, don't guess

If you don't have specific information, be honest about it and suggest where users can find it.`;

export const EXTERNAL_DATA_INSTRUCTIONS = `IMPORTANT: Use the data above naturally in your response. Don't mention the data sources or APIs - just incorporate the information seamlessly into your conversation. Be helpful and specific with the actual values and details provided.

**How to use external data effectively:**
- If you have weather data: Use specific temperatures, conditions, and seasonal information to give tailored advice
- If you have country data: Use population, currency, language, and regional information to provide context
- If you have location data: Use coordinates, timezone, and geographic information for practical advice
- If you have city information: Use cultural, historical, and practical details from Wikipedia summaries

**Make recommendations specific to the data:**
- "With temperatures around 20°C, you'll want to pack layers"
- "Since they use the Euro, budget accordingly for meals"
- "The city has a population of 1.2 million, so expect some crowds"
- "Based on the Mediterranean climate, spring is ideal for hiking"

**Be confident with external data, but stay safe:**
- Use specific numbers and facts from the data (temperatures, population, currency, etc.)
- Don't second-guess or apologize for the information you have
- Present data as helpful facts, not uncertain suggestions
- If you have weather data, use it confidently to give specific advice
- **SAFETY**: Only be confident about data you actually have - don't make up specific details
- **SAFETY**: If external data is missing, be honest about limitations rather than guessing

${HALLUCINATION_PREVENTION_RULES}

When you have access to current information, use it naturally in your responses. Don't mention data sources or APIs - just share the helpful information as if you naturally know it.`;

export const EXTERNAL_DATA_SECTION_TEMPLATE = (externalData: any[]): string => {
    if (externalData.length === 0) {
        return '\n\nNo external data available.';
    }

    const dataList = externalData.map(data => `- ${data.source}: ${JSON.stringify(data.data, null, 2)}`).join('\n');

    return `\n\nRELEVANT INFORMATION:\n${dataList}\n\n${EXTERNAL_DATA_INSTRUCTIONS}`;
};

export const TRAVEL_RESPONSE_TEMPLATE = (
    systemPrompt: string,
    historyContext: string,
    userQuery: string,
    externalDataSection: string
): string => {
    return `${systemPrompt}${historyContext}\n\nCurrent User Query: ${userQuery}${externalDataSection}\n\nProvide a helpful, natural response. Use the information above naturally in your conversation. Be conversational and engaging.`;
};

export const CHAIN_OF_THOUGHT_TEMPLATE = (
    chainOfThoughtPrompt: string,
    historyContext: string,
    userQuery: string,
    externalDataSection: string
): string => {
    return `${chainOfThoughtPrompt}${historyContext}\n\nCurrent User Query: ${userQuery}${externalDataSection}`;
};
