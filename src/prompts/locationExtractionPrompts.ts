export const LOCATION_EXTRACTION_PROMPT = `You are a travel assistant. Analyze this travel query and extract any specific location (city) and country mentioned.

Query: "{query}"

IMPORTANT: You must respond with ONLY valid JSON. No other text, explanations, or formatting.

Return your response in this exact JSON format:
{
    "location": "city name or null",
    "country": "country name or null"
}

Rules:
- For location: Extract the most specific city/place mentioned (prefer city over country)
- For country: Extract the country name if mentioned
- PRIORITY: If they mention a country name, that's the primary destination
- Consider context: If they mention landmarks, venues, or specific places, try to infer the city
- Consider context: If they mention sports teams, cultural references, or regional terms, try to infer the country
- Use your knowledge to make intelligent inferences about locations
- If conversation context is provided, use it to understand what location they're referring to
- Return "null" if not found
- Use proper capitalization (e.g., "Tokyo", "Japan")
- ONLY return the JSON object, nothing else

Examples:
- "I want to visit Tokyo" → {"location": "Tokyo", "country": "Japan"}
- "What's the weather in Paris?" → {"location": "Paris", "country": "France"}
- "What's the weather in Tel Aviv and Jerusalem?" → {"location": "Tel Aviv", "country": "Israel"}
- "Planning a trip to Japan" → {"location": null, "country": "Japan"}
- "Planning a trip to Israel, thinking about visiting Marrakech" → {"location": null, "country": "Israel"}
- "how to get to the stadium" → {"location": null, "country": null}
- "Tell me about travel" → {"location": null, "country": null}

Response:`;

/**
 * Get the location extraction prompt with the user query
 */
export function getLocationExtractionPrompt(query: string): string {
    return LOCATION_EXTRACTION_PROMPT.replace('{query}', query);
}
