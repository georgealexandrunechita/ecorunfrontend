import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Search, Filter, MapPin, Zap, Users, Trophy, ChevronRight, Activity, Repeat, Timer, Sprout, Award, Target, Calendar } from 'lucide-react'
import { challengeService } from '../services/challengeService'
import { useAuth } from '../context/AuthContext'
import ProgressBar from '../components/ui/ProgressBar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import BottomSheet from '../components/ui/BottomSheet'

const ZONES = ['All', 'Norte', 'Sur', 'Centro', 'Triana', 'Este']
const TYPES = ['All', 'distance', 'count']

const statusConfig = {
  in_progress: { label: 'In progress', variant: 'blue' },
  completed:   { label: 'Completed',   variant: 'green' },
  available:   { label: 'Available',   variant: 'gray' },
  pending:     { label: 'Available',   variant: 'gray' },
}

const CATEGORY_ICONS = {
  Distancia:  Activity,
  Frecuencia: Repeat,
  Velocidad:  Timer,
  Iniciación: Sprout,
}

function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || Award
}

function normalizeChallenge(c) {
  return {
    id: c.id,
    name: c.name,
    description: c.description,
    location: c.zone ? `${c.zone}, Sevilla` : 'Sevilla',
    zone: c.zone || null,
    distance: parseFloat(c.goal_value),
    type: c.goal_type,
    status: c.status || 'available',
    progress: c.progress ?? 0,
    ecoPoints: c.reward_points,
    participants: c.participants ?? 0,
    category: c.category,
    tags: [c.category, c.difficulty, c.goal_type].filter(Boolean),
    difficulty: c.difficulty,
  }
}

function ChallengeCard({ challenge, index, onOpen }) {
  const status = statusConfig[challenge.status] || statusConfig.available
  const CategoryIcon = getCategoryIcon(challenge.category)

  const x = useMotionValue(0)
  const cardOpacity = useTransform(x, [-120, 0, 120], [0.4, 1, 0.4])
  const rightHintOpacity = useTransform(x, [0, 60], [0, 1])
  const leftHintOpacity = useTransform(x, [-60, 0], [1, 0])

  function handleDragEnd(_, info) {
    if (info.offset.x > 80) onOpen(challenge)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Swipe hints */}
      <motion.div style={{ opacity: rightHintOpacity }}
        className="absolute inset-0 bg-blue-600/20 rounded-2xl flex items-center justify-start pl-6 pointer-events-none z-10">
        <span className="text-blue-400 font-bold text-sm">View →</span>
      </motion.div>
      <motion.div style={{ opacity: leftHintOpacity }}
        className="absolute inset-0 bg-dark-600/60 rounded-2xl flex items-center justify-end pr-6 pointer-events-none z-10">
        <span className="text-gray-400 font-bold text-sm">← Skip</span>
      </motion.div>

    <motion.div
      style={{ x, opacity: cardOpacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.3}
      dragSnapToOrigin
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-dark-700 border border-dark-500 hover:border-blue-600/40 rounded-2xl p-5 flex flex-col gap-4 transition-colors duration-300 hover:shadow-card-hover cursor-grab active:cursor-grabbing relative z-20"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <CategoryIcon className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm leading-tight mb-1">{challenge.name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              {challenge.location}
            </div>
          </div>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {challenge.tags.map((tag) => (
          <span key={tag} className="text-xs bg-dark-600 text-gray-400 px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center bg-dark-800/60 rounded-xl p-2">
          <div className="text-sm font-bold text-white">{challenge.distance} km</div>
          <div className="text-xs text-gray-600">Distance</div>
        </div>
        <div className="text-center bg-dark-800/60 rounded-xl p-2">
          <div className="text-sm font-bold text-yellow-400">{challenge.ecoPoints}</div>
          <div className="text-xs text-gray-600">EcoPts</div>
        </div>
        <div className="text-center bg-dark-800/60 rounded-xl p-2">
          <div className="text-sm font-bold text-white">{challenge.participants}</div>
          <div className="text-xs text-gray-600">Runners</div>
        </div>
      </div>

      {/* Progress */}
      {challenge.status !== 'available' && challenge.status !== 'pending' && (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Progress</span>
            <span>{challenge.progress}%</span>
          </div>
          <ProgressBar
            value={challenge.progress}
            color={challenge.status === 'completed' ? 'green' : 'blue'}
          />
        </div>
      )}

      {/* Action */}
      <Button
        variant={challenge.status === 'completed' ? 'ghost' : 'primary'}
        size="sm"
        fullWidth
        className="mt-auto"
        onClick={() => onOpen(challenge)}
      >
        {challenge.status === 'completed' ? (
          <>View summary <ChevronRight className="w-4 h-4" /></>
        ) : challenge.status === 'in_progress' ? (
          <>Continue <ChevronRight className="w-4 h-4" /></>
        ) : (
          <>Start challenge <Zap className="w-4 h-4" /></>
        )}
      </Button>
    </motion.div>
    </div>
  )
}

export default function Challenges() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [zone, setZone] = useState('All')
  const [type, setType] = useState('All')
  const [selected, setSelected] = useState(null)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    const allChallenges = challengeService.getAll()
    const userChallenges = user?.id
      ? challengeService.getUserChallenges(user.id).catch(() => [])
      : Promise.resolve([])

    Promise.all([allChallenges, userChallenges])
      .then(([all, mine]) => {
        const myMap = {}
        if (Array.isArray(mine)) {
          mine.forEach((uc) => { myMap[uc.challenge_id] = uc })
        }
        const normalized = (Array.isArray(all) ? all : []).map((c) => {
          const uc = myMap[c.id]
          return normalizeChallenge(uc ? { ...c, status: uc.status, progress: uc.progress } : c)
        })
        setChallenges(normalized)
      })
      .catch(() => setError('Could not load challenges. Check your connection.'))
      .finally(() => setLoading(false))
  }, [user?.id])


  const filtered = useMemo(() => {
    return challenges.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase())
      const matchZone = zone === 'All' || c.zone === zone
      const matchType = type === 'All' || c.type === type
      return matchSearch && matchZone && matchType
    })
  }, [challenges, search, zone, type])

  async function handleJoin() {
    if (!selected) return
    setJoining(true)
    try {
      await challengeService.join(selected.id)
      setChallenges((prev) =>
        prev.map((c) => c.id === selected.id ? { ...c, status: 'in_progress', progress: 0 } : c)
      )
      setSelected((s) => s ? { ...s, status: 'in_progress', progress: 0 } : null)
    } finally {
      setJoining(false)
    }
  }

  const activeCount = challenges.filter(c => c.status !== 'completed').length
  const totalParticipants = challenges.reduce((acc, c) => acc + c.participants, 0)

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Challenges</p>
          <h1 className="text-4xl font-black text-white mb-3">Challenge List</h1>
          <p className="text-gray-400">Discover and complete routes all across Seville</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-700 border border-dark-500 rounded-2xl p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search challenge or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-dark-600 border border-dark-400 text-white placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {ZONES.map((z) => (
                <button
                  key={z}
                  onClick={() => setZone(z)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    zone === z
                      ? 'bg-blue-600 text-white'
                      : 'bg-dark-600 text-gray-400 hover:text-white hover:bg-dark-500'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-dark-600 border border-dark-400 text-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t === 'All' ? 'Type: All' : t}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            <span className="text-white font-semibold">{filtered.length}</span> challenges found
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            {zone !== 'All' && <Badge variant="blue">{zone}</Badge>}
            {type !== 'All' && <Badge variant="gray">{type}</Badge>}
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center mb-8">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {filtered.map((challenge, i) => (
                <ChallengeCard key={challenge.id} challenge={challenge} index={i} onOpen={setSelected} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🏃</div>
              <h3 className="text-xl font-bold text-white mb-2">No challenges</h3>
              <p className="text-gray-500 text-sm max-w-sm">
                No challenges found with those filters. Try different parameters.
              </p>
              <Button variant="ghost" size="sm" className="mt-4" onClick={() => { setSearch(''); setZone('All'); setType('All') }}>
                Clear filters
              </Button>
            </div>
          )
        )}

        {/* Footer stats */}
        {!loading && (
          <div className="bg-dark-700 border border-dark-500 rounded-2xl p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Target,    label: 'Active challenges',    value: activeCount,                      color: 'text-blue-400' },
                { icon: Users,  label: 'Participating runners', value: totalParticipants.toLocaleString(), color: 'text-emerald-400' },
                { icon: Trophy, label: 'Total challenges',      value: challenges.length,                 color: 'text-yellow-400' },
                { icon: MapPin, label: 'Seville zones',         value: `${ZONES.length - 1} zones`,       color: 'text-orange-400' },
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
          </div>
        )}
      </div>

      {/* Challenge bottom sheet */}
      <BottomSheet open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="px-5 pb-8 pt-2">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">{selected.name}</h2>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {selected.location}
                </div>
              </div>
              <Badge variant={(statusConfig[selected.status] || statusConfig.available).variant}>
                {(statusConfig[selected.status] || statusConfig.available).label}
              </Badge>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selected.tags.map((tag) => (
                <span key={tag} className="text-xs bg-dark-600 text-gray-400 px-2.5 py-1 rounded-full">{tag}</span>
              ))}
            </div>

            {/* Description */}
            {selected.description && (
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{selected.description}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Distance', value: `${selected.distance} km`,  color: 'text-white' },
                { label: 'EcoPoints', value: `${selected.ecoPoints} pts`, color: 'text-yellow-400' },
                { label: 'Runners',  value: selected.participants,        color: 'text-emerald-400' },
              ].map((s) => (
                <div key={s.label} className="bg-dark-700 rounded-xl p-3 text-center">
                  <div className={`text-base font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Progress */}
            {selected.status === 'in_progress' && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Your progress</span>
                  <span className="text-white font-bold">{selected.progress}%</span>
                </div>
                <ProgressBar value={selected.progress} color="blue" />
              </div>
            )}

            {selected.status === 'completed' && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-4 text-center">
                <p className="text-emerald-400 font-bold">🏆 Challenge completed!</p>
                <p className="text-xs text-gray-500 mt-1">+{selected.ecoPoints} EcoPoints earned</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {selected.status === 'available' && (
                <Button fullWidth onClick={handleJoin} disabled={joining}>
                  {joining ? 'Joining...' : <><Zap className="w-4 h-4" /> Join challenge</>}
                </Button>
              )}
              {selected.status === 'in_progress' && (
                <Button fullWidth onClick={() => { setSelected(null); navigate('/runs/log') }}>
                  <ChevronRight className="w-4 h-4" /> Log a run
                </Button>
              )}
              <Button variant="ghost" fullWidth onClick={() => { setSelected(null); navigate(`/challenges/${selected.id}`) }}>
                View full detail
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
