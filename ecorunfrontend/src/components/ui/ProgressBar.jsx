export default function ProgressBar({ value = 0, max = 100, color = 'blue', size = 'md', showLabel = false, className = '' }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 bg-dark-500 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-400 min-w-[2.5rem] text-right">{Math.round(percent)}%</span>
      )}
    </div>
  )
}
