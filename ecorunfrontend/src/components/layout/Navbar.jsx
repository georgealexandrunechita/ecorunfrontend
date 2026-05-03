import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, ChevronDown, Activity } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/challenges', label: 'Retos' },
    { to: '/help', label: 'Help' },
    { to: '/about', label: 'About us' },
  ]

  const appLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/challenges', label: 'Retos' },
    { to: '/map', label: 'Mapa' },
  ]

  const links = user ? appLinks : publicLinks

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark-800/95 backdrop-blur-md border-b border-dark-500/50' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Eco<span className="text-blue-400">Run</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-dark-600 hover:bg-dark-500 border border-dark-400 rounded-xl px-3 py-2 transition-all duration-200"
                >
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-white font-medium">{user.name}</span>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-dark-700 border border-dark-500 rounded-xl shadow-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-dark-500">
                      <p className="text-sm font-medium text-white">{user.name} {user.surname}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-dark-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Mi perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-dark-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 active:scale-95"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-300 hover:text-white p-2"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-dark-800 border-t border-dark-500 px-4 py-4 flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300 hover:text-white hover:bg-dark-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="border-t border-dark-500 pt-3 mt-1 flex flex-col gap-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 text-left"
              >
                Cerrar sesión
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-300">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl text-center">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
