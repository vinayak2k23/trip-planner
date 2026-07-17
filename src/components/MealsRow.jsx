// src/components/MealsRow.jsx
// Shows all 3 daily meals with restaurant name, description, and price estimate.

const MEAL_META = {
  breakfast: { emoji: '🌅', label: 'Breakfast', color: 'rgba(251,191,36,0.10)', textColor: '#fbbf24', borderColor: 'rgba(251,191,36,0.22)' },
  lunch:     { emoji: '☀️', label: 'Lunch',     color: 'rgba(249,115,22,0.10)', textColor: '#f97316', borderColor: 'rgba(249,115,22,0.22)' },
  dinner:    { emoji: '🌙', label: 'Dinner',    color: 'rgba(139,92,246,0.10)', textColor: '#a78bfa', borderColor: 'rgba(139,92,246,0.22)' },
};

export default function MealsRow({ meals }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold tracking-wide mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
        <span>🍽️</span> DAILY MEALS
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {['breakfast', 'lunch', 'dinner'].map((key) => {
          const meta = MEAL_META[key];
          const meal = meals?.[key];

          return (
            <div
              key={key}
              className="rounded-xl p-3 flex flex-col"
              style={{ background: meta.color, border: `1px solid ${meta.borderColor}` }}
            >
              {/* Type label */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-base">{meta.emoji}</span>
                <span className="text-xs font-semibold" style={{ color: meta.textColor }}>
                  {meta.label}
                </span>
              </div>

              {/* Restaurant name */}
              <p className="text-xs font-semibold leading-snug mb-0.5" style={{ color: 'var(--text-primary)' }}>
                {meal?.place ?? '—'}
              </p>

              {/* Description */}
              <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>
                {meal?.description ?? ''}
              </p>

              {/* Price */}
              {meal?.price && (
                <p
                  className="mt-2 text-xs font-semibold flex items-center gap-1"
                  style={{ color: meta.textColor }}
                >
                  💵 {meal.price}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
