import { Link } from 'react-router-dom'
import { Activity, GitBranch, MessageCircle, Camera } from 'lucide-react'


const columns = [
  {
    title: 'Producto',
    links: [
      { label: 'Retos', to: '/challenges' },
      { label: 'Mapa', to: '/map' },
      { label: 'Ranking', to: '/dashboard' },
      { label: 'EcoPuntos', to: '/dashboard' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre nosotros', to: '/about' },
      { label: 'Blog', to: '/blog' },
      { label: 'Prensa', to: '/press' },
      { label: 'Contacto', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', to: '/privacy' },
      { label: 'Términos', to: '/terms' },
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
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                Eco<span className="text-blue-400">Run</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Corre por Sevilla, cuida el planeta.<br />
              Gamificación + sostenibilidad para runners.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 bg-dark-600 hover:bg-dark-500 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 bg-dark-600 hover:bg-dark-500 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <Camera className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 bg-dark-600 hover:bg-dark-500 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <GitBranch className="w-3.5 h-3.5" />
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
            © 2025 EcoRun Sevilla. Todos los derechos reservados.
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            Hecho con <span className="text-blue-500">♥</span> para corredores eco-conscientes
          </p>
        </div>
      </div>
    </footer>
  )
}
