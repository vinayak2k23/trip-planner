// src/hooks/useItinerary.js
// useReducer for all itinerary state mutations.

import { useReducer, useCallback } from 'react';

// ── Initial state ─────────────────────────────────────────────────────────────
const initialState = {
  itinerary: null,        // full parsed itinerary object
  expandedDays: new Set(),// set of expanded day_number values
};

// ── Reducer ───────────────────────────────────────────────────────────────────
function itineraryReducer(state, action) {
  switch (action.type) {

    case 'SET_ITINERARY': {
      // Expand all days by default
      const allDays = new Set(action.payload.days.map(d => d.day_number));
      return { itinerary: action.payload, expandedDays: allDays };
    }

    case 'RESET':
      return initialState;

    case 'TOGGLE_DAY_EXPANDED': {
      const next = new Set(state.expandedDays);
      if (next.has(action.dayNumber)) {
        next.delete(action.dayNumber);
      } else {
        next.add(action.dayNumber);
      }
      return { ...state, expandedDays: next };
    }

    case 'REMOVE_STOP': {
      const updatedDays = state.itinerary.days
        .map(day => ({
          ...day,
          stops: day.stops.filter(s => s.id !== action.stopId),
        }))
        .filter(day => day.stops.length > 0); // remove day if all stops gone

      return {
        ...state,
        itinerary: { ...state.itinerary, days: updatedDays },
      };
    }

    case 'REORDER_STOP': {
      // action.dayNumber, action.stopId, action.direction: 'up' | 'down'
      const updatedDays = state.itinerary.days.map(day => {
        if (day.day_number !== action.dayNumber) return day;

        const stops = [...day.stops];
        const idx = stops.findIndex(s => s.id === action.stopId);
        if (idx === -1) return day;

        const targetIdx = action.direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= stops.length) return day;

        // Swap
        [stops[idx], stops[targetIdx]] = [stops[targetIdx], stops[idx]];
        return { ...day, stops };
      });

      return {
        ...state,
        itinerary: { ...state.itinerary, days: updatedDays },
      };
    }

    default:
      return state;
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useItinerary() {
  const [state, dispatch] = useReducer(itineraryReducer, initialState);

  const setItinerary = useCallback(
    (data) => dispatch({ type: 'SET_ITINERARY', payload: data }),
    []
  );

  const reset = useCallback(
    () => dispatch({ type: 'RESET' }),
    []
  );

  const toggleDay = useCallback(
    (dayNumber) => dispatch({ type: 'TOGGLE_DAY_EXPANDED', dayNumber }),
    []
  );

  const removeStop = useCallback(
    (stopId) => dispatch({ type: 'REMOVE_STOP', stopId }),
    []
  );

  const reorderStop = useCallback(
    (dayNumber, stopId, direction) =>
      dispatch({ type: 'REORDER_STOP', dayNumber, stopId, direction }),
    []
  );

  return {
    itinerary: state.itinerary,
    expandedDays: state.expandedDays,
    setItinerary,
    reset,
    toggleDay,
    removeStop,
    reorderStop,
  };
}
