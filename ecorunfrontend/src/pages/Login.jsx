import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Leaf, Trophy, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email no válido'
    if (!form.password) e.password = 'La contraseña es obligatoria'
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
      setApiError(err?.message || 'Email o contraseña incorrectos')
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
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900/90 via-dark-900/70 to-blue-900/40" />
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
              <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-600/30 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <Leaf className="w-3 h-3" />
                Runner Verde
              </div>
              <h2 className="text-4xl font-black text-white leading-tight mb-4">
                Bienvenido de nuevo,<br />
                <span className="text-blue-400">Runner Verde</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Tus rutas te esperan. Sevilla también.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: Trophy, text: 'Tu ranking te espera' },
                  { icon: Zap, text: 'Nuevos retos disponibles' },
                  { icon: Leaf, text: 'Tu impacto eco sigue creciendo' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-gray-300 text-sm">
                    <div className="w-7 h-7 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <p className="text-gray-600 text-xs">© 2025 EcoRun Sevilla</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="https://res.cloudinary.com/dcp7o3atw/image/upload/v1777834701/ecorunlogo.png" alt="EcoRun" className="h-9 w-auto" />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Iniciar sesión</h1>
            <p className="text-gray-400">Accede a tu cuenta de EcoRun</p>
          </div>

          {apiError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              icon={Mail}
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={set('remember')}
                  className="w-4 h-4 rounded border-dark-400 bg-dark-600 accent-blue-500"
                />
                <span className="text-sm text-gray-400">Recordarme</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg" className="mt-1">
              Entrar
            </Button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-dark-500" />
            <span className="text-xs text-gray-600">O continúa con</span>
            <div className="flex-1 h-px bg-dark-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['Google', 'Facebook'].map((provider) => (
              <button
                key={provider}
                type="button"
                className="flex items-center justify-center gap-2 bg-dark-600 hover:bg-dark-500 border border-dark-400 text-gray-300 text-sm font-medium py-3 rounded-xl transition-all duration-200 active:scale-95"
              >
                {provider}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Regístrate gratis
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
