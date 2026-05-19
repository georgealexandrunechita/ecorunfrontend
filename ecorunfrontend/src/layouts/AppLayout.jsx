import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import BottomTabBar from '../components/layout/BottomTabBar'
import { PageLoader } from '../components/ui/LoadingSpinner'

export default function AppLayout() {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Top navbar — desktop only */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      <main className="md:pt-16 pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Bottom tab bar — mobile only */}
      <BottomTabBar />
    </div>
  )
}
