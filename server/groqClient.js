// server/groqClient.js
// Wraps the Groq API call. API key lives ONLY here, server-side.

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const PRIMARY_MODEL = 'llama-3.3-70b-versatile';
const FALLBACK_MODEL = 'llama-3.1-8b-instant';

const SYSTEM_PROMPT = `You are a trip planning API. You must respond with ONLY a single valid JSON object — no markdown, no code fences, no explanation, no text before or after the JSON.

Generate a rich, detailed day-by-day itinerary that includes hotel recommendations with nightly rates, all 3 daily meals with specific restaurant names and price ranges, sightseeing stops with entry fees, and evening plans. If the user provides a budget, recommend hotels, restaurants, and activities that fit within it and include realistic price estimates in the local currency.

Respond using EXACTLY this JSON structure — every field shown is REQUIRED:

{
  "trip_title": string,
  "destination": string,
  "duration_days": number,
  "days": [
    {
      "day_number": number,
      "title": string,
      "location": string,

      "hotel": {
        "name": string,
        "area": string,
        "check_in_time": string or null,
        "check_out_time": string or null,
        "moving_to": string or null,
        "price_per_night": string
      },

      "meals": {
        "breakfast": { "place": string, "description": string, "price": string },
        "lunch":     { "place": string, "description": string, "price": string },
        "dinner":    { "place": string, "description": string, "price": string }
      },

      "evening_plan": {
        "description": string,
        "highlights": [string, string, string]
      },

      "stops": [
        {
          "id": string,
          "name": string,
          "description": string,
          "category": "sightseeing" | "activity" | "transport" | "rest" | "local_street" | "nightlife",
          "time_of_day": "morning" | "afternoon" | "evening" | "night",
          "duration_hours": number,
          "tip": string,
          "entry_fee": string
        }
      ]
    }
  ]
}

STRICT RULES:

1. "days" array length MUST equal duration_days. Each day MUST have at least 2 stops.
2. ALL fields are required EXCEPT these which follow hotel-change logic:
   - hotel.check_in_time: "HH:MM" on the FIRST day at a new hotel; null on subsequent days.
   - hotel.check_out_time: "HH:MM" on the day you leave a hotel to travel; null otherwise.
   - hotel.moving_to: next destination city name when travelling; null otherwise.
3. hotel.price_per_night: Always include an approximate nightly rate, e.g. "₹3,500/night", "$120/night". If the user gave a budget, make it realistic for that budget.
4. meals prices: Include per-person approximate cost, e.g. "₹150-300 per person", "Free (hotel included)".
5. stops entry_fee: Include ticket price or "Free" for each stop, e.g. "₹600 per person", "Free entry", "$25 (book in advance)".
6. Stop ids MUST be unique across the entire response (e.g. "d1s1", "d1s2", "d2s1").
7. Stops cover daytime. Evening is in evening_plan.
8. tip on each stop: practical tip — opening hours, booking advice, best time to visit, etc.
9. evening_plan.highlights: array of exactly 3 specific place or activity names.
10. Do NOT wrap in markdown or add commentary outside the JSON.
11. If the request is unrelated to travel or empty, respond ONLY with:
    { "error": "invalid_input", "message": "<short reason>" }`;

/**
 * Calls the Groq API with the user's trip prompt.
 * Tries the primary model; on 429 rate-limit, retries with the fallback model.
 */
async function callGroq(prompt, model = PRIMARY_MODEL) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set in environment');

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.5,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
    }),
    signal: AbortSignal.timeout(45_000),
  });

  if (response.status === 429) {
    if (model === PRIMARY_MODEL) {
      console.warn('[groqClient] Rate limited — falling back to', FALLBACK_MODEL);
      return callGroq(prompt, FALLBACK_MODEL);
    }
    const err = new Error('Rate limited on all models');
    err.status = 429;
    throw err;
  }

  if (!response.ok) {
    const err = new Error(`Groq API error: ${response.status} ${response.statusText}`);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    const err = new Error('Groq returned an empty response');
    err.status = 502;
    throw err;
  }

  return JSON.parse(content);
}

export { callGroq };
