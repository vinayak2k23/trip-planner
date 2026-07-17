// src/components/ErrorState.jsx
export default function ErrorState({ message, onRetry }) {
  return (
    <div className="glass-card p-8 text-center animate-fade-in" role="alert">
      {/* Icon */}
      <div
        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h3 className="mb-2 text-lg font-semibold" style={{ color: '#fca5a5' }}>
        Something went wrong
      </h3>
      <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {message || 'Could not generate your itinerary. Please try again.'}
      </p>

      {onRetry && (
        <button
          id="retry-btn"
          onClick={onRetry}
          className="btn-primary"
          style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', boxShadow: '0 4px 20px rgba(239,68,68,0.35)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Retry
        </button>
      )}
    </div>
  );
}
