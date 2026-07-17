// src/App.jsx
// Root component — owns all state, lifecycle, abort logic, and trip history.

import { useState, useRef, useCallback } from 'react';
import { useItinerary }    from './hooks/useItinerary.js';
import { useTripHistory }  from './hooks/useTripHistory.js';
import { planTrip }        from './api/planTrip.js';
import { validateItinerary } from './utils/validateItinerary.js';

import TripInputForm   from './components/TripInputForm.jsx';
import ItineraryView   from './components/ItineraryView.jsx';
import LoadingState    from './components/LoadingState.jsx';
import ErrorState      from './components/ErrorState.jsx';
import EmptyState      from './components/EmptyState.jsx';
import SavedTripsPanel from './components/SavedTripsPanel.jsx';

// status: 'idle' | 'loading' | 'success' | 'error' | 'empty'



export default function App() {
  const [status, setStatus]         = useState('idle');
  const [errorMsg, setErrorMsg]     = useState('');
  const [lastPrompt, setLastPrompt] = useState('');
  const [lastBudget, setLastBudget] = useState('mid-range');
  const [activeBudget, setActiveBudget] = useState('mid-range'); // budget for currently-viewed trip

  const { itinerary, expandedDays, setItinerary, reset, toggleDay, removeStop, reorderStop } =
    useItinerary();

  const { history, saveTrip, deleteTrip } = useTripHistory();

  // AbortController + stale-request guard
  const abortRef      = useRef(null);
  const requestIdRef  = useRef(0);

  // ── Submit a new trip prompt ──────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (prompt, budget) => {
      const trimmed = prompt?.trim() ?? '';

      if (!trimmed) {
        setStatus('empty');
        return;
      }

      // Cancel any in-flight request
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      // Stale-response guard
      const thisRequestId = ++requestIdRef.current;

      setStatus('loading');
      setLastPrompt(trimmed);
      setLastBudget(budget);
      reset();

      // Build the final prompt including budget info
      const fullPrompt = budget?.trim()
        ? `${trimmed}\n\nTotal budget for this trip: ${budget.trim()}. Plan hotels, restaurants, and activities that fit within this budget. Include realistic price estimates.`
        : trimmed;

      try {
        const data = await planTrip(fullPrompt, controller.signal);
        if (thisRequestId !== requestIdRef.current) return;

        // AI signalled invalid input
        if (data?.error === 'invalid_input') {
          setStatus('error');
          setErrorMsg(data.message || "Couldn't plan that trip — please be more specific.");
          return;
        }

        // Client-side validation (defense in depth)
        if (!validateItinerary(data)) {
          setStatus('error');
          setErrorMsg('The AI returned an unexpected format. Please try again.');
          return;
        }

        // Auto-save to history
        saveTrip(data, trimmed, budget);
        setActiveBudget(budget);

        setItinerary(data);
        setStatus('success');
      } catch (err) {
        if (thisRequestId !== requestIdRef.current) return;
        if (err.type === 'abort') return;

        setStatus('error');
        setErrorMsg(err.message || 'Something went wrong. Please try again.');
      }
    },
    [reset, setItinerary, saveTrip]
  );

  // ── Retry last prompt ─────────────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    if (lastPrompt) handleSubmit(lastPrompt, lastBudget);
  }, [lastPrompt, lastBudget, handleSubmit]);

  // ── Go home WITHOUT clearing the current trip from history ────────────────
  const handleGoHome = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    reset();
    setStatus('idle');
    setErrorMsg('');
  }, [reset]);

  // ── Load a saved trip from history (no API call) ──────────────────────────
  const handleLoadHistory = useCallback(
    (entry) => {
      reset();
      setItinerary(entry.itinerary);
      setActiveBudget(entry.budget ?? 'mid-range');
      setLastPrompt(entry.prompt ?? '');
      setLastBudget(entry.budget ?? 'mid-range');
      setStatus('success');
    },
    [reset, setItinerary]
  );

  const isViewingTrip = status === 'success';

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 h-14 border-b"
        style={{ background: 'rgba(11,17,32,0.88)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}
      >
        {/* Logo — clicking always goes home */}
        <button
          onClick={handleGoHome}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          title="Back to home"
        >
          <span className="text-xl">✈️</span>
          <span className="font-bold text-sm tracking-wide gradient-text">Trip Planner</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Saved trips count pill */}
          {history.length > 0 && !isViewingTrip && (
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'rgba(79,156,249,0.1)', color: 'var(--accent)', border: '1px solid rgba(79,156,249,0.2)' }}
            >
              {history.length} saved trip{history.length !== 1 ? 's' : ''}
            </span>
          )}

          {/* Back to home button — shown while viewing a trip */}
          {isViewingTrip && (
            <button
              onClick={handleGoHome}
              id="nav-home-btn"
              className="btn-icon px-3 text-xs font-semibold flex items-center gap-1.5"
            >
              ← Home
            </button>
          )}

        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-8 pb-16">

        {/* ── HOME VIEW: form + saved trips ──────────────────────────────────── */}
        {!isViewingTrip && (
          <>
            <TripInputForm
              onSubmit={handleSubmit}
              isLoading={status === 'loading'}
            />

            {/* Status panels */}
            <div className="mt-8">
              {status === 'idle'    && <EmptyState />}
              {status === 'empty'   && (
                <ErrorState
                  message="Please describe your trip before submitting. Where are you going? How long?"
                  onRetry={null}
                />
              )}
              {status === 'loading' && <LoadingState />}
              {status === 'error'   && <ErrorState message={errorMsg} onRetry={handleRetry} />}
            </div>

            {/* Saved trips — shown only when idle or after error, not during loading */}
            {(status === 'idle' || status === 'error' || status === 'empty') && (
              <SavedTripsPanel
                history={history}
                onLoad={handleLoadHistory}
                onDelete={deleteTrip}
              />
            )}
          </>
        )}

        {/* ── TRIP VIEW: full itinerary ───────────────────────────────────────── */}
        {isViewingTrip && itinerary && (
          <ItineraryView
            itinerary={itinerary}
            expandedDays={expandedDays}
            onToggleDay={toggleDay}
            onRemoveStop={removeStop}
            onReorderStop={reorderStop}
            onGoHome={handleGoHome}
            budget={activeBudget}
          />
        )}
      </main>
    </div>
  );
}
