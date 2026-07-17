// src/components/HotelCard.jsx
// Displays hotel name, area, check-in/check-out, price per night,
// and a "moving day" banner when travelling to a new city.

export default function HotelCard({ hotel }) {
  const isCheckIn  = hotel.check_in_time  !== null;
  const isCheckOut = hotel.check_out_time !== null;
  const isMoving   = hotel.moving_to      !== null;

  return (
    <div
      className="rounded-xl p-4 mb-3"
      style={{
        background: 'linear-gradient(135deg, rgba(79,156,249,0.08) 0%, rgba(124,106,245,0.08) 100%)',
        border: '1px solid rgba(79,156,249,0.2)',
      }}
    >
      {/* Moving-day banner */}
      {isMoving && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 mb-3 text-xs font-semibold"
          style={{
            background: 'rgba(251,146,60,0.12)',
            border: '1px solid rgba(251,146,60,0.3)',
            color: '#fb923c',
          }}
        >
          <span>🚌</span>
          <span>
            {isCheckOut ? `Check-out at ${hotel.check_out_time}` : 'Checking out'} → Moving to{' '}
            <strong>{hotel.moving_to}</strong>
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Hotel icon */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: 'rgba(79,156,249,0.15)', border: '1px solid rgba(79,156,249,0.25)' }}
        >
          🏨
        </div>

        {/* Hotel info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
            {hotel.name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            📍 {hotel.area}
          </p>
          {/* Price per night */}
          {hotel.price_per_night && (
            <p
              className="inline-flex items-center gap-1 mt-1.5 rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}
            >
              💵 {hotel.price_per_night}
            </p>
          )}
        </div>

        {/* Check-in / Check-out badges */}
        <div className="flex flex-col gap-1 items-end flex-shrink-0">
          {isCheckIn && !isMoving && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }}
            >
              ✓ Check-in {hotel.check_in_time}
            </span>
          )}
          {isCheckOut && !isMoving && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{ background: 'rgba(251,146,60,0.15)', border: '1px solid rgba(251,146,60,0.3)', color: '#fb923c' }}
            >
              ↑ Check-out {hotel.check_out_time}
            </span>
          )}
          {!isCheckIn && !isCheckOut && !isMoving && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
              style={{ background: 'rgba(79,156,249,0.1)', color: 'var(--text-muted)' }}
            >
              🌙 Staying tonight
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
