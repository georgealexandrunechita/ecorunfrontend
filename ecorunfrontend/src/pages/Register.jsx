import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Leaf, Trophy, Target, CheckCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const BENEFITS = [
  { icon: Trophy,       text: 'Access the Seville ranking' },
  { icon: Leaf,         text: 'Contribute to the planet every km' },
  { icon: Target,       text: 'Unlock exclusive challenges and achievements' },
  { icon: CheckCircle,  text: 'Always free, no subscriptions' },
]

export default function Register() {
  const [form, setForm] = useState({
    name: '', surname: '', email: '',
    password: '', confirmPassword: '', terms: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'First name is required'
    if (!form.surname.trim()) e.surname = 'Last name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!form.terms) e.terms = 'You must accept the terms'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) return setErrors(e2)
    setLoading(true)
    setApiError('')
    try {
      await register({ name: form.name, surname: form.surname, email: form.email, password: form.password })
      navigate('/dashboard')
    } catch (err) {
      setApiError(err?.message || 'Error creating account')
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
      <div className="hidden lg:flex lg:w-5/12 xl:w-[42%] relative overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-800 via-dark-900 to-[#040d10]" />

        {/* Ambient blobs */}
        <div className="absolute -top-24 -right-24 w-[380px] h-[380px] bg-emerald-600/10 rounded-full blur-[90px]" />
        <div className="absolute bottom-0 -left-16 w-[280px] h-[280px] bg-blue-600/10 rounded-full blur-[70px]" />
        <div className="absolute top-1/2 right-1/4 w-[150px] h-[150px] bg-sky-600/6 rounded-full blur-[50px]" />

        {/* Abstract running-path art */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.065] pointer-events-none">
          <svg viewBox="0 0 400 500" className="w-[300px] h-[380px]">
            {/* Route-like dots */}
            {[80,120,155,185,210,240,265,295,320,350].map((y, i) => (
              <circle key={i} cx={100 + (i % 2 === 0 ? 40 : -40) + i * 20} cy={y} r="3" fill="white" />
            ))}
            {/* Connecting path */}
            <path d="M100,80 Q200,100 160,120 Q120,140 200,155 Q280,170 220,185 Q160,200 240,210 Q320,220 265,240 Q210,260 295,265 Q380,270 320,295 Q260,320 350,350"
              fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="5 8" />
            {/* Start/end markers */}
            <circle cx="100" cy="80" r="6" fill="none" stroke="white" strokeWidth="1.5" />
            <circle cx="350" cy="350" r="6" fill="white" />
          </svg>
        </div>

        {/* Top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />

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
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Join the community
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-3">
              Discover your<br />
              <span className="bg-gradient-to-r from-emerald-400 to-sky-300 bg-clip-text text-transparent">ECO-RUNNER</span><br />
              potential
            </h2>
            <p className="text-gray-400 mb-10 text-sm leading-relaxed">
              Over 1,800 runners in Seville are already<br />running for the planet.
            </p>

            <div className="flex flex-col gap-4">
              {BENEFITS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/12 border border-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-gray-300 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <p className="text-gray-700 text-xs">© 2025 EcoRun Seville</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto relative">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-600/4 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md py-8 relative"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="https://res.cloudinary.com/dcp7o3atw/image/upload/v1777834701/ecorunlogo.png" alt="EcoRun" className="h-9 w-auto" />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Create account</h1>
            <p className="text-gray-500">Get started for free in under 1 minute</p>
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First name"
                placeholder="Alex"
                icon={User}
                value={form.name}
                onChange={set('name')}
                error={errors.name}
                autoComplete="given-name"
              />
              <Input
                label="Last name"
                placeholder="Smith"
                value={form.surname}
                onChange={set('surname')}
                error={errors.surname}
                autoComplete="family-name"
              />
            </div>

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
              placeholder="Minimum 8 characters"
              icon={Lock}
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              autoComplete="new-password"
            />

            <Input
              label="Confirm password"
              type="password"
              placeholder="Repeat password"
              icon={Lock}
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={set('terms')}
                  className="w-4 h-4 mt-0.5 rounded border-dark-400 bg-dark-600 accent-blue-500 flex-shrink-0"
                />
                <span className="text-sm text-gray-500">
                  I accept the{' '}
                  <Link to="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">Terms of use</Link>
                  {' '}and the{' '}
                  <Link to="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy policy</Link>
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-400 mt-1.5">{errors.terms}</p>}
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
              Create my account <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
