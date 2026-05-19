import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Leaf, Trophy, Target, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const PERKS = [
  { icon: Trophy, text: 'Your ranking awaits' },
  { icon: Target, text: 'New challenges available' },
  { icon: Leaf,   text: 'Your eco impact keeps growing' },
]

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) return setErrors(e2)
    setLoading(true)
    setApiError('')
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setApiError(err?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: '' }))
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-800 via-dark-900 to-[#060610]" />

        {/* Ambient blobs */}
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] bg-blue-600/12 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[320px] h-[320px] bg-blue-500/8 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-emerald-600/6 rounded-full blur-[60px]" />

        {/* Abstract ring art */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none select-none">
          <svg viewBox="0 0 400 400" className="w-[360px] h-[360px]">
            <circle cx="200" cy="200" r="160" fill="none" stroke="white" strokeWidth="1" />
            <circle cx="200" cy="200" r="120" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="8 12" />
            <circle cx="200" cy="200" r="80"  fill="none" stroke="white" strokeWidth="1" />
            <circle cx="200" cy="200" r="40"  fill="none" stroke="white" strokeWidth="0.5" />
            <line x1="40"  y1="200" x2="360" y2="200" stroke="white" strokeWidth="0.5" opacity="0.5" />
            <line x1="200" y1="40"  x2="200" y2="360" stroke="white" strokeWidth="0.5" opacity="0.5" />
            <circle cx="200" cy="40"  r="3" fill="white" />
            <circle cx="200" cy="360" r="3" fill="white" />
            <circle cx="40"  cy="200" r="3" fill="white" />
            <circle cx="360" cy="200" r="3" fill="white" />
          </svg>
        </div>

        {/* Top gradient arc */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/">
            <img src="https://res.cloudinary.com/dcp7o3atw/image/upload/v1777834701/ecorunlogo.png" alt="EcoRun" className="h-10 w-auto" />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              Green Runner
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-3">
              Welcome back,<br />
              <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">Green Runner</span>
            </h2>
            <p className="text-gray-400 text-base mb-10 leading-relaxed">
              Your routes are waiting.<br />So is Seville.
            </p>

            <div className="flex flex-col gap-4">
              {PERKS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/15 border border-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-gray-300 text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <p className="text-gray-700 text-xs">© 2025 EcoRun Seville</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        {/* Subtle ambient on right */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="https://res.cloudinary.com/dcp7o3atw/image/upload/v1777834701/ecorunlogo.png" alt="EcoRun" className="h-9 w-auto" />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Sign in</h1>
            <p className="text-gray-500">Access your EcoRun account</p>
          </div>

          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6"
            >
              {apiError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@email.com"
              icon={Mail}
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={set('remember')}
                  className="w-4 h-4 rounded border-dark-400 bg-dark-600 accent-blue-500"
                />
                <span className="text-sm text-gray-500">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg" className="mt-1">
              Sign in <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-dark-600" />
            <span className="text-xs text-gray-700 font-medium">Or</span>
            <div className="flex-1 h-px bg-dark-600" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['Google', 'Facebook'].map((provider) => (
              <button
                key={provider}
                type="button"
                className="flex items-center justify-center gap-2 bg-dark-700/80 hover:bg-dark-600 border border-dark-500 hover:border-dark-400 text-gray-400 hover:text-gray-200 text-sm font-medium py-3 rounded-xl transition-all duration-200 active:scale-95"
              >
                {provider}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
