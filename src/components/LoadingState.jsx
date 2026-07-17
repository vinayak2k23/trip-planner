// src/components/LoadingState.jsx
export default function LoadingState() {
  return (
    <div className="w-full animate-fade-in" role="status" aria-label="Generating your itinerary…">
      {/* Header skeleton */}
      <div className="glass-card p-6 mb-6">
        <div className="skeleton h-8 w-2/3 mb-3" />
        <div className="skeleton h-4 w-1/3 mb-6" />
        <div className="flex gap-3">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
      </div>

      {/* Day card skeletons */}
      {[1, 2, 3].map((n) => (
        <div key={n} className="glass-card p-5 mb-4" style={{ animationDelay: `${n * 0.1}s` }}>
          {/* Day header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="skeleton h-8 w-8 rounded-full" />
            <div>
              <div className="skeleton h-5 w-24 mb-1" />
              <div className="skeleton h-3 w-40" />
            </div>
          </div>

          {/* Stops */}
          {[1, 2].map((s) => (
            <div key={s} className="flex items-start gap-3 mb-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="skeleton h-9 w-9 rounded-lg flex-shrink-0" />
              <div className="flex-1">
                <div className="skeleton h-4 w-3/4 mb-2" />
                <div className="skeleton h-3 w-full mb-1" />
                <div className="skeleton h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ))}

      <p className="text-center text-sm mt-6 animate-pulse" style={{ color: 'var(--text-muted)' }}>
        ✈️ Crafting your perfect itinerary with AI…
      </p>
    </div>
  );
}
