export default function ProgressBar({ value = 0, max = 100, color = 'blue', size = 'md', showLabel = false, className = '' }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  const gradients = {
    blue:   'from-blue-500 to-blue-400',
    green:  'from-emerald-500 to-emerald-400',
    yellow: 'from-yellow-500 to-yellow-400',
    red:    'from-red-500 to-red-400',
  }

  const glows = {
    blue:   'shadow-[0_0_8px_rgba(59,130,246,0.5)]',
    green:  'shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    yellow: 'shadow-[0_0_8px_rgba(234,179,8,0.5)]',
    red:    'shadow-[0_0_8px_rgba(239,68,68,0.5)]',
  }

  const sizes = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2.5',
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 bg-dark-600 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`bg-gradient-to-r ${gradients[color]} ${sizes[size]} rounded-full transition-all duration-700 ease-out ${percent > 0 ? glows[color] : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 min-w-[2.5rem] text-right font-medium">{Math.round(percent)}%</span>
      )}
    </div>
  )
}
