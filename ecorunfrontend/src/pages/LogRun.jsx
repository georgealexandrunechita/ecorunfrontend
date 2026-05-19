import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Activity, Clock, MapPin, FileText, Zap } from 'lucide-react'
import { runService } from '../services/runService'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function LogRun() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    run_name: '',
    distance_km: '',
    duration_minutes: '',
    run_date: new Date().toISOString().split('T')[0],
    description: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function validate() {
    const e = {}
    if (!form.distance_km || parseFloat(form.distance_km) <= 0) e.distance_km = 'Enter a valid distance'
    if (!form.duration_minutes || parseInt(form.duration_minutes) <= 0) e.duration_minutes = 'Enter a valid duration'
    if (!form.run_date) e.run_date = 'Select a date'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    const dateTime = `${form.run_date}T08:00:00.000Z`
    const endDateTime = `${form.run_date}T${String(8 + Math.floor(parseInt(form.duration_minutes) / 60)).padStart(2, '0')}:${String(parseInt(form.duration_minutes) % 60).padStart(2, '0')}:00.000Z`

    try {
      await runService.logRun({
        user_id: user.id,
        run_name: form.run_name || `Run ${new Date(form.run_date).toLocaleDateString()}`,
        distance_km: parseFloat(form.distance_km),
        duration_minutes: parseInt(form.duration_minutes),
        start_time: dateTime,
        end_time: endDateTime,
        run_date: dateTime,
        description: form.description || null,
      })
      setSuccess(true)
    } catch {
      setErrors({ submit: 'Could not save your run. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  const pace = form.distance_km && form.duration_minutes
    ? (() => {
        const p = parseInt(form.duration_minutes) / parseFloat(form.distance_km)
        return `${Math.floor(p)}:${String(Math.round((p % 1) * 60)).padStart(2, '0')} min/km`
      })()
    : null

  const points = form.distance_km ? Math.round(parseFloat(form.distance_km) * 10) : 0

  if (success) return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark-700 border border-dark-500 rounded-2xl p-8 max-w-sm w-full text-center"
      >
        <div className="text-5xl mb-4">🏃</div>
        <h2 className="text-xl font-black text-white mb-2">Run logged!</h2>
        <p className="text-gray-400 text-sm mb-1">+{points} EcoPoints earned</p>
        <p className="text-xs text-gray-600 mb-6">Your active challenges have been updated</p>
        <div className="flex flex-col gap-2">
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          <Button variant="ghost" onClick={() => { setSuccess(false); setForm({ run_name: '', distance_km: '', duration_minutes: '', run_date: new Date().toISOString().split('T')[0], description: '' }) }}>
            Log another run
          </Button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">

        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-1">Training</p>
          <h1 className="text-3xl font-black text-white">Log a run</h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Distance + Duration */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                Distance (km)
              </label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="number" step="0.1" min="0.1" placeholder="5.0"
                  value={form.distance_km} onChange={set('distance_km')}
                  className="w-full bg-dark-600 border border-dark-400 text-white placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              {errors.distance_km && <p className="text-red-400 text-xs mt-1">{errors.distance_km}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                Duration (min)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="number" min="1" placeholder="30"
                  value={form.duration_minutes} onChange={set('duration_minutes')}
                  className="w-full bg-dark-600 border border-dark-400 text-white placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              {errors.duration_minutes && <p className="text-red-400 text-xs mt-1">{errors.duration_minutes}</p>}
            </div>
          </motion.div>

          {/* Live stats */}
          {(pace || points > 0) && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-2 gap-3">
              {pace && (
                <div className="bg-dark-700 border border-dark-500 rounded-xl p-3 text-center">
                  <div className="text-sm font-bold text-white">{pace}</div>
                  <div className="text-xs text-gray-500">Avg pace</div>
                </div>
              )}
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-3 text-center">
                <div className="text-sm font-bold text-blue-400">+{points} pts</div>
                <div className="text-xs text-gray-500">EcoPoints</div>
              </div>
            </motion.div>
          )}

          {/* Date */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Date</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={form.run_date} onChange={set('run_date')}
                max={new Date().toISOString().split('T')[0]}
                className="w-full bg-dark-600 border border-dark-400 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            {errors.run_date && <p className="text-red-400 text-xs mt-1">{errors.run_date}</p>}
          </motion.div>

          {/* Name (optional) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
              Name <span className="text-gray-600 normal-case font-normal">(optional)</span>
            </label>
            <Input
              placeholder="Morning run, Park loop..."
              value={form.run_name} onChange={set('run_name')}
            />
          </motion.div>

          {/* Notes (optional) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
              Notes <span className="text-gray-600 normal-case font-normal">(optional)</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <textarea
                placeholder="How did it go?"
                value={form.description} onChange={set('description')}
                rows={3}
                className="w-full bg-dark-600 border border-dark-400 text-white placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>
          </motion.div>

          {errors.submit && (
            <p className="text-red-400 text-sm text-center">{errors.submit}</p>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Saving...' : <><Zap className="w-4 h-4" /> Save run</>}
            </Button>
          </motion.div>

        </form>
      </div>
    </div>
  )
}
