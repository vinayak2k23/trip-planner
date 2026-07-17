// src/components/SavedTripsPanel.jsx
// Shows up to 3 previously planned trips from localStorage.

export default function SavedTripsPanel({ history, onLoad, onDelete }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="w-full mt-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">📋</span>
        <h2 className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-muted)' }}>
          SAVED TRIPS ({history.length}/3)
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {history.map((trip, idx) => {
          const savedDate = new Date(trip.savedAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
          });

          return (
            <div
              key={trip.id}
              className="glass-card p-4 flex items-center gap-4 group"
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              {/* Rank */}
              <span
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'rgba(79,156,249,0.15)', color: 'var(--accent)', border: '1px solid rgba(79,156,249,0.25)' }}
              >
                {idx + 1}
              </span>

              {/* Trip info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                  {trip.trip_title}
                </p>
                <div className="flex items-center flex-wrap gap-2 mt-1">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    📍 {trip.destination}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    · 📅 {trip.duration_days} days
                  </span>
                  {/* Budget free text */}
                  {trip.budget && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
                      style={{ background: 'rgba(52,211,153,0.08)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}
                    >
                      💰 {trip.budget}
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: 0.45 }}>
                  Saved {savedDate}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  id={`load-trip-${trip.id}`}
                  onClick={() => onLoad(trip)}
                  className="btn-primary"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.75rem' }}
                  title="Open this trip"
                >
                  Open
                </button>
                <button
                  id={`delete-trip-${trip.id}`}
                  onClick={() => onDelete(trip.id)}
                  className="btn-icon danger"
                  title="Remove from saved trips"
                  aria-label={`Delete ${trip.trip_title}`}
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
