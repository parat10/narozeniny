import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

// Czech regions in approximate geographic grid layout (col/row, 1-indexed)
const REGIONS = [
  { id: 'karlovarsky', name: 'Karlovarský', col: 1, row: 1 },
  { id: 'ustecky', name: 'Ústecký', col: 2, row: 1 },
  { id: 'liberecky', name: 'Liberecký', col: 3, row: 1 },
  { id: 'kralovehradecky', name: 'Královéhradecký', col: 4, row: 1 },
  { id: 'plzensky', name: 'Plzeňský', col: 1, row: 2 },
  { id: 'stredocesky', name: 'Středočeský', col: 2, row: 2 },
  { id: 'praha', name: 'Praha', col: 3, row: 2 },
  { id: 'pardubicky', name: 'Pardubický', col: 4, row: 2 },
  { id: 'jihocesky', name: 'Jihočeský', col: 1, row: 3 },
  { id: 'vysocina', name: 'Kraj Vysočina', col: 2, row: 3 },
  { id: 'jihomoravsky', name: 'Jihomoravský ★', col: 3, row: 3, correct: true },
  { id: 'olomoucky', name: 'Olomoucký', col: 4, row: 3 },
  { id: 'zlinsky', name: 'Zlínský', col: 3, row: 4 },
  { id: 'moravskoslezsky', name: 'Moravskoslezský', col: 4, row: 4 },
]

const WRONG_MESSAGES = [
  'Tady je sice hezky, ale tam my nemíříme!',
  'Dobrý tip, ale ne! Zkuste jiný kraj.',
  'Blízko, ale ne! Hledejte dál\u2026',
  'Hm, zajímavá volba, ale špatná!',
  'Skoro! Ale tím správným krajem to není\u2026',
]

export default function Section5Quiz({ completed, onEnter, onLeave, onComplete }) {
  const sectionRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const [shakeId, setShakeId] = useState(null)
  const [wrongMsg, setWrongMsg] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const completionTriggered = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onEnter?.()
        else onLeave?.()
      },
      { threshold: 0.5 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [onEnter, onLeave])

  const handleClick = useCallback((region) => {
    if (isCompleted) return
    setSelected(region.id)

    if (region.correct) {
      setIsCompleted(true)
      confetti({
        particleCount: 220,
        spread: 120,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#FFD700', '#4ECDC4', '#26A69A', '#FFF8DC'],
        gravity: 0.8,
        scalar: 1.1,
      })
      setTimeout(() => confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5, x: 0.2 },
        colors: ['#D4AF37', '#FFD700'],
      }), 300)
      setTimeout(() => confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5, x: 0.8 },
        colors: ['#4ECDC4', '#26A69A'],
      }), 500)
      if (!completionTriggered.current) {
        completionTriggered.current = true
        setTimeout(() => onComplete?.(), 2500)
      }
    } else {
      setShakeId(region.id)
      setWrongMsg(WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)])
      setTimeout(() => setShakeId(null), 700)
      setTimeout(() => setWrongMsg(null), 3000)
    }
  }, [isCompleted, onComplete])

  return (
    <div
      ref={sectionRef}
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-offwhite)',
        padding: '2rem 1rem',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ width: '100%', maxWidth: '680px', textAlign: 'center' }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                color: 'var(--color-charcoal)',
                marginBottom: '0.5rem',
              }}
            >
              Kam to vlastně jedeme?
            </motion.h2>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                color: '#6b7280',
                marginBottom: '1.5rem',
                fontSize: '0.95rem',
              }}
            >
              Tipněte si kraj na mapě České republiky
            </p>

            {/* Region grid – geographic layout */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'repeat(4, auto)',
                gap: '0.4rem',
                width: '100%',
              }}
            >
              {REGIONS.map((region) => {
                const isShaking = shakeId === region.id
                const isSelected = selected === region.id
                return (
                  <motion.button
                    key={region.id}
                    onClick={() => handleClick(region)}
                    animate={
                      isShaking
                        ? { x: [0, -10, 10, -8, 8, -4, 4, 0], backgroundColor: '#FEE2E2' }
                        : isSelected && region.correct
                        ? { backgroundColor: '#D1FAE5', scale: [1, 1.06, 1] }
                        : {}
                    }
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    style={{
                      gridColumn: region.col,
                      gridRow: region.row,
                      padding: '0.6rem 0.3rem',
                      borderRadius: '0.6rem',
                      border: '1.5px solid #e5e7eb',
                      background: 'white',
                      fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)',
                      fontFamily: 'Inter, sans-serif',
                      color: 'var(--color-charcoal)',
                      cursor: 'pointer',
                      lineHeight: 1.3,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                  >
                    {region.name}
                  </motion.button>
                )
              })}
            </div>

            {/* Wrong answer tooltip */}
            <AnimatePresence>
              {wrongMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6 }}
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '9999px',
                    color: '#B91C1C',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                    display: 'inline-block',
                  }}
                >
                  {wrongMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                color: 'var(--color-charcoal)',
                marginBottom: '0.5rem',
              }}
            >
              BINGO!
            </h3>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
                color: 'var(--color-gold)',
                fontStyle: 'italic',
              }}
            >
              Rosice u Brna vás volají!
            </p>
            <p
              style={{
                marginTop: '1rem',
                color: '#6b7280',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
              }}
            >
              Scrollujte dolů pro odhalení ↓
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
