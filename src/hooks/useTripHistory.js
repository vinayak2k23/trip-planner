// src/hooks/useTripHistory.js
// Persists up to 3 planned trips in localStorage.
// Most-recently saved trips appear first.

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'trip_planner_history';
const MAX_TRIPS = 3;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistHistory(trips) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch {
    // Silently ignore storage quota errors
  }
}

export function useTripHistory() {
  const [history, setHistory] = useState(loadHistory);

  /**
   * Save a new itinerary. Prepends to the list and trims to MAX_TRIPS.
   * If the same destination already exists it is replaced instead of duplicated.
   */
  const saveTrip = useCallback((itinerary, prompt, budget) => {
    setHistory((prev) => {
      const entry = {
        id: Date.now().toString(),
        trip_title:    itinerary.trip_title,
        destination:   itinerary.destination,
        duration_days: itinerary.duration_days,
        savedAt:       new Date().toISOString(),
        prompt,
        budget,
        itinerary,
      };
      // Replace existing entry with same title, or prepend
      const without = prev.filter((t) => t.trip_title !== itinerary.trip_title);
      const updated  = [entry, ...without].slice(0, MAX_TRIPS);
      persistHistory(updated);
      return updated;
    });
  }, []);

  /** Remove a single trip by id */
  const deleteTrip = useCallback((id) => {
    setHistory((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      persistHistory(updated);
      return updated;
    });
  }, []);

  return { history, saveTrip, deleteTrip };
}
