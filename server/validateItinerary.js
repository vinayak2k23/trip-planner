// server/validateItinerary.js
// Server-side schema validation for the full enhanced + pricing schema.

const VALID_CATEGORIES = new Set([
  'sightseeing', 'activity', 'transport', 'rest', 'local_street', 'nightlife', 'food',
]);
const VALID_TIMES = new Set(['morning', 'afternoon', 'evening', 'night']);

// Enums that the client normalises — we warn but don't reject
const LENIENT_CATEGORY = true;
const LENIENT_TIME     = true;

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}
function isNullOrTimeString(v) {
  if (v === null) return true;
  return typeof v === 'string' && /^\d{2}:\d{2}$/.test(v);
}

function validateItinerary(data) {
  if (typeof data !== 'object' || data === null || Array.isArray(data))
    return { valid: false, reason: 'Response is not a JSON object' };

  if (data.error === 'invalid_input') return { valid: true, isInputError: true };

  for (const key of ['trip_title', 'destination', 'duration_days', 'days']) {
    if (!(key in data)) return { valid: false, reason: `Missing field: "${key}"` };
  }

  if (!isNonEmptyString(data.trip_title))  return { valid: false, reason: 'trip_title must be a non-empty string' };
  if (!isNonEmptyString(data.destination)) return { valid: false, reason: 'destination must be a non-empty string' };
  if (typeof data.duration_days !== 'number' || data.duration_days < 1)
    return { valid: false, reason: 'duration_days must be a positive number' };
  if (!Array.isArray(data.days) || data.days.length === 0)
    return { valid: false, reason: '"days" must be a non-empty array' };

  const seenIds = new Set();

  for (let i = 0; i < data.days.length; i++) {
    const day = data.days[i];
    const D = `Day ${i + 1}`;

    if (typeof day.day_number !== 'number') return { valid: false, reason: `${D}: invalid day_number` };
    if (!isNonEmptyString(day.title))       return { valid: false, reason: `${D}: missing title` };
    if (!isNonEmptyString(day.location))    return { valid: false, reason: `${D}: missing location` };

    // ── Hotel ──────────────────────────────────────────────────────────────
    if (typeof day.hotel !== 'object' || day.hotel === null)
      return { valid: false, reason: `${D}: missing hotel object` };
    const h = day.hotel;
    if (!isNonEmptyString(h.name))              return { valid: false, reason: `${D}.hotel: missing name` };
    if (!isNonEmptyString(h.area))              return { valid: false, reason: `${D}.hotel: missing area` };
    if (!isNullOrTimeString(h.check_in_time))   return { valid: false, reason: `${D}.hotel.check_in_time: must be HH:MM or null` };
    if (!isNullOrTimeString(h.check_out_time))  return { valid: false, reason: `${D}.hotel.check_out_time: must be HH:MM or null` };
    if (h.moving_to !== null && !isNonEmptyString(h.moving_to))
      return { valid: false, reason: `${D}.hotel.moving_to: must be string or null` };
    // price_per_night is optional — just normalise if missing

    // ── Meals ──────────────────────────────────────────────────────────────
    if (typeof day.meals !== 'object' || day.meals === null)
      return { valid: false, reason: `${D}: missing meals object` };
    for (const m of ['breakfast', 'lunch', 'dinner']) {
      const meal = day.meals[m];
      if (!meal || !isNonEmptyString(meal.place))
        return { valid: false, reason: `${D}.meals.${m}: missing place` };
      if (!isNonEmptyString(meal.description))
        return { valid: false, reason: `${D}.meals.${m}: missing description` };
    }

    // ── Evening plan ───────────────────────────────────────────────────────
    if (typeof day.evening_plan !== 'object' || day.evening_plan === null)
      return { valid: false, reason: `${D}: missing evening_plan` };
    if (!isNonEmptyString(day.evening_plan.description))
      return { valid: false, reason: `${D}.evening_plan: missing description` };
    if (!Array.isArray(day.evening_plan.highlights)) {
      // Missing/null highlights is non-fatal — client fills with []
      day.evening_plan.highlights = [];
    }

    // ── Stops ──────────────────────────────────────────────────────────────
    if (!Array.isArray(day.stops) || day.stops.length === 0)
      return { valid: false, reason: `${D}: stops must be a non-empty array` };

    for (let j = 0; j < day.stops.length; j++) {
      const s = day.stops[j];
      const loc = `${D} stop ${j + 1}`;

      if (!isNonEmptyString(s.id))          return { valid: false, reason: `${loc}: missing id` };
      if (seenIds.has(s.id))                return { valid: false, reason: `${loc}: duplicate id "${s.id}"` };
      seenIds.add(s.id);

      if (!isNonEmptyString(s.name))        return { valid: false, reason: `${loc}: missing name` };
      if (!isNonEmptyString(s.description)) return { valid: false, reason: `${loc}: missing description` };
      // Enums: warn but don't reject — client normaliser handles these
      if (!LENIENT_CATEGORY && !VALID_CATEGORIES.has(s.category))
        return { valid: false, reason: `${loc}: invalid category "${s.category}"` };
      if (!LENIENT_TIME && !VALID_TIMES.has(s.time_of_day))
        return { valid: false, reason: `${loc}: invalid time_of_day "${s.time_of_day}"` };
      if (typeof s.duration_hours !== 'number' || s.duration_hours <= 0)
        return { valid: false, reason: `${loc}: invalid duration_hours` };
      // tip and entry_fee are optional — normalised client-side
    }
  }

  return { valid: true };
}

export { validateItinerary };
