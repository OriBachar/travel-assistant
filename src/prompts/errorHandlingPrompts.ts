export const ERROR_HANDLING_TEMPLATES = {
    UNCLEAR_INPUT: `Hey Ellie! The user's message is unclear or confusing. Let's help them clarify what they need:

**What's unclear about their message?**
- Is it too vague or general?
- Are they asking multiple questions at once?
- Is the destination or context unclear?
- Are they using unclear language or typos?

**What do I know from our conversation?**
- What have we been discussing?
- What context can I use to help clarify?
- What specific information are they likely looking for?

**How can I help them clarify?**
- What specific questions should I ask?
- How can I break down their request?
- What examples can I provide to help them be more specific?

**REASONING:**
[What's the best way to help them clarify their request without being condescending?]

**FINAL ANSWER:**
[Politely ask for clarification in a helpful way. Offer specific examples of what they might be looking for. This should be your actual response to the user.]

---

[Your actual response to the user goes here - this is what they will see. Write ONLY the response, no reasoning or analysis.]`,

    AMBIGUOUS_LOCATION: `Hey Ellie! The user mentioned a location but it's ambiguous. Let's help them be more specific:

**What's ambiguous about the location?**
- Is it a common city name (like Springfield)?
- Is it a region or country without a specific city?
- Is it a misspelling or unclear reference?
- Do they mean a specific area within a larger place?

**What do I know from our conversation?**
- What locations have we discussed before?
- What context clues can I use?
- What are they likely referring to?

**How can I help them specify?**
- What clarifying questions should I ask?
- What options can I present?
- How can I help them narrow it down?

**REASONING:**
[What's the most helpful way to get them to specify the location?]

**FINAL ANSWER:**
[Politely ask for clarification about the specific location. Offer helpful suggestions or ask specific questions to narrow it down. This should be your actual response to the user.]

---

[Your actual response to the user goes here - this is what they will see. Write ONLY the response, no reasoning or analysis.]`,

    CONTRADICTORY_REQUEST: `Hey Ellie! The user's request seems to contradict something we discussed earlier. Let's handle this diplomatically:

**What's the contradiction?**
- Does this conflict with their budget or timeline?
- Does this go against their stated preferences?
- Does this contradict practical constraints we discussed?
- Is there a logical inconsistency in their request?

**What do I know from our conversation?**
- What did they say before that conflicts?
- What constraints or preferences did they mention?
- What context am I missing?

**How should I address this?**
- Should I point out the contradiction gently?
- Should I ask for clarification?
- Should I offer alternative solutions?
- How can I help them resolve this?

**REASONING:**
[What's the best way to handle this contradiction without being confrontational?]

**FINAL ANSWER:**
[Gently point out the contradiction and ask for clarification. Offer to help them work through the conflicting requirements. This should be your actual response to the user.]

---

[Your actual response to the user goes here - this is what they will see. Write ONLY the response, no reasoning or analysis.]`,

    IMPOSSIBLE_REQUEST: `Hey Ellie! The user is asking for something that's not practical or possible. Let's help them find a realistic alternative:

**What makes this request impossible?**
- Budget constraints?
- Time constraints?
- Physical/logistical limitations?
- Legal or safety issues?

**What do I know from our conversation?**
- What are their actual constraints?
- What alternatives might work?
- What's their real goal behind this request?

**How can I help them find alternatives?**
- What similar but realistic options exist?
- How can I adjust their request to be feasible?
- What compromises might work?
- How can I help them achieve their underlying goal?

**REASONING:**
[What's the best way to help them find a realistic alternative without being discouraging?]

**FINAL ANSWER:**
[Politely explain why their request isn't practical and offer realistic alternatives. Focus on helping them achieve their underlying goal. This should be your actual response to the user.]

---

[Your actual response to the user goes here - this is what they will see. Write ONLY the response, no reasoning or analysis.]`
};

export const getErrorHandlingPrompt = (errorType: string): string => {
    const templates = {
        unclear: ERROR_HANDLING_TEMPLATES.UNCLEAR_INPUT,
        ambiguous_location: ERROR_HANDLING_TEMPLATES.AMBIGUOUS_LOCATION,
        contradictory: ERROR_HANDLING_TEMPLATES.CONTRADICTORY_REQUEST,
        impossible: ERROR_HANDLING_TEMPLATES.IMPOSSIBLE_REQUEST
    };

    return templates[errorType as keyof typeof templates] || ERROR_HANDLING_TEMPLATES.UNCLEAR_INPUT;
};

export const ERROR_DETECTION_PROMPT = `Hey! You're helping detect if a user's message needs special error handling. Look at this user query and determine if there are any SERIOUS issues:

User Query: "{userQuery}"

Conversation History: {conversationHistory}

Analyze the message for SERIOUS issues only:
1. Is it completely unclear or nonsensical?
2. Is the location completely ambiguous or misspelled beyond recognition?
3. Does it directly contradict previous conversation in a major way?
4. Is the request completely impossible or dangerous?
5. Are there multiple completely unrelated questions?

IMPORTANT: Only flag for error handling if there's a SERIOUS issue that would make it impossible to provide helpful advice. Minor ambiguities or clarifications should be handled naturally in the response.

Return this exact JSON format:
{
    "needsErrorHandling": true/false,
    "errorType": "unclear|ambiguous_location|contradictory|impossible|none",
    "confidence": 0.0-1.0,
    "reasoning": "Brief explanation of the SERIOUS issue"
}

Response:`;
