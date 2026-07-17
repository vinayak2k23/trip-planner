// src/components/StopItem.jsx
const CATEGORY_META = {
  food:         { emoji: '🍽️', label: 'Food',          badgeClass: 'badge-food' },
  sightseeing:  { emoji: '🏛️', label: 'Sightseeing',   badgeClass: 'badge-sightseeing' },
  activity:     { emoji: '🎯', label: 'Activity',       badgeClass: 'badge-activity' },
  transport:    { emoji: '🚌', label: 'Transport',      badgeClass: 'badge-transport' },
  rest:         { emoji: '😴', label: 'Rest',            badgeClass: 'badge-rest' },
  local_street: { emoji: '🛤️', label: 'Local Street',  badgeClass: 'badge-local-street' },
  nightlife:    { emoji: '🌃', label: 'Nightlife',      badgeClass: 'badge-nightlife' },
};

const TIME_META = {
  morning:   { emoji: '🌅', label: 'Morning',   badgeClass: 'badge-morning' },
  afternoon: { emoji: '☀️', label: 'Afternoon', badgeClass: 'badge-afternoon' },
  evening:   { emoji: '🌆', label: 'Evening',   badgeClass: 'badge-evening' },
  night:     { emoji: '🌙', label: 'Night',     badgeClass: 'badge-night' },
};

const FALLBACK_CAT  = CATEGORY_META.activity;
const FALLBACK_TIME = TIME_META.morning;

export default function StopItem({ stop, dayNumber, isFirst, isLast, onRemove, onReorder }) {
  const cat  = CATEGORY_META[stop.category]  ?? FALLBACK_CAT;
  const time = TIME_META[stop.time_of_day]   ?? FALLBACK_TIME;

  const durationLabel =
    stop.duration_hours === 1        ? '1 hr'
    : stop.duration_hours < 1       ? `${Math.round(stop.duration_hours * 60)} min`
    : `${stop.duration_hours} hrs`;

  // Determine entry fee colour
  const isFree = stop.entry_fee?.toLowerCase().includes('free');

  return (
    <div
      className="group flex items-start gap-3 rounded-xl p-3 transition-all duration-200 animate-fade-in"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid transparent' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
    >
      {/* Category icon */}
      <div
        className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-xl border ${cat.badgeClass}`}
        title={cat.label}
      >
        {cat.emoji}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name + badges */}
        <div className="flex items-center flex-wrap gap-2 mb-1">
          <span className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
            {stop.name}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${cat.badgeClass}`}>
            {cat.label}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${time.badgeClass}`}>
            {time.emoji} {time.label}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            ⏱ {durationLabel}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed mb-1.5" style={{ color: 'var(--text-muted)' }}>
          {stop.description}
        </p>

        {/* Entry fee + Tip row */}
        <div className="flex flex-col gap-1.5">
          {/* Entry fee */}
          {stop.entry_fee && (
            <p
              className="text-xs font-semibold flex items-center gap-1.5 rounded-lg px-2 py-1.5"
              style={{
                background: isFree ? 'rgba(52,211,153,0.06)' : 'rgba(251,146,60,0.06)',
                border:     isFree ? '1px solid rgba(52,211,153,0.18)' : '1px solid rgba(251,146,60,0.18)',
                color:      isFree ? '#34d399' : '#fb923c',
              }}
            >
              <span>🎟️</span>
              <span>Entry: {stop.entry_fee}</span>
            </p>
          )}

          {/* Tip */}
          {stop.tip && (
            <p
              className="text-xs leading-relaxed flex items-start gap-1.5 rounded-lg px-2 py-1.5"
              style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)', color: '#d4a820' }}
            >
              <span className="flex-shrink-0 mt-px">💡</span>
              <span className="italic">{stop.tip}</span>
            </p>
          )}
        </div>
      </div>

      {/* Hover controls */}
      <div className="flex-shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button className="btn-icon" disabled={isFirst} onClick={() => onReorder(dayNumber, stop.id, 'up')}
          title="Move up" id={`move-up-${stop.id}`} aria-label={`Move ${stop.name} up`}>▲</button>
        <button className="btn-icon" disabled={isLast} onClick={() => onReorder(dayNumber, stop.id, 'down')}
          title="Move down" id={`move-down-${stop.id}`} aria-label={`Move ${stop.name} down`}>▼</button>
        <button className="btn-icon danger" onClick={() => onRemove(stop.id)}
          title="Remove" id={`remove-${stop.id}`} aria-label={`Remove ${stop.name}`}>✕</button>
      </div>
    </div>
  );
}
