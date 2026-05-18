import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Leaf, Trophy, Flame, MapPin, Wind, Share2,
  ChevronRight, Sparkles, Medal, Target
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { runService } from '../services/runService'
import { challengeService } from '../services/challengeService'
import { userService } from '../services/userService'
import { mockAchievements } from '../data/mock'
import ProgressBar from '../components/ui/ProgressBar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

function StatCard({ icon: Icon, label, value, sub, color = 'blue' }) {
  const colors = {
    blue:   'text-blue-400 bg-blue-500/10',
    green:  'text-emerald-400 bg-emerald-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
    orange: 'text-orange-400 bg-orange-500/10',
  }
  return (
    <div className="bg-dark-700 border border-dark-500 rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-black text-white mb-0.5">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  )
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function formatPace(distanceKm, durationMinutes) {
  if (!distanceKm || !durationMinutes) return '--'
  const paceMin = durationMinutes / distanceKm
  const min = Math.floor(paceMin)
  const sec = Math.round((paceMin - min) * 60).toString().padStart(2, '0')
  return `${min}:${sec}`
}

export default function Dashboard() {
  const { user } = useAuth()
  const [runs, setRuns] = useState([])
  const [nextChallenge, setNextChallenge] = useState(null)
  const [ranking, setRanking] = useState([])
  const unlockedAchievements = mockAchievements.filter(a => a.unlocked)

  useEffect(() => {
    if (!user?.id) return

    runService.getUserRuns(user.id)
      .then((data) => setRuns(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setRuns([]))

    challengeService.getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setNextChallenge(data[0])
      })
      .catch(() => {})

    userService.getRanking(3)
      .then((data) => setRanking(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [user?.id])

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-gray-500 text-sm mb-1">Welcome back</p>
          <h1 className="text-3xl font-black text-white">
            {user?.name} <span className="text-blue-400">{user?.surname}</span>
          </h1>
        </motion.div>

        {/* Main EcoPoints block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-900/40 via-dark-700 to-dark-700 border border-blue-600/30 rounded-3xl p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Points + Level */}
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - (user?.levelProgress || 0) / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-500 font-medium">LVL.</span>
                  <span className="text-2xl font-black text-white">{user?.level}</span>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">My EcoPoints</p>
                <p className="text-5xl font-black text-white">
                  {(user?.ecoPoints ?? 0).toLocaleString()}
                  <span className="text-xl text-blue-400 font-semibold ml-2">pts</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <ProgressBar value={user?.levelProgress} className="w-32" />
                  <span className="text-xs text-gray-500">{user?.levelProgress}% to next level</span>
                </div>
              </div>
            </div>

            {/* Impact stats */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Trees saved',    value: user?.treesaved,              icon: Leaf,      color: 'text-emerald-400' },
                { label: 'kg CO₂ avoided', value: `${user?.co2Avoided ?? 0}kg`, icon: Wind, color: 'text-blue-400' },
                { label: 'Seville rank',   value: user?.rank ? `#${user.rank}` : '—', icon: Trophy, color: 'text-yellow-400' },
                { label: 'Day streak',     value: `${user?.streak ?? 0}🔥`,     icon: Flame,     color: 'text-orange-400' },
              ].map((item) => (
                <div key={item.label} className="bg-dark-800/60 rounded-2xl p-4 text-center">
                  <item.icon className={`w-5 h-5 mx-auto mb-2 ${item.color}`} />
                  <div className="text-xl font-black text-white">{item.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-dark-500/50">
            <Link to="/challenges">
              <Button size="sm">
                <Target className="w-4 h-4" />
                View challenges
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
              Share achievement
            </Button>
            <Link to="/challenges">
              <Button variant="secondary" size="sm">
                <Trophy className="w-4 h-4" />
                View ranking
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Grid bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent runs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-dark-700 border border-dark-500 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Recent runs</h2>
              <Link to="/challenges" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {runs.length > 0 ? (
              <div className="flex flex-col gap-4">
                {runs.map((run) => (
                  <div key={run.id} className="flex items-center gap-4 p-3 bg-dark-800/50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-white truncate">{run.run_name}</p>
                        <span className="text-xs text-blue-400 font-bold ml-2 flex-shrink-0">+{run.points_earned} pts</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{parseFloat(run.distance_km)} km</span>
                        <span>·</span>
                        <span>{formatDuration(run.duration_minutes)}</span>
                        <span>·</span>
                        <span>{formatPace(run.distance_km, run.duration_minutes)} /km</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-4xl mb-3">🏃</p>
                <p className="text-gray-400 text-sm">No runs yet. Start your first one!</p>
              </div>
            )}
          </motion.div>

          {/* Side cards */}
          <div className="flex flex-col gap-6">

            {/* Next challenge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-dark-700 border border-dark-500 rounded-2xl p-5"
            >
              <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Next challenge</h2>
              {nextChallenge ? (
                <div>
                  <p className="font-bold text-white mb-1">{nextChallenge.name}</p>
                  <p className="text-xs text-gray-500 mb-3">
                    {nextChallenge.zone ? `${nextChallenge.zone}, Sevilla` : 'Sevilla'} · {parseFloat(nextChallenge.goal_value)} km
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="blue">{nextChallenge.reward_points} pts</Badge>
                    <Link to="/challenges">
                      <Button size="sm">Start</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No active challenges</p>
              )}
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-dark-700 border border-dark-500 rounded-2xl p-5"
            >
              <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Achievements</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {mockAchievements.map((a) => (
                  <div
                    key={a.id}
                    title={a.name}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      a.unlocked ? 'bg-blue-600/20' : 'bg-dark-600 opacity-30 grayscale'
                    }`}
                  >
                    {a.icon}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">{unlockedAchievements.length}/{mockAchievements.length} unlocked</p>
            </motion.div>

            {/* Ranking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-dark-700 border border-dark-500 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Seville Ranking</h2>
                <Medal className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex flex-col gap-2">
                {ranking.map((r) => (
                  <div key={r.rank} className="flex items-center gap-3 p-2 rounded-lg">
                    <span className="text-xs font-black w-6 text-center text-yellow-400">#{r.rank}</span>
                    <div className="w-7 h-7 bg-dark-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {r.name[0]}
                    </div>
                    <span className="flex-1 text-sm text-gray-300">{r.name}</span>
                    <span className="text-xs text-gray-500">{r.eco_points.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-dark-500 pt-2 mt-1">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-600/10 border border-blue-600/20">
                    <span className="text-xs font-black w-6 text-center text-blue-400">
                      {user?.rank ? `#${user.rank}` : '—'}
                    </span>
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {user?.name?.[0]}
                    </div>
                    <span className="flex-1 text-sm text-blue-400 font-semibold">You</span>
                    <span className="text-xs text-gray-400">{(user?.ecoPoints ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
        >
          <StatCard icon={MapPin}     label="Total kilometers"  value={`${user?.totalKm ?? 0} km`}         color="blue" />
          <StatCard icon={Flame}      label="Total runs"        value={user?.totalRuns ?? runs.length}      color="orange" />
          <StatCard icon={Wind}       label="CO₂ impact"        value={`${user?.co2Avoided ?? 0} kg`}       color="green" />
          <StatCard icon={Sparkles}   label="Current level"     value={`Level ${user?.level ?? 1}`} sub={`${user?.levelProgress ?? 0}% completed`} color="yellow" />
        </motion.div>

      </div>
    </div>
  )
}
