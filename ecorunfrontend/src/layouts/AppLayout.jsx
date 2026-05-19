import { Outlet, Navigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import BottomTabBar from '../components/layout/BottomTabBar'
import PageTransition from '../components/ui/PageTransition'
import { PageLoader } from '../components/ui/LoadingSpinner'

function MobileTopBar() {
  const { user } = useAuth()
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-dark-800/90 backdrop-blur-xl border-b border-dark-500/40 h-14 flex items-center px-4 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-blue-500/15 after:to-transparent relative">
      <Link to="/">
        <img
          src="https://res.cloudinary.com/dcp7o3atw/image/upload/v1777834701/ecorunlogo.png"
          alt="EcoRun"
          className="h-10 w-auto"
        />
      </Link>
      {user && (
        <div className="ml-auto flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm text-white font-medium">{user.name}</span>
        </div>
      )}
    </header>
  )
}

export default function AppLayout() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  return (
    <div className="min-h-screen bg-dark-900">
      <MobileTopBar />
      <div className="hidden md:block">
        <Navbar />
      </div>

      <main className="pt-14 md:pt-16 pb-20 md:pb-0 overflow-x-hidden">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>

      <BottomTabBar />
    </div>
  )
}
