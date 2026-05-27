export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={`${sizes[size]} border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin ${className}`} />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500 text-sm">Cargando...</p>
      </div>
    </div>
  )
}
