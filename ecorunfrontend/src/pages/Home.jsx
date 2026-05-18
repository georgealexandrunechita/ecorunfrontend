import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Trophy, Map, Users, Wind, Shield, Zap } from 'lucide-react'
import { mockStats } from '../data/mock'
import Button from '../components/ui/Button'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/60 to-dark-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
          <div className="max-w-3xl">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-600/40 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
            >
              <Leaf className="w-3 h-3" />
              Eco-sustainable running in Seville
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
            >
              Every kilometer{' '}
              <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                counts
              </span>{' '}
              for a better world
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="text-gray-300 text-xl leading-relaxed mb-10 max-w-xl"
            >
              Run through Seville, earn EcoPoints and make a difference.
              Every step you take plants a tree and reduces CO₂ in your city.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
              className="flex flex-wrap gap-3"
            >
              <Link to="/register">
                <Button size="lg" className="shadow-blue-glow">
                  Start now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/challenges">
                <Button variant="ghost" size="lg">
                  <Trophy className="w-4 h-4" />
                  Latest Runs
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" size="lg">
                  <Leaf className="w-4 h-4" />
                  EcoPoints
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-0.5 h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* STATS */}
      <section className="relative bg-dark-800 border-y border-dark-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Active runners', value: mockStats.activeRunners.toLocaleString(), icon: Users, suffix: '' },
              { label: 'Trees saved', value: mockStats.treesSaved.toLocaleString(), icon: Leaf, suffix: '' },
              { label: 'kg CO₂ avoided', value: mockStats.co2Avoided.toLocaleString(), icon: Wind, suffix: 'kg' },
              { label: 'Seville routes', value: mockStats.sevillaRoutes, icon: Map, suffix: '' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-4"
              >
                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center mb-3">
                  <stat.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-black text-white mb-1">
                  {stat.value}{stat.suffix && <span className="text-base font-normal text-gray-500 ml-1">{stat.suffix}</span>}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY ECORUN */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4 block">Why EcoRun?</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
              Run different.<br />
              <span className="text-blue-400">Make a difference.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              It's not just running. It's contributing to a greener Seville, connecting with other runners and earning real rewards.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Leaf,
                title: 'Real Eco Impact',
                desc: 'Every kilometer you run translates into trees planted and CO₂ avoided. Your physical activity has a real environmental impact in Seville.',
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10 border-emerald-500/20',
              },
              {
                icon: Trophy,
                title: 'Full Gamification',
                desc: 'Earn EcoPoints, unlock achievements, level up and compete in the Seville ranking. Every session is an opportunity to improve.',
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10 border-yellow-500/20',
              },
              {
                icon: Zap,
                title: 'Urban Challenges',
                desc: 'Routes designed across Seville zones with weekly and monthly challenges. Discover the city while running and share your achievements.',
                color: 'text-blue-400',
                bg: 'bg-blue-500/10 border-blue-500/20',
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`bg-dark-700 border ${card.bg} rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className={`w-12 h-12 ${card.bg} border rounded-2xl flex items-center justify-center mb-6`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                <p className="text-gray-400 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-dark-800 border-y border-dark-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">How it works</h2>
            <p className="text-gray-400 max-w-xl mx-auto">In 3 steps, start running and improving Seville</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create your account', desc: 'Sign up for free and set up your eco-conscious runner profile.' },
              { step: '02', title: 'Choose a challenge', desc: 'Explore challenges across Seville zones and pick the one that motivates you most.' },
              { step: '03', title: 'Run and earn', desc: 'Complete the challenge, accumulate EcoPoints and climb the Seville ranking.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-blue-600/20 border border-blue-600/30 rounded-2xl flex items-center justify-center text-blue-400 font-black text-xl mb-5">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-blue-600/20 via-dark-700 to-dark-700 border border-blue-600/30 rounded-3xl p-12 text-center overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2" />
            <div className="relative z-10">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
                Join the revolution<br />
                <span className="text-blue-400">eco-sports</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
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
