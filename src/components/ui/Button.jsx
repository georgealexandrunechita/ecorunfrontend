const variants = {
  primary:   'bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white shadow-blue-glow hover:shadow-[0_0_32px_rgba(59,130,246,0.5)] border border-blue-400/20',
  secondary: 'bg-transparent border border-blue-600/60 hover:border-blue-500 hover:bg-blue-600/10 text-blue-400',
  ghost:     'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/10 text-white',
  danger:    'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/40',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  icon,
  fullWidth = false,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="w-4 h-4">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
