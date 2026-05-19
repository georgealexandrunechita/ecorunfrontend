import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import BottomTabBar from '../components/layout/BottomTabBar'
import PageTransition from '../components/ui/PageTransition'
import { PageLoader } from '../components/ui/LoadingSpinner'

export default function AppLayout() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  return (
    <div className="min-h-screen bg-dark-900">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <main className="md:pt-16 pb-20 md:pb-0 overflow-x-hidden">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>

      <BottomTabBar />
    </div>
  )
}
