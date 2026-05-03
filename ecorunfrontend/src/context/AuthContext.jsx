import { createContext, useContext, useState, useEffect } from 'react'
import { mockUser } from '../data/mock'

const AuthContext = createContext(null)

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
    // TODO: swap with authService.login(email, password)
    await new Promise((r) => setTimeout(r, 800))
    const userData = { ...mockUser, email }
    const fakeToken = 'mock-token-' + Date.now()
    localStorage.setItem('ecorun_token', fakeToken)
    localStorage.setItem('ecorun_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (data) => {
    // TODO: swap with authService.register(data)
    await new Promise((r) => setTimeout(r, 1000))
    const userData = { ...mockUser, name: data.name, surname: data.surname, email: data.email }
    const fakeToken = 'mock-token-' + Date.now()
    localStorage.setItem('ecorun_token', fakeToken)
    localStorage.setItem('ecorun_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('ecorun_token')
    localStorage.removeItem('ecorun_user')
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
