// src/components/EmptyState.jsx
export default function EmptyState() {
  const features = [
    { icon: '🗓️', label: 'Day-by-day itinerary' },
    { icon: '📍', label: 'Curated stops & activities' },
    { icon: '🍜', label: 'Food & restaurant picks' },
    { icon: '✏️', label: 'Editable & reorderable' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in text-center">
      {/* Illustration */}
      <div
        className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl text-5xl"
        style={{
          background: 'linear-gradient(135deg, rgba(79,156,249,0.15) 0%, rgba(167,139,250,0.15) 100%)',
          border: '1px solid var(--border)',
          boxShadow: '0 0 40px rgba(79,156,249,0.12)',
        }}
      >
        🌍
      </div>

      <h2 className="mb-3 text-2xl font-bold gradient-text">
        Plan your next adventure
      </h2>
      <p className="mb-8 max-w-sm text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Describe your dream trip above — destination, duration, interests, and budget — and AI will craft a
        personalized day-by-day itinerary in seconds.
      </p>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {features.map(({ icon, label }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
            style={{
              background: 'rgba(79,156,249,0.08)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            {icon} {label}
          </span>
        ))}
      </div>
    </div>
  );
}
