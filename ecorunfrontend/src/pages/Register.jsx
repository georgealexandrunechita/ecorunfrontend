import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Leaf, Trophy, Target, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

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

  const benefits = [
    { icon: Trophy, text: 'Access the Seville ranking' },
    { icon: Leaf, text: 'Contribute to the planet every km' },
    { icon: Target, text: 'Unlock exclusive challenges and achievements' },
    { icon: CheckCircle, text: 'Always free, no subscriptions' },
  ]

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900/90 via-dark-900/75 to-blue-900/30" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://res.cloudinary.com/dcp7o3atw/image/upload/v1777834701/ecorunlogo.png" alt="EcoRun" className="h-10 w-auto" />
          </Link>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <Leaf className="w-3 h-3" />
                Join the community
              </div>
              <h2 className="text-4xl font-black text-white leading-tight mb-4">
                Discover your<br />
                <span className="text-blue-400">ECO-RUNNER potential</span>
              </h2>
              <p className="text-gray-400 mb-8">
                Over 1,800 runners in Seville are already running for the planet.
              </p>
              <div className="flex flex-col gap-4">
                {benefits.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <p className="text-gray-600 text-xs">© 2025 EcoRun Seville</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md py-8"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="https://res.cloudinary.com/dcp7o3atw/image/upload/v1777834701/ecorunlogo.png" alt="EcoRun" className="h-9 w-auto" />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Create account</h1>
            <p className="text-gray-400">Get started for free in under 1 minute</p>
          </div>

          {apiError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
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
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={set('terms')}
                  className="w-4 h-4 mt-0.5 rounded border-dark-400 bg-dark-600 accent-blue-500 flex-shrink-0"
                />
                <span className="text-sm text-gray-400">
                  I accept the{' '}
                  <Link to="/terms" className="text-blue-400 hover:text-blue-300">Terms of use</Link>
                  {' '}and the{' '}
                  <Link to="/privacy" className="text-blue-400 hover:text-blue-300">Privacy policy</Link>
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-400 mt-1">{errors.terms}</p>}
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
              Create my account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
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
