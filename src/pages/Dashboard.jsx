import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Leaf, Trophy, Flame, MapPin, Wind,
  ChevronRight, Sparkles, Medal, Target, Plus, Activity
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { runService } from '../services/runService'
import { challengeService } from '../services/challengeService'
import { userService } from '../services/userService'
import ProgressBar from '../components/ui/ProgressBar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const STAT_COLORS = {
  blue:   { text: 'text-blue-400',    bg: 'bg-blue-500/10',    glow: 'group-hover:shadow-[0_4px_24px_rgba(59,130,246,0.15)]',   border: 'group-hover:border-blue-500/30' },
  green:  { text: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'group-hover:shadow-[0_4px_24px_rgba(16,185,129,0.15)]',  border: 'group-hover:border-emerald-500/30' },
  yellow: { text: 'text-yellow-400',  bg: 'bg-yellow-500/10',  glow: 'group-hover:shadow-[0_4px_24px_rgba(234,179,8,0.15)]',   border: 'group-hover:border-yellow-500/30' },
  orange: { text: 'text-orange-400',  bg: 'bg-orange-500/10',  glow: 'group-hover:shadow-[0_4px_24px_rgba(249,115,22,0.15)]',  border: 'group-hover:border-orange-500/30' },
}

function StatCard({ icon: Icon, label, value, sub, color = 'blue' }) {
  const c = STAT_COLORS[color]
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`group relative bg-dark-700/80 border border-dark-500 rounded-2xl p-5 shadow-card transition-all duration-300 ${c.glow} ${c.border} overflow-hidden`}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className={`w-5 h-5 ${c.text}`} />
      </div>
      <div className={`text-2xl font-black mb-0.5 ${c.text}`}>{value}</div>
      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </motion.div>
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

const RANK_COLORS = ['text-yellow-400', 'text-gray-300', 'text-orange-400']

export default function Dashboard() {
  const { user } = useAuth()
  const [userRank, setUserRank] = useState(null)
  const [streak, setStreak] = useState(0)
  const [totalKm, setTotalKm] = useState(0)
  const [totalRuns, setTotalRuns] = useState(0)
  const [runs, setRuns] = useState([])
  const [nextChallenge, setNextChallenge] = useState(null)
  const [ranking, setRanking] = useState([])
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    if (!user?.id) return

    runService.getUserRuns(user.id)
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data ?? [])
        setRuns(list.slice(0, 3))
      })
      .catch(() => setRuns([]))

    challengeService.getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setNextChallenge(data[0])
      })
      .catch(() => {})

    userService.getRanking(3)
      .then((data) => setRanking(Array.isArray(data) ? data : []))
      .catch(() => {})

    userService.getAchievements(user.id)
      .then((data) => {
        setAchievements(Array.isArray(data?.achievements) ? data.achievements : [])
        if (data?.rank != null) setUserRank(data.rank)
        if (data?.streak != null) setStreak(data.streak)
        if (data?.total_km != null) setTotalKm(parseFloat(data.total_km))
        if (data?.run_count != null) setTotalRuns(data.run_count)
      })
      .catch(() => {})
  }, [user?.id])

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-gray-600 text-sm font-medium mb-1">Welcome back</p>
          <h1 className="text-4xl font-black tracking-tight text-white">
            {user?.name} <span className="text-blue-400">{user?.surname}</span>
          </h1>
        </motion.div>

        {/* EcoPoints hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="relative bg-dark-700/60 backdrop-blur-sm border border-dark-500 rounded-3xl p-6 md:p-8 mb-6 overflow-hidden shadow-card"
        >
          {/* Top border gradient */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          {/* Ambient glow */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Ring + Points */}
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="url(#blueGrad)" strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - (user?.levelProgress || 0) / 100)}`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest">LVL</span>
                  <span className="text-3xl font-black text-white leading-none">{user?.level ?? 1}</span>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">EcoPoints</p>
                <p className="text-5xl font-black text-white tracking-tight leading-none">
                  {(user?.ecoPoints ?? 0).toLocaleString()}
                  <span className="text-lg text-blue-400 font-semibold ml-2">pts</span>
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <ProgressBar value={user?.levelProgress} className="w-28" />
                  <span className="text-xs text-gray-600">{user?.levelProgress ?? 0}%</span>
                </div>
              </div>
            </div>

            {/* Impact stats */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Trees saved',    value: user?.treesaved ?? 0,                 icon: Leaf,   color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'kg CO₂ avoided', value: `${user?.co2Avoided ?? 0}`,           icon: Wind,   color: 'text-sky-400',     bg: 'bg-sky-500/10' },
                { label: 'Seville rank',   value: userRank != null ? `#${userRank}` : '—',   icon: Trophy, color: 'text-yellow-400',  bg: 'bg-yellow-500/10' },
                { label: 'Day streak',     value: streak,                    icon: Flame,  color: 'text-orange-400',  bg: 'bg-orange-500/10' },
              ].map((item) => (
                <div key={item.label} className={`${item.bg} rounded-2xl p-4 text-center border border-white/[0.04]`}>
                  <item.icon className={`w-4 h-4 mx-auto mb-2 ${item.color}`} />
                  <div className={`text-xl font-black ${item.color}`}>{item.value}</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wide mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="relative flex flex-wrap gap-2 mt-6 pt-5 border-t border-white/[0.06]">
            <Link to="/runs/log">
              <Button size="sm"><Plus className="w-4 h-4" />Log run</Button>
            </Link>
            <Link to="/challenges">
              <Button variant="ghost" size="sm"><Target className="w-4 h-4" />Challenges</Button>
            </Link>
            <Link to="/map">
              <Button variant="ghost" size="sm"><MapPin className="w-4 h-4" />Map</Button>
            </Link>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Recent runs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="lg:col-span-2 bg-dark-700/60 backdrop-blur-sm border border-dark-500 rounded-2xl p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-white">Recent runs</h2>
              <div className="flex items-center gap-3">
                <Link to="/runs" className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors">
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
                <Link to="/runs/log" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                  Log new <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {runs.length > 0 ? (
              <div className="flex flex-col divide-y divide-dark-500/50">
                {runs.map((run) => (
                  <div key={run.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate leading-tight">{run.run_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {parseFloat(run.distance_km)} km · {formatDuration(run.duration_minutes)} · {formatPace(run.distance_km, run.duration_minutes)} /km
                      </p>
                    </div>
                    <span className="text-xs font-bold text-blue-400 flex-shrink-0">+{run.points_earned} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 bg-dark-600 rounded-2xl flex items-center justify-center mb-3">
                  <Activity className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No runs yet</p>
                <p className="text-gray-600 text-xs mt-1">Log your first run to get started</p>
                <Link to="/runs/log" className="mt-4">
                  <Button size="sm"><Plus className="w-4 h-4" />Log first run</Button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Side column */}
          <div className="flex flex-col gap-4">

            {/* Next challenge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-dark-700/60 backdrop-blur-sm border border-dark-500 rounded-2xl p-5 shadow-card"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white text-sm">Next challenge</h2>
                <Target className="w-4 h-4 text-gray-600" />
              </div>
              {nextChallenge ? (
                <div>
                  <p className="font-bold text-white text-sm leading-tight mb-1">{nextChallenge.name}</p>
                  <p className="text-xs text-gray-500 mb-4">
                    {nextChallenge.zone ? `${nextChallenge.zone}, Sevilla` : 'Sevilla'} · {parseFloat(nextChallenge.goal_value)} km
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="blue">{nextChallenge.reward_points} pts</Badge>
                    <Link to="/challenges">
                      <Button size="sm">Join <ChevronRight className="w-3 h-3" /></Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No active challenges</p>
              )}
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-dark-700/60 backdrop-blur-sm border border-dark-500 rounded-2xl p-5 shadow-card"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white text-sm">Achievements</h2>
                <span className="text-xs text-gray-600">{achievements.filter(a => a.unlocked).length}/{achievements.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    title={a.name}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                      a.unlocked
                        ? 'bg-blue-500/15 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                        : 'bg-dark-600/50 opacity-25 grayscale border border-transparent'
                    }`}
                  >
                    {a.icon}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Ranking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-dark-700/60 backdrop-blur-sm border border-dark-500 rounded-2xl p-5 shadow-card"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white text-sm">Seville Ranking</h2>
                <Medal className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex flex-col gap-1">
                {ranking.map((r, i) => (
                  <div key={r.rank} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-dark-600/40 transition-colors">
                    <span className={`text-xs font-black w-5 text-center ${RANK_COLORS[i] || 'text-gray-500'}`}>
                      #{r.rank}
                    </span>
                    <div className="w-7 h-7 bg-dark-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {r.name[0]}
                    </div>
                    <span className="flex-1 text-sm text-gray-300 truncate">{r.name}</span>
                    <span className="text-xs text-gray-500 font-medium">{r.eco_points?.toLocaleString()}</span>
                  </div>
                ))}
                <div className="mt-1 pt-2 border-t border-dark-500/50">
                  <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-blue-600/10 border border-blue-600/20">
                    <span className="text-xs font-black w-5 text-center text-blue-400">
                      {userRank != null ? `#${userRank}` : '—'}
                    </span>
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {user?.name?.[0]}
                    </div>
                    <span className="flex-1 text-sm text-blue-400 font-semibold">You</span>
                    <span className="text-xs text-blue-400/70 font-medium">{(user?.ecoPoints ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5"
        >
          <StatCard icon={MapPin}   label="Total distance"  value={`${totalKm.toFixed(1)} km`}  color="blue" />
          <StatCard icon={Flame}    label="Total runs"       value={totalRuns}                    color="orange" />
          <StatCard icon={Wind}     label="CO₂ saved"        value={`${user?.co2Avoided ?? 0} kg`}    color="green" />
          <StatCard icon={Sparkles} label="Current level"    value={`Lvl ${user?.level ?? 1}`}        color="yellow"
            sub={`${user?.levelProgress ?? 0}% to next`} />
        </motion.div>

      </div>
    </div>
  )
}
