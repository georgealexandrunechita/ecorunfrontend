import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BottomSheet({ open, onClose, children }) {
  // Lock scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => { if (info.offset.y > 80) onClose() }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-dark-800 border-t border-dark-500 rounded-t-3xl max-h-[85vh] overflow-y-auto"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-dark-800 rounded-t-3xl">
              <div className="w-10 h-1 bg-dark-400 rounded-full" />
            </div>

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
