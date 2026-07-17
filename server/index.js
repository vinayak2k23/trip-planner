// server/index.js
// Express server — the only place the Groq API key is used.

import express from 'express';
import cors from 'cors';
import { callGroq } from './groqClient.js';
import { validateItinerary } from './validateItinerary.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
  })
);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/ping', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── POST /api/plan-trip ───────────────────────────────────────────────────────
app.post('/api/plan-trip', async (req, res) => {
  const { prompt } = req.body ?? {};

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'bad_request', message: 'prompt is required' });
  }

  try {
    // ── Call Groq with up to 2 attempts ──────────────────────────────────────
    // The first response occasionally has minor schema inconsistencies (wrong
    // enum value, missing optional field, etc.). A silent automatic retry almost
    // always produces a clean result, so the user never sees a spurious error.
    const MAX_ATTEMPTS = 2;
    let itinerary;
    let lastValidationReason;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        itinerary = await callGroq(prompt.trim());
      } catch (groqErr) {
        console.error(`[/api/plan-trip] Groq call failed (attempt ${attempt}):`, groqErr.message);

        if (groqErr.status === 429) {
          return res.status(429).json({ error: 'rate_limited', message: 'Too many requests — please wait a moment and try again.' });
        }
        if (groqErr instanceof SyntaxError) {
          if (attempt < MAX_ATTEMPTS) continue; // retry on JSON parse error
          return res.status(422).json({ error: 'invalid_shape', message: 'AI returned malformed JSON.' });
        }
        return res.status(502).json({ error: 'upstream_error', message: 'Could not reach the AI service.' });
      }

      // Allow the AI's own "invalid_input" error to flow through cleanly
      if (itinerary?.error === 'invalid_input') {
        return res.status(200).json({ error: 'invalid_input', message: itinerary.message ?? 'Please describe a real trip.' });
      }

      // Server-side schema validation
      const validation = validateItinerary(itinerary);
      if (validation.valid) break; // success — exit retry loop

      lastValidationReason = validation.reason;
      console.warn(`[/api/plan-trip] Validation failed (attempt ${attempt}/${MAX_ATTEMPTS}):`, lastValidationReason);

      if (attempt === MAX_ATTEMPTS) {
        return res.status(422).json({
          error: 'invalid_shape',
          message: `AI response did not match expected schema after ${MAX_ATTEMPTS} attempts: ${lastValidationReason}`,
        });
      }
      // Otherwise loop and retry silently
    }

    return res.status(200).json(itinerary);
  } catch (err) {
    console.error('[/api/plan-trip] Unexpected error:', err);
    return res.status(500).json({ error: 'server_error', message: 'An unexpected error occurred.' });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Trip Planner server running on http://localhost:${PORT}`);
  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️  GROQ_API_KEY is not set — requests to Groq will fail!');
  }
});
