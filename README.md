# Travel Assistant

A conversational AI travel assistant that helps users plan trips, get weather information, and discover cultural attractions using advanced prompt engineering and external API integration.

## Features

- **Natural Conversations**: Friendly, human-like interactions with the "Ellie" persona
- **Context Awareness**: Maintains conversation history and builds on previous topics
- **External Data Integration**: Real-time weather, country information, and cultural data
- **Chain-of-Thought Reasoning**: Structured thinking process for better responses
- **Smart Specificity**: Specific enough to be helpful, general enough to be safe from hallucinations
- **Hallucination Prevention**: Comprehensive rules to prevent made-up information
- **Multiple Query Types**: Handles weather, destinations, packing, attractions, and general travel questions
- **Natural Follow-ups**: LLM generates contextual follow-up questions organically
- **Error Handling**: Graceful recovery from API failures and unclear inputs

## Technical Architecture

### Backend

- **Node.js/TypeScript** with Express.js
- **MongoDB** for conversation storage
- **Groq API** for LLM integration
- **Multiple External APIs** for real-time data

### External APIs

- **Open-Meteo**: Weather data
- **RestCountries**: Country information
- **Wikipedia/MediaWiki**: Cultural and historical information
- **Nominatim**: Geocoding and location data
- **TimeZoneDB**: Timezone information

### Key Components

- **Conversation Controller**: Handles chat interactions
- **External API Service**: Manages data fetching and integration
- **Groq Service**: LLM integration with advanced prompting
- **Conversation Service**: MongoDB operations and context management

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Start the development server: `npm run dev`

## Usage

### CLI Interface

```bash
cd cli
node chat.js
```

### API Endpoints

- `POST /api/conversation/chat` - Main chat endpoint
- `GET /health` - Health check

## Prompt Engineering Highlights

### System Prompt Design

- Consistent "Ellie" persona for natural conversations
- Smart specificity strategy for helpful yet safe responses
- Comprehensive hallucination prevention rules
- Conversational style guidelines

### Chain-of-Thought Prompting

- Structured reasoning process with built-in safety rules
- Context-aware decision making
- Multi-step problem solving
- Hidden reasoning process (not exposed to users)

### External Data Integration

- Seamless blending of API data with LLM responses
- Smart data utilization without exposing sources
- Fallback handling for API failures
- Confidence only in verified external data

### Smart Specificity Strategy

- **Specific about experience types**: "traditional temples", "fresh seafood markets"
- **Specific about practical advice**: "pack layers", "use public transport"
- **Specific about cultural categories**: "Buddhist temples", "traditional architecture"
- **Avoids specific names**: No exact place names, restaurant names, or historical details

## Sample Conversations

See `SAMPLE_CONVERSATION_TRANSCRIPTS.md` for examples of the assistant handling:

- Destination planning with context
- Weather and packing advice
- Cultural attractions and local experiences
- Multi-city trip planning

## Key Design Decisions

See `PROMPT_ENGINEERING_DECISIONS.md` for detailed documentation of:

- Prompt engineering strategies
- Hallucination prevention techniques
- Context management approaches
- External data integration methods
