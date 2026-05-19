import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, MapPin, Trophy, Users, Target, Activity,
  Repeat, Timer, Sprout, Award, Zap, ChevronRight, Calendar
} from 'lucide-react'
import { challengeService } from '../services/challengeService'
import { useAuth } from '../context/AuthContext'
import ProgressBar from '../components/ui/ProgressBar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const statusConfig = {
  in_progress: { label: 'In progress', variant: 'blue' },
  completed:   { label: 'Completed',   variant: 'green' },
  available:   { label: 'Available',   variant: 'gray' },
}

const CATEGORY_ICONS = {
  Distancia:  Activity,
  Frecuencia: Repeat,
  Velocidad:  Timer,
  Iniciación: Sprout,
}

function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || Award
}

export default function ChallengeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [challenge, setChallenge] = useState(null)
  const [userChallenge, setUserChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchChallenge = challengeService.getById(id)
    const fetchUserChallenges = user?.id
      ? challengeService.getUserChallenges(user.id).catch(() => [])
      : Promise.resolve([])

    Promise.all([fetchChallenge, fetchUserChallenges])
      .then(([c, mine]) => {
        setChallenge(c)
        if (Array.isArray(mine)) {
          const uc = mine.find((m) => m.challenge_id === c.id)
          setUserChallenge(uc || null)
        }
      })
      .catch(() => setError('Could not load challenge.'))
      .finally(() => setLoading(false))
  }, [id, user?.id])

  async function handleJoin() {
    setJoining(true)
    try {
      await challengeService.join(id)
      setUserChallenge({ status: 'in_progress', progress: 0 })
    } catch {
      setError('Could not join the challenge. Try again.')
    } finally {
      setJoining(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error || !challenge) return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4">
      <p className="text-red-400">{error || 'Challenge not found.'}</p>
      <Button variant="ghost" onClick={() => navigate('/challenges')}>
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>
    </div>
  )

  const status = userChallenge?.status || 'available'
  const progress = userChallenge?.progress ?? 0
  const statusCfg = statusConfig[status] || statusConfig.available
  const CategoryIcon = getCategoryIcon(challenge.category)

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/challenges')}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to challenges
        </motion.button>

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-700 border border-dark-500 rounded-2xl p-6 mb-4"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CategoryIcon className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white leading-tight mb-1">{challenge.name}</h1>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {challenge.zone ? `${challenge.zone}, Sevilla` : 'Sevilla'}
                </div>
              </div>
            </div>
            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[challenge.category, challenge.difficulty, challenge.goal_type].filter(Boolean).map((tag) => (
              <span key={tag} className="text-xs bg-dark-600 text-gray-400 px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>

          {/* Description */}
          {challenge.description && (
            <p className="text-gray-400 text-sm leading-relaxed">{challenge.description}</p>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-4"
        >
          {[
            { icon: Target,  label: 'Goal',     value: `${challenge.goal_value} ${challenge.goal_type === 'distance' ? 'km' : 'runs'}`, color: 'text-blue-400' },
            { icon: Trophy,  label: 'EcoPoints', value: `${challenge.reward_points} pts`,                                               color: 'text-yellow-400' },
            { icon: Users,   label: 'Runners',   value: challenge.participants ?? 0,                                                    color: 'text-emerald-400' },
          ].map((s) => (
            <div key={s.label} className="bg-dark-700 border border-dark-500 rounded-2xl p-4 flex flex-col items-center text-center gap-1">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <div className="text-lg font-black text-white">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Dates */}
        {(challenge.start_date || challenge.end_date) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-dark-700 border border-dark-500 rounded-2xl p-4 mb-4 flex items-center gap-3"
          >
            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="text-sm text-gray-400">
              {challenge.start_date && <span>From <span className="text-white">{new Date(challenge.start_date).toLocaleDateString()}</span></span>}
              {challenge.start_date && challenge.end_date && <span> · </span>}
              {challenge.end_date && <span>Until <span className="text-white">{new Date(challenge.end_date).toLocaleDateString()}</span></span>}
            </div>
          </motion.div>
        )}

        {/* Progress (if joined) */}
        {status === 'in_progress' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-700 border border-dark-500 rounded-2xl p-5 mb-4"
          >
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-400 font-medium">Your progress</span>
              <span className="text-white font-bold">{progress}%</span>
            </div>
            <ProgressBar value={progress} color="blue" size="md" />
            <p className="text-xs text-gray-600 mt-2">Keep running to complete this challenge!</p>
          </motion.div>
        )}

        {status === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 mb-4 text-center"
          >
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-emerald-400 font-bold">Challenge completed!</p>
            <p className="text-sm text-gray-500 mt-1">You earned {challenge.reward_points} EcoPoints</p>
          </motion.div>
        )}

        {/* Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {status === 'available' && (
            <Button fullWidth onClick={handleJoin} disabled={joining}>
              {joining ? 'Joining...' : <><Zap className="w-4 h-4" /> Join this challenge</>}
            </Button>
          )}
          {status === 'in_progress' && (
            <Button fullWidth>
              <ChevronRight className="w-4 h-4" /> Continue challenge
            </Button>
          )}
          {status === 'completed' && (
            <Button variant="ghost" fullWidth onClick={() => navigate('/challenges')}>
              Back to challenges
            </Button>
          )}
        </motion.div>

      </div>
    </div>
  )
}
