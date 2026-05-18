import { Link } from 'react-router-dom'
import { GitFork, Camera, Send } from 'lucide-react'


const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Challenges', to: '/challenges' },
      { label: 'Map', to: '/map' },
      { label: 'Ranking', to: '/dashboard' },
      { label: 'EcoPoints', to: '/dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Blog', to: '/blog' },
      { label: 'Press', to: '/press' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
      { label: 'Cookies', to: '/cookies' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="https://res.cloudinary.com/dcp7o3atw/image/upload/v1777834701/ecorunlogo.png" alt="EcoRun" className="h-8 w-auto" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Run through Seville, protect the planet.<br />
              Gamification + sustainability for runners.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 bg-dark-600 hover:bg-dark-500 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <Send className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 bg-dark-600 hover:bg-dark-500 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <Camera className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 bg-dark-600 hover:bg-dark-500 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <GitFork className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-dark-500 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            © 2025 EcoRun Seville. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            Made with <span className="text-blue-500">♥</span> for eco-conscious runners
          </p>
        </div>
      </div>
    </footer>
  )
}
