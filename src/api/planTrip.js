// src/api/planTrip.js
// Thin fetch wrapper around POST /api/plan-trip.
// Uses AbortController signal passed in from the caller.

/**
 * @param {string} prompt - The user's trip description
 * @param {AbortSignal} signal - AbortController signal for cancellation
 * @returns {Promise<object>} Parsed itinerary JSON
 * @throws {Error} with a .type property: 'abort' | 'network' | 'api' | 'parse'
 */
export async function planTrip(prompt, signal) {
  let response;

  try {
    const base = import.meta.env.VITE_API_URL ?? '';
    response = await fetch(`${base}/api/plan-trip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      const e = new Error('Request cancelled');
      e.type = 'abort';
      throw e;
    }
    const e = new Error('Network error — check your connection and try again.');
    e.type = 'network';
    throw e;
  }

  let data;
  try {
    data = await response.json();
  } catch {
    const e = new Error('Received an unreadable response from the server.');
    e.type = 'parse';
    throw e;
  }

  if (!response.ok) {
    const message = data?.message ?? `Server error (${response.status})`;
    const e = new Error(message);
    e.type = 'api';
    e.status = response.status;
    e.code = data?.error;
    throw e;
  }

  return data;
}
