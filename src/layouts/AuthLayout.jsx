import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageLoader } from '../components/ui/LoadingSpinner'

export default function AuthLayout() {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (user) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
