import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

function buildUserProfile(apiUser) {
  const points = apiUser.eco_points ?? apiUser.ecoPoints ?? 0
  const level = Math.floor(points / 200) + 1
  const levelProgress = Math.round((points % 200) / 200 * 100)
  return {
    id: apiUser.id,
    name: apiUser.name || apiUser.username,
    surname: apiUser.surname || '',
    email: apiUser.email,
    ecoPoints: points,
    level,
    levelProgress,
    streak: apiUser.streak ?? 0,
    rank: apiUser.rank ?? null,
    totalRunners: apiUser.totalRunners ?? null,
    treesaved: apiUser.trees_saved ?? apiUser.treesaved ?? Math.floor(points / 150),
    co2Avoided: apiUser.co2_avoided ?? apiUser.co2Avoided ?? parseFloat((points * 0.027).toFixed(1)),
    totalKm: apiUser.total_km ?? apiUser.totalKm ?? 0,
    totalRuns: apiUser.total_runs ?? apiUser.totalRuns ?? 0,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('ecorun_user')
    const token = localStorage.getItem('ecorun_token')
    if (stored && token) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('ecorun_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    const userData = buildUserProfile(data.user)
    localStorage.setItem('ecorun_token', data.token)
    localStorage.setItem('ecorun_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (formData) => {
    const data = await authService.register({
      username: formData.name,
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      password: formData.password,
    })
    const userData = buildUserProfile(data.user)
    localStorage.setItem('ecorun_token', data.token)
    localStorage.setItem('ecorun_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
