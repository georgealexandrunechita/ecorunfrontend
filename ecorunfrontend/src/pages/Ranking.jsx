import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Crown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'

const MEDAL_COLORS = [
  'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  'text-gray-300 bg-gray-300/10 border-gray-300/30',
  'text-orange-400 bg-orange-400/10 border-orange-400/30',
]

export default function Ranking() {
  const { user } = useAuth()
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userService.getRanking(50)
      .then((data) => setRanking(Array.isArray(data) ? data : []))
      .catch(() => setRanking([]))
      .finally(() => setLoading(false))
  }, [])

  const userEntry = ranking.find((r) => r.id === user?.id)

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Leaderboard</p>
          <h1 className="text-3xl font-black text-white">Seville Ranking</h1>
          <p className="text-gray-500 text-sm mt-1">Top 50 runners by EcoPoints</p>
        </motion.div>

        {/* User's own position if not in visible list */}
        {userEntry && userEntry.rank > 10 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-blue-600/10 border border-blue-600/30 rounded-2xl px-5 py-3 flex items-center gap-4"
          >
            <span className="text-xs font-black w-8 text-center text-blue-400">#{userEntry.rank}</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.name?.[0]}
            </div>
            <span className="flex-1 text-sm text-blue-300 font-semibold">You</span>
            <span className="text-sm text-blue-400 font-bold">{userEntry.eco_points?.toLocaleString()} pts</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-dark-700/60 backdrop-blur-sm border border-dark-500 rounded-2xl overflow-hidden shadow-card"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-600 text-sm">Loading…</div>
          ) : ranking.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Trophy className="w-8 h-8 text-gray-700" />
              <p className="text-gray-500 text-sm">No runners yet. Be the first!</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-500/50">
              {ranking.map((r, i) => {
                const isMe = r.id === user?.id
                const medal = i < 3 ? MEDAL_COLORS[i] : null
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${
                      isMe ? 'bg-blue-600/10' : 'hover:bg-dark-600/40'
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black border ${
                      medal ?? 'text-gray-500 bg-transparent border-transparent'
                    }`}>
                      {i === 0 ? <Crown className="w-4 h-4" /> : `#${r.rank}`}
                    </div>

                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isMe ? 'bg-blue-600 text-white' : 'bg-dark-500 text-gray-300'
                    }`}>
                      {r.name?.[0]?.toUpperCase()}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-semibold truncate block ${isMe ? 'text-blue-300' : 'text-gray-200'}`}>
                        {r.name}{isMe && <span className="ml-1.5 text-xs text-blue-500/70 font-normal">(you)</span>}
                      </span>
                    </div>

                    {/* Points */}
                    <span className={`text-sm font-bold flex-shrink-0 ${
                      i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : isMe ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      {r.eco_points?.toLocaleString()} <span className="text-xs font-normal opacity-60">pts</span>
                    </span>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
