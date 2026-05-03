import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Filter, Users, Zap, Navigation, ChevronRight } from 'lucide-react'
import { mockChallenges } from '../data/mock'
import ProgressBar from '../components/ui/ProgressBar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const ZONES = ['Todas', 'Norte', 'Sur', 'Centro', 'Triana', 'Este']

const statusConfig = {
  in_progress: { label: 'En curso', variant: 'blue', dot: 'bg-blue-500' },
  completed: { label: 'Completado', variant: 'green', dot: 'bg-emerald-500' },
  available: { label: 'Disponible', variant: 'gray', dot: 'bg-gray-500' },
}

// Mock map markers positions (% of map container)
const mapMarkers = [
  { id: 1, x: 35, y: 25 },
  { id: 2, x: 28, y: 60 },
  { id: 3, x: 55, y: 70 },
  { id: 4, x: 72, y: 40 },
  { id: 5, x: 48, y: 45 },
  { id: 6, x: 42, y: 80 },
]

export default function ChallengeMap() {
  const [zone, setZone] = useState('Todas')
  const [selected, setSelected] = useState(null)

  const filtered = mockChallenges.filter(c => zone === 'Todas' || c.zone === zone)
  const selectedChallenge = selected ? mockChallenges.find(c => c.id === selected) : null

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Mapa</p>
          <h1 className="text-4xl font-black text-white mb-3">Mapa de Retos</h1>
          <p className="text-gray-400">Explora los retos disponibles por zonas de Sevilla</p>
        </motion.div>

        {/* Zone filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 flex-wrap mb-6"
        >
          {ZONES.map((z) => (
            <button
              key={z}
              onClick={() => setZone(z)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                zone === z
                  ? 'bg-blue-600 text-white shadow-blue-glow'
                  : 'bg-dark-700 border border-dark-500 text-gray-400 hover:text-white hover:bg-dark-600'
              }`}
            >
              {z}
            </button>
          ))}
        </motion.div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3 bg-dark-700 border border-dark-500 rounded-2xl overflow-hidden"
          >
            {/* Map header */}
            <div className="flex items-center justify-between p-4 border-b border-dark-500">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">Sevilla, España</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-blue-500 rounded-full" />En curso</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full" />Completado</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-gray-500 rounded-full" />Disponible</div>
              </div>
            </div>

            {/* Mock map visual */}
            <div className="relative bg-dark-800 aspect-[4/3] overflow-hidden">
              {/* Grid lines simulating streets */}
              <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3B82F6" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Decorative roads */}
              <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <line x1="30%" y1="0" x2="45%" y2="100%" stroke="#3B82F6" strokeWidth="1.5" />
                <line x1="0" y1="50%" x2="100%" y2="45%" stroke="#3B82F6" strokeWidth="1.5" />
                <line x1="60%" y1="0" x2="55%" y2="100%" stroke="#3B82F6" strokeWidth="1" />
                <line x1="0" y1="25%" x2="100%" y2="30%" stroke="#3B82F6" strokeWidth="0.8" />
                <line x1="0" y1="75%" x2="100%" y2="70%" stroke="#3B82F6" strokeWidth="0.8" />
                <ellipse cx="50%" cy="50%" rx="25%" ry="15%" fill="none" stroke="#3B82F6" strokeWidth="0.8" strokeDasharray="4 4" />
              </svg>

              {/* City label */}
              <div className="absolute top-4 left-4 bg-dark-900/80 backdrop-blur px-3 py-1.5 rounded-lg">
                <p className="text-xs text-gray-400 font-medium">Sevilla · Vista satélite simulada</p>
              </div>

              {/* Map markers */}
              {mapMarkers.map((marker) => {
                const challenge = mockChallenges.find(c => c.id === marker.id)
                if (!challenge) return null
                if (zone !== 'Todas' && challenge.zone !== zone) return null
                const isSelected = selected === marker.id
                const dotColor = statusConfig[challenge.status].dot

                return (
                  <button
                    key={marker.id}
                    onClick={() => setSelected(isSelected ? null : marker.id)}
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  >
                    <div className={`relative flex flex-col items-center transition-transform duration-200 ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
                      <div className={`w-10 h-10 bg-dark-800 border-2 ${isSelected ? 'border-blue-500' : 'border-dark-400'} rounded-full flex items-center justify-center shadow-lg text-lg`}>
                        {challenge.icon}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 ${dotColor} rounded-full border-2 border-dark-800`} />
                      {isSelected && (
                        <div className="absolute bottom-full mb-2 bg-dark-700 border border-dark-400 rounded-xl px-3 py-2 whitespace-nowrap shadow-card">
                          <p className="text-xs font-bold text-white">{challenge.name}</p>
                          <p className="text-xs text-gray-500">{challenge.distance} km · {challenge.ecoPoints} pts</p>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}

              {/* Empty state for zone */}
              {zone !== 'Todas' && filtered.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl mb-3">🗺️</p>
                    <p className="text-gray-400 text-sm">Sin retos en esta zona</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: challenge list */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Retos activos · {filtered.length}
              </h2>
              <Filter className="w-4 h-4 text-gray-500" />
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] scrollbar-hide">
              {filtered.map((challenge, i) => {
                const status = statusConfig[challenge.status]
                const isSelected = selected === challenge.id

                return (
                  <motion.button
                    key={challenge.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelected(isSelected ? null : challenge.id)}
                    className={`text-left bg-dark-700 border rounded-2xl p-4 transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-600/60 shadow-blue-glow'
                        : 'border-dark-500 hover:border-dark-400'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-dark-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        {challenge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-white leading-tight">{challenge.name}</h3>
                          <Badge variant={status.variant} className="flex-shrink-0">{status.label}</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {challenge.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="text-white font-semibold">{challenge.distance} km</span>
                      <span className="text-yellow-400 font-semibold">{challenge.ecoPoints} pts</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {challenge.participants}
                      </div>
                    </div>

                    {challenge.status !== 'available' && (
                      <ProgressBar
                        value={challenge.progress}
                        size="sm"
                        color={challenge.status === 'completed' ? 'green' : 'blue'}
                        showLabel
                      />
                    )}

                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-dark-500"
                      >
                        <p className="text-xs text-gray-400 mb-3">{challenge.description}</p>
                        <Button size="sm" fullWidth>
                          {challenge.status === 'available' ? 'Iniciar reto' : challenge.status === 'in_progress' ? 'Continuar' : 'Ver resumen'}
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Footer stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-dark-700 border border-dark-500 rounded-2xl p-5"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Zap, label: 'Retos activos en Sevilla', value: mockChallenges.filter(c => c.status !== 'completed').length, color: 'text-blue-400' },
              { icon: Users, label: 'Runners participando', value: '1,840', color: 'text-emerald-400' },
              { icon: MapPin, label: 'Zonas cubiertas', value: '5 zonas', color: 'text-orange-400' },
              { icon: Filter, label: 'Filtro activo', value: zone, color: 'text-purple-400' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <stat.icon className={`w-5 h-5 ${stat.color} flex-shrink-0`} />
                <div>
                  <div className="text-lg font-black text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
