import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Activity, Clock, Calendar, FileText, Zap, Tag, CheckCircle2 } from 'lucide-react'
import { runService } from '../services/runService'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

function Field({ label, optional, error, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
        {label}
        {optional && <span className="ml-1 normal-case font-normal text-gray-600">(optional)</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  )
}

function NumInput({ icon: Icon, placeholder, step, min, value, onChange, error }) {
  return (
    <div className={`relative group`}>
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-400 transition-colors" />
      <input
        type="number" step={step} min={min} placeholder={placeholder}
        value={value} onChange={onChange}
        className={`w-full bg-dark-700/80 border ${error ? 'border-red-500/50' : 'border-dark-500'} hover:border-dark-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-white placeholder-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none`}
      />
    </div>
  )
}

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
  const [success, setSuccess] = useState(null)

  function set(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      if (errors[field]) setErrors((er) => ({ ...er, [field]: '' }))
    }
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
      setSuccess({ points: Math.round(parseFloat(form.distance_km) * 10), km: parseFloat(form.distance_km) })
    } catch {
      setErrors({ submit: 'Could not save your run. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  const dist = parseFloat(form.distance_km)
  const dur  = parseInt(form.duration_minutes)
  const pace = dist > 0 && dur > 0
    ? `${Math.floor(dur / dist)}:${String(Math.round(((dur / dist) % 1) * 60)).padStart(2, '0')}`
    : null
  const points = dist > 0 ? Math.round(dist * 10) : 0

  /* ── Success screen ── */
  if (success) return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative bg-dark-700/80 backdrop-blur-sm border border-dark-500 rounded-3xl p-8 max-w-sm w-full text-center overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
            className="w-16 h-16 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-5"
          >
            <CheckCircle2 className="w-8 h-8 text-blue-400" />
          </motion.div>

          <h2 className="text-2xl font-black text-white mb-1">Run logged!</h2>
          <p className="text-gray-500 text-sm mb-5">{success.km} km · {success.points} EcoPoints earned</p>

          <div className="bg-blue-600/10 border border-blue-600/20 rounded-2xl px-5 py-4 mb-6">
            <div className="text-3xl font-black text-blue-400">+{success.points}</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-medium">EcoPoints</div>
          </div>

          <p className="text-xs text-gray-600 mb-6">Active challenges have been updated automatically</p>

          <div className="flex flex-col gap-2">
            <Button fullWidth onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
            <Button variant="ghost" fullWidth onClick={() => {
              setSuccess(null)
              setForm({ run_name: '', distance_km: '', duration_minutes: '', run_date: new Date().toISOString().split('T')[0], description: '' })
            }}>
              Log another run
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )

  /* ── Form ── */
  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">

        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-white text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Training</p>
          <h1 className="text-3xl font-black text-white">Log a run</h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Distance + Duration row */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="grid grid-cols-2 gap-3"
          >
            <Field label="Distance (km)" error={errors.distance_km}>
              <NumInput icon={Activity} placeholder="5.0" step="0.1" min="0.1"
                value={form.distance_km} onChange={set('distance_km')} error={errors.distance_km} />
            </Field>
            <Field label="Duration (min)" error={errors.duration_minutes}>
              <NumInput icon={Clock} placeholder="30" step="1" min="1"
                value={form.duration_minutes} onChange={set('duration_minutes')} error={errors.duration_minutes} />
            </Field>
          </motion.div>

          {/* Live stats */}
          <AnimatePresence>
            {(pace || points > 0) && (
              <motion.div
                key="live-stats"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-3 overflow-hidden"
              >
                {pace && (
                  <div className="bg-dark-700/60 border border-dark-500 rounded-xl p-3.5 text-center">
                    <div className="text-base font-black text-white">{pace}<span className="text-xs text-gray-500 ml-1">min/km</span></div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mt-0.5">Avg pace</div>
                  </div>
                )}
                <div className="bg-blue-600/10 border border-blue-500/25 rounded-xl p-3.5 text-center">
                  <div className="text-base font-black text-blue-400">+{points}<span className="text-xs text-blue-500/60 ml-1">pts</span></div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mt-0.5">EcoPoints</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Date */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Field label="Date" error={errors.run_date}>
              <div className="relative group">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                <input
                  type="date"
                  value={form.run_date} onChange={set('run_date')}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full bg-dark-700/80 border border-dark-500 hover:border-dark-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-white rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none"
                />
              </div>
            </Field>
          </motion.div>

          {/* Name */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Field label="Run name" optional>
              <div className="relative group">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text" placeholder="Morning run, Park loop..."
                  value={form.run_name} onChange={set('run_name')}
                  className="w-full bg-dark-700/80 border border-dark-500 hover:border-dark-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-white placeholder-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none"
                />
              </div>
            </Field>
          </motion.div>

          {/* Notes */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Field label="Notes" optional>
              <div className="relative group">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-600 group-focus-within:text-blue-400 transition-colors" />
                <textarea
                  placeholder="How did it go?"
                  value={form.description} onChange={set('description')}
                  rows={3}
                  className="w-full bg-dark-700/80 border border-dark-500 hover:border-dark-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-white placeholder-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none resize-none"
                />
              </div>
            </Field>
          </motion.div>

          {errors.submit && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl py-3">
              {errors.submit}
            </p>
          )}

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Button type="submit" loading={loading} fullWidth size="lg">
              <Zap className="w-4 h-4" /> Save run
            </Button>
          </motion.div>

        </form>
      </div>
    </div>
  )
}
