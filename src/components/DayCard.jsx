// src/components/DayCard.jsx
import StopItem from './StopItem.jsx';
import HotelCard from './HotelCard.jsx';
import MealsRow from './MealsRow.jsx';

export default function DayCard({ day, isExpanded, onToggle, onRemoveStop, onReorderStop }) {
  const totalHours = day.stops.reduce((sum, s) => sum + (s.duration_hours || 0), 0);
  const isMovingDay = day.hotel?.moving_to !== null && day.hotel?.moving_to !== undefined;

  return (
    <div className="glass-card mb-4 overflow-hidden animate-slide-up">
      {/* ── Day header — clickable to expand/collapse ─────────────────────── */}
      <button
        id={`day-toggle-${day.day_number}`}
        aria-expanded={isExpanded}
        aria-controls={`day-body-${day.day_number}`}
        onClick={() => onToggle(day.day_number)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-white/5"
      >
        {/* Day number badge */}
        <span
          className="flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold"
          style={{
            background: isMovingDay
              ? 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)'
              : 'linear-gradient(135deg, #4f9cf9 0%, #7c6af5 100%)',
            color: '#fff',
            boxShadow: isMovingDay
              ? '0 2px 12px rgba(251,146,60,0.4)'
              : '0 2px 12px rgba(79,156,249,0.4)',
          }}
        >
          {day.day_number}
        </span>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
              {day.title}
            </h3>
            {isMovingDay && (
              <span
                className="text-xs font-medium rounded-full px-2 py-0.5 flex-shrink-0"
                style={{ background: 'rgba(251,146,60,0.15)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)' }}
              >
                🚌 Travel day
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            📍 {day.location} · {day.stops.length} stop{day.stops.length !== 1 ? 's' : ''} · ~{totalHours.toFixed(1)} hrs
          </p>
        </div>

        {/* Chevron */}
        <span
          className="flex-shrink-0 text-xs transition-transform duration-200"
          style={{ color: 'var(--text-muted)', transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        >
          ▼
        </span>
      </button>

      {/* ── Expanded body ─────────────────────────────────────────────────── */}
      {isExpanded && (
        <div id={`day-body-${day.day_number}`} className="px-4 pb-5 animate-fade-in">
          <div className="h-px mb-4" style={{ background: 'var(--border)' }} />

          {/* Hotel */}
          {day.hotel && <HotelCard hotel={day.hotel} />}

          {/* Meals */}
          {day.meals && <MealsRow meals={day.meals} />}

          {/* Daytime stops */}
          {day.stops.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold tracking-wide mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <span>🗺️</span> SIGHTSEEING & ACTIVITIES
              </p>
              <div className="flex flex-col gap-2">
                {day.stops.map((stop, idx) => (
                  <StopItem
                    key={stop.id}
                    stop={stop}
                    dayNumber={day.day_number}
                    isFirst={idx === 0}
                    isLast={idx === day.stops.length - 1}
                    onRemove={onRemoveStop}
                    onReorder={onReorderStop}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Evening plan */}
          {day.evening_plan && <EveningPlan plan={day.evening_plan} />}
        </div>
      )}
    </div>
  );
}

/* ── Evening plan sub-component ─────────────────────────────────────────────── */
function EveningPlan({ plan }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(244,114,182,0.06) 100%)',
        border: '1px solid rgba(139,92,246,0.2)',
      }}
    >
      {/* Header */}
      <p className="text-xs font-semibold tracking-wide mb-2 flex items-center gap-1.5" style={{ color: '#a78bfa' }}>
        <span>🌆</span> EVENING PLAN
      </p>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-primary)' }}>
        {plan.description}
      </p>

      {/* Highlights */}
      {plan.highlights?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {plan.highlights.map((hl, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.25)',
                color: '#c4b5fd',
              }}
            >
              ✦ {hl}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
