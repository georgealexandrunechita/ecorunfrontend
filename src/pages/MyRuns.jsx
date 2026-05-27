import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, Plus, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { runService } from '../services/runService'
import Button from '../components/ui/Button'

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

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MyRuns() {
  const { user } = useAuth()
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    runService.getUserRuns(user.id)
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data ?? [])
        setRuns(list)
      })
      .catch(() => setRuns([]))
      .finally(() => setLoading(false))
  }, [user?.id])

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        <motion.button
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-white text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">History</p>
            <h1 className="text-3xl font-black text-white">My Runs</h1>
          </div>
          <Link to="/runs/log">
            <Button size="sm"><Plus className="w-4 h-4" /> Log run</Button>
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-600 text-sm">Loading…</div>
        ) : runs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="w-14 h-14 bg-dark-700 rounded-2xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-gray-600" />
            </div>
            <p className="text-gray-500 font-medium">No runs yet</p>
            <Link to="/runs/log"><Button size="sm"><Plus className="w-4 h-4" /> Log first run</Button></Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-dark-700/60 backdrop-blur-sm border border-dark-500 rounded-2xl overflow-hidden shadow-card"
          >
            <div className="divide-y divide-dark-500/50">
              {runs.map((run, i) => (
                <motion.div
                  key={run.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-dark-600/40 transition-colors"
                >
                  <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{run.run_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(run.run_date)} · {formatDuration(run.duration_minutes)} · {formatPace(run.distance_km, run.duration_minutes)} /km
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-white">{parseFloat(run.distance_km).toFixed(1)} km</p>
                    <p className="text-xs text-blue-400 font-medium">+{run.points_earned} pts</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
