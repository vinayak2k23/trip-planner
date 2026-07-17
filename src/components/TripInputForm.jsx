// src/components/TripInputForm.jsx
import { useState, useId } from 'react';

const EXAMPLE_PROMPTS = [
  '5 days in Banaras— love street food, temples, and local culture.',
  '7 days road trip through Kerala, nature and beaches, adventurous pace.',
  'Long weekend in Goa, art museums, bakeries, and romantic walks.',
];

export default function TripInputForm({ onSubmit, isLoading }) {
  const [text, setText] = useState('');
  const [budget, setBudget] = useState('');
  const [example, setExample] = useState(0);
  const textareaId = useId();
  const budgetId = useId();
  const charCount = text.trim().length;

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(text, budget);
  }

  function useExample() {
    setText(EXAMPLE_PROMPTS[example]);
    setExample((prev) => (prev + 1) % EXAMPLE_PROMPTS.length);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full animate-slide-up">
      <div className="glass-card p-6 md:p-8">

        {/* Heading */}
        <div className="mb-5">
          <label
            htmlFor={textareaId}
            className="block text-sm font-semibold tracking-wide mb-1"
            style={{ color: 'var(--text-muted)' }}
          >
            DESCRIBE YOUR DREAM TRIP
          </label>
          <p className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
            Destination, duration, interests — the more detail, the better your itinerary.
          </p>
        </div>

        {/* Trip description textarea */}
        <div className="relative mb-4">
          <textarea
            id={textareaId}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            placeholder="eg. make a perfect trip plan with all the fun activities to Goa for 5 days."
            rows={4}
            className="w-full resize-none rounded-xl px-4 py-3 text-sm leading-relaxed outline-none transition-all duration-200 disabled:opacity-50"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              caretColor: 'var(--accent)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent)';
              e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <span
            className="absolute bottom-3 right-3 text-xs select-none"
            style={{ color: charCount > 10 ? 'var(--accent)' : 'var(--text-muted)', opacity: 0.6 }}
          >
            {charCount} chars
          </span>
        </div>

        {/* Budget input */}
        <div className="mb-5">
          <label
            htmlFor={budgetId}
            className="block text-xs font-semibold tracking-wide mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            YOUR BUDGET <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional — helps us recommend right hotels & restaurants)</span>
          </label>

          <div className="relative">
            {/* Currency icon prefix */}
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-base select-none pointer-events-none"
            >
              💰
            </span>
            <input
              id={budgetId}
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              disabled={isLoading}
              placeholder="e.g. ₹50,000  or  $800  or  €600 for the whole trip"
              className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200 disabled:opacity-50"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                caretColor: 'var(--accent)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)';
                e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="submit"
            disabled={isLoading || charCount < 3}
            id="submit-trip-btn"
            className="btn-primary flex-1 sm:flex-none"
          >
            {isLoading ? (
              <>
                <SpinnerIcon />
                Planning your trip…
              </>
            ) : (
              <>
                <PlaneIcon />
                Plan My Trip
              </>
            )}
          </button>

          <button
            type="button"
            onClick={useExample}
            disabled={isLoading}
            className="btn-icon px-4 text-xs font-medium"
            title="Load an example prompt"
          >
            ✨ Try an example
          </button>
        </div>
      </div>
    </form>
  );
}

function PlaneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 4s-2 1-3.5 2.5L9 11l-8.2-1.8C.4 9 0 8.6 0 8c0-.8.8-1 1.2-.8L9 10l.8.4.7-.7L14 6 13.5 4 15 2l2.5 2.5L20 2l2 2-2.5 1.5L22 8l-2 1.5-2-1-3.7 3.5-.4.4-.4.7.4 8.2c.2.4 0 1.2-.8 1.2-.6 0-1-.4-1.2-.8z"/>
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}
