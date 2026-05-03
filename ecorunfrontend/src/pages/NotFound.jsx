import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-black text-blue-600/20 mb-4">404</p>
        <h1 className="text-3xl font-black text-white mb-3">Página no encontrada</h1>
        <p className="text-gray-400 mb-8">Esta ruta no existe en EcoRun. ¿Vuelta al inicio?</p>
        <Link to="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}
