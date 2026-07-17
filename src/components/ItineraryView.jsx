// src/components/ItineraryView.jsx
import DayCard from './DayCard.jsx';

export default function ItineraryView({
  itinerary,
  expandedDays,
  onToggleDay,
  onRemoveStop,
  onReorderStop,
  onGoHome,
  budget,
}) {
  const totalStops = itinerary.days.reduce((sum, d) => sum + d.stops.length, 0);
  const totalHours = itinerary.days
    .flatMap((d) => d.stops)
    .reduce((sum, s) => sum + (s.duration_hours || 0), 0);

  return (
    <div className="w-full animate-slide-up">
      {/* Trip header */}
      <div className="glass-card p-6 md:p-8 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-extrabold gradient-text mb-1 leading-tight">
              {itinerary.trip_title}
            </h1>
            <p className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              <span>📍</span>
              {itinerary.destination}
            </p>
          </div>

          <button
            id="go-home-btn"
            onClick={onGoHome}
            className="btn-icon px-4 text-xs font-semibold flex-shrink-0 flex items-center gap-1.5"
            title="Back to home"
          >
            <span>←</span> Home
          </button>
        </div>

        {/* Stats pills */}
        <div className="flex flex-wrap gap-2 mt-5">
          <Pill emoji="📅" label={`${itinerary.duration_days} days`} />
          <Pill emoji="📍" label={`${totalStops} stops`} />
          <Pill emoji="⏱" label={`~${totalHours.toFixed(0)} hours`} />
          {budget && (
            <Pill
              emoji="💰"
              label={budget}
              color="rgba(52,211,153,0.12)"
              textColor="#34d399"
              borderColor="rgba(52,211,153,0.25)"
            />
          )}
        </div>
      </div>

      {/* Day cards */}
      <div>
        {itinerary.days.map((day) => (
          <DayCard
            key={day.day_number}
            day={day}
            isExpanded={expandedDays.has(day.day_number)}
            onToggle={onToggleDay}
            onRemoveStop={onRemoveStop}
            onReorderStop={onReorderStop}
          />
        ))}
      </div>

      <p className="text-center text-xs mt-6 pb-4" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
        AI-generated itinerary · Saved automatically · Hover stops to edit
      </p>
    </div>
  );
}

function Pill({ emoji, label, color, textColor, borderColor }) {
  return (
    <span
      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        background:  color       ?? 'rgba(79,156,249,0.1)',
        border:      `1px solid ${borderColor ?? 'rgba(79,156,249,0.2)'}`,
        color:       textColor   ?? '#60a5fa',
      }}
    >
      {emoji} {label}
    </span>
  );
}
