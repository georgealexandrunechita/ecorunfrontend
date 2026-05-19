import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Target, Plus, Map, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const TABS = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Home' },
  { to: '/challenges', icon: Target,          label: 'Challenges' },
  { to: '/map',        icon: Map,             label: 'Map' },
]

export default function BottomTabBar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Blur background */}
      <div className="relative bg-dark-800/90 backdrop-blur-xl border-t border-dark-500/40 px-2 pb-safe">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto relative">

          {TABS.map((tab, i) => {
            // Insert FAB after index 1
            const items = []
            items.push(
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <motion.div
                      animate={{ scale: isActive ? 1.15 : 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <tab.icon className="w-5 h-5" />
                    </motion.div>
                    <span className="text-[10px] font-semibold">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute bottom-2 w-1 h-1 bg-blue-400 rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            )

            if (i === 1) {
              items.push(
                <motion.button
                  key="fab"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => navigate('/runs/log')}
                  className="w-14 h-14 bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 rounded-2xl flex items-center justify-center shadow-blue-glow -mt-5 transition-all duration-200 border border-blue-400/20"
                >
                  <Plus className="w-6 h-6 text-white" />
                </motion.button>
              )
            }

            return items
          })}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-gray-500 hover:text-red-400 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Exit</span>
          </button>

        </div>
      </div>
    </nav>
  )
}
