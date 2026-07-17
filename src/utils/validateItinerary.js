// src/utils/validateItinerary.js
// Client-side validation + normalization for the full schema including prices.

const VALID_CATEGORIES = new Set([
  'sightseeing', 'activity', 'transport', 'rest', 'local_street', 'nightlife',
]);
const VALID_TIMES = new Set(['morning', 'afternoon', 'evening', 'night']);

export function validateItinerary(data) {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return false;
  if (!data.trip_title || !data.destination || !data.duration_days) return false;
  if (!Array.isArray(data.days) || data.days.length === 0) return false;

  const seenIds = new Set();

  for (const day of data.days) {
    if (typeof day.day_number !== 'number') return false;
    if (!day.title) return false;

    // Normalise location
    if (!day.location) day.location = data.destination;

    // Normalise hotel
    if (!day.hotel || typeof day.hotel !== 'object') {
      day.hotel = { name: 'Hotel', area: '', check_in_time: null, check_out_time: null, moving_to: null, price_per_night: '' };
    } else {
      day.hotel.check_in_time  = day.hotel.check_in_time  ?? null;
      day.hotel.check_out_time = day.hotel.check_out_time ?? null;
      day.hotel.moving_to      = day.hotel.moving_to      ?? null;
      day.hotel.price_per_night = day.hotel.price_per_night ?? '';
    }

    // Normalise meals
    if (!day.meals || typeof day.meals !== 'object') {
      day.meals = {
        breakfast: { place: 'Local café',       description: 'Start your day here.', price: '' },
        lunch:     { place: 'Local restaurant', description: 'Enjoy local cuisine.', price: '' },
        dinner:    { place: 'Local restaurant', description: 'Evening dining.',       price: '' },
      };
    } else {
      for (const key of ['breakfast', 'lunch', 'dinner']) {
        if (!day.meals[key] || !day.meals[key].place) {
          day.meals[key] = { place: 'Local spot', description: '', price: '' };
        } else {
          day.meals[key].price = day.meals[key].price ?? '';
        }
      }
    }

    // Normalise evening_plan
    if (!day.evening_plan || typeof day.evening_plan !== 'object') {
      day.evening_plan = { description: 'Explore the local area in the evening.', highlights: [] };
    }
    if (!Array.isArray(day.evening_plan.highlights)) day.evening_plan.highlights = [];

    // Validate + normalise stops
    if (!Array.isArray(day.stops) || day.stops.length === 0) return false;

    for (const stop of day.stops) {
      if (!stop.id || seenIds.has(stop.id)) return false;
      seenIds.add(stop.id);
      if (!stop.name || !stop.description) return false;
      if (!VALID_CATEGORIES.has(stop.category)) stop.category = 'activity';
      if (!VALID_TIMES.has(stop.time_of_day))   stop.time_of_day = 'morning';
      if (typeof stop.duration_hours !== 'number') stop.duration_hours = 1;
      if (!stop.tip)       stop.tip = '';
      if (!stop.entry_fee) stop.entry_fee = '';
    }
  }

  return true;
}
