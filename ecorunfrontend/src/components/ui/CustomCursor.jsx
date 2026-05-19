import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = { damping: 28, stiffness: 300, mass: 0.5 }
  const ringX = useSpring(mouseX, springConfig)
  const ringY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return

    const move = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const down = () => setClicking(true)
    const up = () => setClicking(false)

    const checkHover = (e) => {
      const el = e.target
      const isClickable = el.closest('a, button, [role="button"], input, textarea, select, label')
      setHovering(!!isClickable)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mousemove', checkHover)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.documentElement.style.cursor = 'none'

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousemove', checkHover)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.documentElement.style.cursor = ''
    }
  }, [])

  if (!visible) return null

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{ x: mouseX, y: mouseY }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
      >
        <motion.div
          animate={{ scale: clicking ? 0.5 : hovering ? 1.5 : 1 }}
          transition={{ duration: 0.15 }}
          className="w-2 h-2 bg-blue-400 rounded-full -translate-x-1/2 -translate-y-1/2"
        />
      </motion.div>

      {/* Ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
      >
        <motion.div
          animate={{
            scale: clicking ? 0.8 : hovering ? 1.6 : 1,
            opacity: hovering ? 0.6 : 0.35,
          }}
          transition={{ duration: 0.2 }}
          className="w-8 h-8 border border-blue-400 rounded-full -translate-x-1/2 -translate-y-1/2"
        />
      </motion.div>
    </>
  )
}
