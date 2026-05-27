import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Trophy, Map, Users, Wind, Target, Zap, CheckCircle } from 'lucide-react'
import Button from '../components/ui/Button'

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' } }),
}

const STATS = [
  { label: 'Active runners',  value: '1,840', icon: Users, color: 'text-blue-400',    glow: 'shadow-[0_0_24px_rgba(59,130,246,0.25)]',  bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  { label: 'Trees saved',     value: '3,200', icon: Leaf,  color: 'text-emerald-400', glow: 'shadow-[0_0_24px_rgba(16,185,129,0.25)]', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { label: 'kg CO₂ avoided',  value: '12,4k', icon: Wind,  color: 'text-sky-400',     glow: 'shadow-[0_0_24px_rgba(14,165,233,0.25)]',  bg: 'bg-sky-500/10',     border: 'border-sky-500/20' },
  { label: 'Seville routes',  value: '47',    icon: Map,   color: 'text-orange-400',  glow: 'shadow-[0_0_24px_rgba(249,115,22,0.25)]',  bg: 'bg-orange-500/10',  border: 'border-orange-500/20' },
]

const FEATURES = [
  {
    icon: Leaf,
    title: 'Real Eco Impact',
    desc: 'Every kilometer translates into trees planted and CO₂ avoided. Your runs have a measurable impact on Seville.',
    color: 'text-emerald-400',
    glow: 'group-hover:shadow-[0_8px_40px_rgba(16,185,129,0.15)]',
    topBorder: 'from-emerald-500/60 to-transparent',
    iconBg: 'bg-emerald-500/10',
  },
  {
    icon: Trophy,
    title: 'Full Gamification',
    desc: 'Earn EcoPoints, unlock achievements, level up and compete in the Seville ranking. Every run is an opportunity.',
    color: 'text-yellow-400',
    glow: 'group-hover:shadow-[0_8px_40px_rgba(234,179,8,0.15)]',
    topBorder: 'from-yellow-500/60 to-transparent',
    iconBg: 'bg-yellow-500/10',
  },
  {
    icon: Target,
    title: 'Urban Challenges',
    desc: 'Routes across Seville zones with weekly and monthly challenges. Discover the city while running.',
    color: 'text-blue-400',
    glow: 'group-hover:shadow-[0_8px_40px_rgba(59,130,246,0.15)]',
    topBorder: 'from-blue-500/60 to-transparent',
    iconBg: 'bg-blue-500/10',
  },
]

const STEPS = [
  { step: '01', title: 'Create your account', desc: 'Sign up free and set up your eco-runner profile in under a minute.', icon: CheckCircle },
  { step: '02', title: 'Join a challenge',    desc: 'Explore challenges across Seville zones and pick the one that motivates you.', icon: Target },
  { step: '03', title: 'Run and earn',        desc: 'Complete the challenge, log your run and climb the Seville EcoRanking.', icon: Zap },
]

export default function Home() {
  return (
    <div className="overflow-hidden bg-dark-900">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://res.cloudinary.com/dcp7o3atw/video/upload/v1779206247/12642901-hd_1920_1080_30fps_jwv2wb.mp4"
          autoPlay loop muted playsInline
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/75 to-dark-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-dark-900/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-2xl">

            {/* Badge */}
            <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}
              className="inline-flex items-center gap-2 bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              Eco-sustainable running · Seville
            </motion.div>

            {/* Title */}
            <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
            >
              Every km{' '}
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-sky-300 bg-clip-text text-transparent">
                counts
              </span>
              <br />for a better world
            </motion.h1>

            {/* Subtitle */}
            <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp}
              className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg"
            >
              Run through Seville, earn EcoPoints and make a real difference.
              Every step plants a tree and reduces CO₂ in your city.
            </motion.p>

            {/* CTAs */}
            <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link to="/register">
                <Button size="lg" className="shadow-blue-glow">
                  Start for free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/challenges">
                <Button variant="ghost" size="lg">
                  View challenges
                </Button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {['A','M','C','L'].map((l, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-dark-900 flex items-center justify-center text-xs font-bold text-white">
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                <span className="text-white font-semibold">1,840+ runners</span> already making a difference
              </p>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <span className="text-gray-600 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-6 bg-gradient-to-b from-gray-500 to-transparent"
          />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative border-y border-dark-600 bg-dark-800/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={`${stat.bg} ${stat.border} border rounded-2xl p-5 flex flex-col items-center text-center transition-shadow duration-300 ${stat.glow}`}
              >
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`text-3xl font-black mb-0.5 ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ECORUN ── */}
      <section className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Why EcoRun?</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Run different.<br />
              <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">Make a difference.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              It's not just running. It's contributing to a greener Seville and earning real rewards.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className={`group relative bg-dark-700/60 backdrop-blur-sm border border-dark-500/80 rounded-2xl p-8 overflow-hidden transition-shadow duration-300 ${card.glow}`}
              >
                {/* Gradient top border */}
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${card.topBorder}`} />

                {/* Subtle bg glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-current" style={{ color: 'inherit' }} />

                <div className={`w-12 h-12 ${card.iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-dark-800/50 border-y border-dark-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Simple process</span>
            <h2 className="text-4xl font-black text-white">How it works</h2>
          </motion.div>

          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

            {STEPS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="w-16 h-16 bg-dark-700 border border-dark-400 rounded-2xl flex items-center justify-center mb-5 relative z-10">
                  <span className="text-2xl font-black bg-gradient-to-b from-blue-300 to-blue-600 bg-clip-text text-transparent">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-dark-700/80 backdrop-blur-sm border border-dark-500 rounded-3xl p-12 text-center overflow-hidden"
          >
            {/* Background glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-600/8 rounded-full blur-3xl pointer-events-none" />
            {/* Top border gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <div className="relative z-10">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 block">Join us</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
                Join the eco-sports<br />
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">revolution</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
                Over 1,800 runners in Seville are already running for a better world. What about you?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="shadow-blue-glow">
                    Start for free today
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/challenges">
                  <Button variant="secondary" size="lg">
                    View all challenges
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
