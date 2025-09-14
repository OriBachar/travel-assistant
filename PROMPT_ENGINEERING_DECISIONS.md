# Prompt Engineering Decisions

## Overview

This document outlines the key prompt engineering decisions made for the Travel Assistant, focusing on creating natural, helpful conversations while preventing hallucinations and maintaining context.

## 1. System Prompt Design

### Core Persona: Ellie

**Decision**: Created a consistent, friendly persona named "Ellie" who talks like a real person, not a robot.

**Rationale**:

- Establishes trust and relatability
- Provides consistent personality across conversations
- Makes interactions feel natural and human-like

**Implementation**:

```
You are Ellie, a friendly travel expert who talks like a real person, not a robot.
You're excited about travel and genuinely want to help people have amazing trips.
```

### Conversational Style Guidelines

**Decision**: Explicit instructions for natural conversation flow.

**Key Elements**:

- Use casual, warm language with variety ("Hey!", "Hi there!", "Oh wow!")
- Avoid repeating the same information or phrases
- Use contractions (I'm, you're, it's, don't)
- Keep responses conversational, not formal

**Rationale**: Prevents robotic responses and creates engaging interactions.

## 2. Hallucination Prevention

### Critical Problem

LLMs tend to make up specific details like exact dates, prices, business names, and foreign words.

### Solution: Smart Specificity Strategy

**Decision**: Implemented a balanced approach that provides specific, helpful advice while preventing hallucinations.

**Key Rules**:

1. **Never make up specific details** (dates, prices, schedules, business names)
2. **Never use specific foreign words** (dzongs, emadatse, etc.)
3. **Use general terms instead** ("cultural sites" vs "Tiger's Nest Monastery")
4. **Be honest about limitations** ("I don't have that information")

**Smart Specificity Approach**:

- **Be specific about TYPES of experiences**: "traditional temples", "fresh seafood markets", "historic neighborhoods"
- **Be specific about PRACTICAL advice**: "pack layers for weather", "use public transport", "try street food stalls"
- **Be specific about CULTURAL categories**: "Buddhist temples", "traditional architecture", "local cuisine"
- **Be specific about LOCATION TYPES**: "historic districts", "cultural neighborhoods", "local markets"
- **Avoid specific names**: Don't mention exact temple names, restaurant names, or specific historical details

**Implementation**:

```
CRITICAL: NEVER make up specific details like exact dates, prices, schedules,
timezones, business names, addresses, exact locations, specific foreign words,
or budget estimates unless you have real, current data.

GOOD: "Try traditional local cuisine" or "Visit cultural museums"
BAD: "Visit the National Museum" or "Try specific dish names"

**Smart Specificity Strategy:**
- Be specific about TYPES of experiences: "traditional temples", "fresh seafood markets"
- Be specific about PRACTICAL advice: "pack layers", "use public transport"
- Be specific about CULTURAL categories: "Buddhist temples", "traditional architecture"
- Avoid specific names: Don't mention exact temple names, restaurant names
```

**Result**: Provides specific, helpful advice while staying safe from hallucinations.

## 3. Chain-of-Thought Prompting

### Decision

Implemented structured reasoning prompts that guide the LLM through multi-step thinking with advanced safety rules.

### Template Structure

```
**What are they really asking?**
- What's the main thing they want to know?
- Any hidden needs or preferences?

**What do I know about them from our conversation?**
- What have we already discussed? (Check conversation history carefully)
- What specific details have they shared about their trip?
- What have I already recommended or mentioned?
- What's their travel style, interests, or constraints?

**What NEW information can I provide?**
- What haven't I mentioned yet that would be helpful?
- What specific details from external data can I share?
- What would build on what we've already talked about?
- How can I avoid repeating the same information?

**CRITICAL SAFETY RULES:**
- NEVER mention specific attraction names, restaurant names, or dish names
- NEVER mention specific prices, costs, or budget estimates
- NEVER mention specific historical details or facts
- Use GENERAL categories: "temples", "museums", "traditional restaurants"
- Use GENERAL experiences: "traditional architecture", "local cuisine"
- Focus on TYPES of experiences and PRACTICAL GUIDANCE

**FINAL ANSWER:**
[Natural response to user - only the final response, no reasoning]
```

### Benefits

- **Better reasoning**: LLM thinks through problems systematically
- **More relevant responses**: Considers context and available data
- **Consistent quality**: Structured approach reduces random responses
- **Hallucination prevention**: Built-in safety rules prevent made-up details
- **Context awareness**: Avoids repetition and builds on previous conversation

## 4. Context Management

### Decision

Maintain conversation history and use it to provide contextual responses.

### Implementation

```
Previous conversation:
User: I'm planning a trip to Bhutan
Ellie: That sounds amazing! What are you most excited about?
User: I want to visit cultural sites
Ellie: Great! Bhutan has incredible cultural heritage...
```

### Benefits

- **Natural flow**: Responses build on previous conversation
- **Reduced repetition**: Don't ask the same questions twice
- **Better recommendations**: Tailored to user's expressed interests

## 5. External Data Integration

### Decision

Blend external API data with LLM knowledge seamlessly.

### Key Principles

1. **Don't mention data sources** - Use information naturally
2. **Only use provided data** - Don't make up details
3. **Be specific with real data** - Use actual temperatures, populations, etc.
4. **Be general with recommendations** - Avoid specific place names

### Example

```
External Data: Temperature: 12.6°C, Population: 771,612
Response: "It's currently around 12.6 degrees Celsius in Thimphu,
and with a population of over 771,000 people, you'll find a vibrant city..."
```

## 6. Query Classification

### Decision

Automatically classify user queries to determine the best response approach.

### Categories

- **weather**: Needs weather API data
- **destination**: Needs country/city information
- **packing**: Needs practical advice
- **attractions**: Needs cultural information
- **general**: Standard conversation

### Benefits

- **Targeted responses**: Different approaches for different query types
- **Efficient API usage**: Only fetch relevant external data
- **Better user experience**: Responses match user intent

## 7. Natural Follow-up Questions

### Decision

Let the LLM generate follow-up questions naturally through prompt engineering rather than separate generation.

### Implementation

- **Natural generation**: LLM creates follow-up questions organically in responses
- **Context awareness**: Builds on previous conversation, avoids repetition
- **Prompt-driven**: Chain-of-thought prompts guide LLM to ask relevant questions
- **Conversational flow**: Follow-ups feel natural and contextual

### Strategy

- **Build on previous context** - Don't repeat questions
- **Be specific to their situation** - Tailored to their query
- **Move conversation forward** - Help them plan their trip

### Example

```
User: "What's the weather like in Bhutan?"
LLM Response: "...With temperatures around 15°C, you'll want to pack layers.
Are you planning outdoor activities, or would you like me to help you
pack for the weather conditions?"
```

### Technical Details

- **Prompt Integration**: Chain-of-thought prompts include follow-up guidance
- **Natural Flow**: Follow-ups are part of the main response
- **Context Integration**: LLM considers conversation history and query type
- **Simpler Implementation**: No separate API calls or complex generation

## 8. Error Handling and Recovery

### Decision

Gracefully handle API failures and provide helpful fallbacks.

### Approach

- **Acknowledge limitations** - "I don't have current weather data"
- **Suggest alternatives** - "You can check online for the latest forecast"
- **Maintain helpfulness** - Still provide general advice

## Key Success Metrics

1. **Natural Conversations**: Users feel like they're talking to a knowledgeable friend
2. **Accurate Information**: Real data from APIs, no made-up details
3. **Contextual Responses**: Each response builds on previous conversation
4. **Helpful Recommendations**: Practical, actionable advice
5. **Error Resilience**: System works even when APIs fail
6. **Hallucination Prevention**: Safe from making up specific details while remaining helpful
7. **Smart Specificity**: Specific enough to be useful, general enough to be safe

## Advanced Features

### Error Handling and Recovery

- **Graceful API failures**: System continues to work even when external APIs fail
- **Fallback responses**: Provides general advice when specific data isn't available
- **Error detection**: Identifies unclear or contradictory user inputs

### Query Classification

- **Intelligent routing**: Different prompt templates for different query types
- **Weather queries**: Specialized weather advice with external data
- **Planning queries**: Advanced reasoning for complex trip planning
- **Cultural queries**: Safe recommendations for attractions and experiences

### Response Extraction

- **Clean output**: Regex patterns extract only the final user-facing response
- **Hidden reasoning**: Chain-of-thought process is internal, not exposed to users
- **Consistent format**: All responses follow the same conversational style
