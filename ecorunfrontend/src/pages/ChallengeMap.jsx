import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Filter, Users, Zap, Navigation, ChevronRight } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { challengeService } from '../services/challengeService'
import ProgressBar from '../components/ui/ProgressBar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

// Fix default marker icons broken by Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const ZONES = ['All', 'Norte', 'Sur', 'Centro', 'Triana', 'Este']

const ZONE_CENTERS = {
  Norte:  [37.4090, -5.9920],
  Sur:    [37.3441, -5.9806],
  Centro: [37.3886, -5.9823],
  Triana: [37.3826, -6.0017],
  Este:   [37.4178, -5.8931],
}

const SEVILLE_CENTER = [37.3886, -5.9823]

const statusConfig = {
  in_progress: { label: 'In progress', variant: 'blue', color: '#3B82F6' },
  completed:   { label: 'Completed',   variant: 'green', color: '#10B981' },
  available:   { label: 'Available',   variant: 'gray',  color: '#6B7280' },
  pending:     { label: 'Available',   variant: 'gray',  color: '#6B7280' },
}

const CATEGORY_ICONS = {
  Distancia:  '🏃',
  Frecuencia: '🔥',
  Velocidad:  '⚡',
  Iniciación: '🌱',
}

function normalizeChallenge(c) {
  return {
    id: c.id,
    name: c.name,
    description: c.description,
    location: c.zone ? `${c.zone}, Sevilla` : 'Sevilla',
    zone: c.zone || null,
    distance: parseFloat(c.goal_value),
    ecoPoints: c.reward_points,
    participants: c.participants ?? 0,
    icon: CATEGORY_ICONS[c.category] || '🏅',
    status: c.status || 'available',
    progress: c.progress ?? 0,
    lat: parseFloat(c.lat),
    lng: parseFloat(c.lng),
  }
}

function createCustomIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 32px; height: 32px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  })
}

function ZoomToZone({ zone }) {
  const map = useMap()
  useEffect(() => {
    if (zone === 'All') {
      map.setView(SEVILLE_CENTER, 13)
    } else if (ZONE_CENTERS[zone]) {
      map.setView(ZONE_CENTERS[zone], 15)
    }
  }, [zone, map])
  return null
}

export default function ChallengeMap() {
  const [challenges, setChallenges] = useState([])
  const [zone, setZone] = useState('All')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    challengeService.getAll()
      .then((data) => {
        const normalized = Array.isArray(data) ? data.map(normalizeChallenge) : []
        setChallenges(normalized)
      })
      .catch(() => {})
  }, [])

  const filtered = challenges.filter(c => zone === 'All' || c.zone === zone)

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Map</p>
          <h1 className="text-4xl font-black text-white mb-3">Challenge Map</h1>
          <p className="text-gray-400">Explore available challenges across Seville zones</p>
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
                <span className="text-sm font-semibold text-white">Seville, Spain</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />In progress</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" />Completed</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-gray-500 rounded-full inline-block" />Available</div>
              </div>
            </div>

            {/* Real Leaflet map */}
            <div className="h-[480px]">
              <MapContainer
                center={SEVILLE_CENTER}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomToZone zone={zone} />

                {filtered.map((challenge) => {
                  if (!challenge.lat || !challenge.lng) return null
                  const status = statusConfig[challenge.status] || statusConfig.available
                  const icon = createCustomIcon(status.color)

                  return (
                    <Marker
                      key={challenge.id}
                      position={[challenge.lat, challenge.lng]}
                      icon={icon}
                      eventHandlers={{
                        click: () => setSelected(challenge.id === selected ? null : challenge.id),
                      }}
                    >
                      <Popup>
                        <div style={{ minWidth: '180px' }}>
                          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{challenge.name}</p>
                          <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>{challenge.location}</p>
                          <p style={{ fontSize: '12px' }}>{challenge.distance} km · {challenge.ecoPoints} pts</p>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>
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
                Active challenges · {filtered.length}
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
                          {challenge.status === 'available' ? 'Start challenge' : challenge.status === 'in_progress' ? 'Continue' : 'View summary'}
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
              { icon: Zap,    label: 'Active challenges in Seville', value: challenges.filter(c => c.status !== 'completed').length, color: 'text-blue-400' },
              { icon: Users,  label: 'Participating runners',        value: '1,840',  color: 'text-emerald-400' },
              { icon: MapPin, label: 'Zones covered',                value: '5 zones', color: 'text-orange-400' },
              { icon: Filter, label: 'Active filter',                value: zone,     color: 'text-purple-400' },
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
