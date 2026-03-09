import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

// Simplified SVG paths for Czech Republic regions (viewBox 0 0 500 300)
const REGIONS = [
  {
    id: 'karlovarsky',
    name: 'Karlovarský',
    d: 'M25,125 L55,88 L100,78 L115,110 L98,140 L58,148 Z',
    labelPos: { x: 65, y: 118 },
  },
  {
    id: 'ustecky',
    name: 'Ústecký',
    d: 'M100,78 L148,48 L200,28 L220,58 L175,95 L115,110 Z',
    labelPos: { x: 155, y: 78 },
  },
  {
    id: 'liberecky',
    name: 'Liberecký',
    d: 'M200,28 L252,22 L285,40 L270,72 L240,80 L220,58 Z',
    labelPos: { x: 245, y: 52 },
  },
  {
    id: 'kralovehradecky',
    name: 'Královéhradecký',
    d: 'M285,40 L335,28 L372,52 L358,95 L320,110 L295,92 L270,72 Z',
    labelPos: { x: 318, y: 70 },
  },
  {
    id: 'plzensky',
    name: 'Plzeňský',
    d: 'M58,148 L98,140 L115,110 L145,130 L162,155 L165,182 L140,210 L88,218 L42,198 Z',
    labelPos: { x: 108, y: 168 },
  },
  {
    id: 'stredocesky',
    name: 'Středočeský',
    d: 'M175,95 L220,58 L240,80 L270,72 L295,92 L305,122 L292,155 L268,175 L235,190 L210,192 L180,192 L165,182 L162,155 L145,130 L115,110 Z',
    labelPos: { x: 155, y: 148 },
  },
  {
    id: 'praha',
    name: 'Praha',
    d: 'M200,128 L218,122 L228,135 L220,155 L200,155 L192,140 Z',
    labelPos: { x: 210, y: 142 },
  },
  {
    id: 'pardubicky',
    name: 'Pardubický',
    d: 'M295,92 L320,110 L358,95 L375,122 L358,158 L322,170 L292,155 L305,122 Z',
    labelPos: { x: 328, y: 132 },
  },
  {
    id: 'jihocesky',
    name: 'Jihočeský',
    d: 'M42,198 L88,218 L140,210 L165,182 L180,192 L210,192 L205,220 L190,258 L140,280 L95,275 L58,252 Z',
    labelPos: { x: 128, y: 240 },
  },
  {
    id: 'vysocina',
    name: 'Vysočina',
    d: 'M210,192 L235,190 L268,175 L292,155 L322,170 L328,198 L308,235 L268,252 L228,258 L195,250 L190,258 L205,220 Z',
    labelPos: { x: 260, y: 218 },
  },
  {
    id: 'jihomoravsky',
    name: 'Jihomoravský',
    correct: true,
    d: 'M308,235 L328,198 L365,188 L398,208 L410,248 L385,275 L348,280 L318,268 Z',
    labelPos: { x: 358, y: 240 },
  },
  {
    id: 'olomoucky',
    name: 'Olomoucký',
    d: 'M358,158 L375,122 L418,92 L445,118 L438,168 L412,192 L398,208 L365,188 L328,198 L322,170 Z',
    labelPos: { x: 388, y: 162 },
  },
  {
    id: 'moravskoslezsky',
    name: 'Moravskoslezský',
    d: 'M418,92 L452,70 L478,88 L475,138 L458,168 L438,168 L445,118 Z',
    labelPos: { x: 452, y: 118 },
  },
  {
    id: 'zlinsky',
    name: 'Zlínský',
    d: 'M398,208 L412,192 L438,168 L458,168 L455,200 L442,228 L418,248 L410,248 Z',
    labelPos: { x: 432, y: 210 },
  },
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
  const [hoveredId, setHoveredId] = useState(null)
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

    if (region.correct) {
      setIsCompleted(true)
      confetti({
        particleCount: 220,
        spread: 120,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#FFD700', '#4ECDC4', '#26A69A', '#FFF8DC'],
        gravity: 0.8,
      })
      setTimeout(() => confetti({
        particleCount: 100, spread: 80,
        origin: { y: 0.5, x: 0.2 }, colors: ['#D4AF37', '#FFD700'],
      }), 300)
      setTimeout(() => confetti({
        particleCount: 100, spread: 80,
        origin: { y: 0.5, x: 0.8 }, colors: ['#4ECDC4', '#26A69A'],
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

  // Determine font size based on region name length
  const labelFontSize = (name) => {
    if (name.length > 14) return '5.5px'
    if (name.length > 10) return '6.5px'
    return '7.5px'
  }

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
            style={{ width: '100%', maxWidth: '720px', textAlign: 'center' }}
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
            <p style={{
              fontFamily: 'Inter, sans-serif',
              color: '#6b7280',
              marginBottom: '1.5rem',
              fontSize: '0.95rem',
            }}>
              Klikněte na správný kraj na mapě
            </p>

            {/* SVG Map of Czech Republic */}
            <svg
              viewBox="0 0 500 300"
              style={{
                width: '100%',
                maxWidth: '680px',
                height: 'auto',
              }}
            >
              {REGIONS.map((region) => {
                const isHovered = hoveredId === region.id
                const isShaking = shakeId === region.id

                return (
                  <g key={region.id}>
                    {/* Region shape */}
                    <motion.path
                      d={region.d}
                      onClick={() => handleClick(region)}
                      onMouseEnter={() => setHoveredId(region.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      animate={
                        isShaking
                          ? { x: [0, -4, 4, -3, 3, -1, 1, 0], fill: '#FECACA' }
                          : {}
                      }
                      transition={isShaking ? { duration: 0.5 } : { duration: 0.2 }}
                      style={{
                        fill: isHovered ? '#e0ddd5' : '#ffffff',
                        stroke: '#b0b0b0',
                        strokeWidth: 1.2,
                        cursor: 'pointer',
                        transition: 'fill 0.15s',
                      }}
                    />
                    {/* Region label */}
                    <text
                      x={region.labelPos.x}
                      y={region.labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fontSize: labelFontSize(region.name),
                        fontFamily: 'Inter, sans-serif',
                        fill: '#555',
                        pointerEvents: 'none',
                        fontWeight: isHovered ? 600 : 400,
                        userSelect: 'none',
                      }}
                    >
                      {region.name}
                    </text>
                  </g>
                )
              })}
            </svg>

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
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              color: 'var(--color-charcoal)',
              marginBottom: '0.5rem',
            }}>
              BINGO!
            </h3>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
              color: 'var(--color-gold)',
              fontStyle: 'italic',
            }}>
              Rosice u Brna vás volají!
            </p>
            <p style={{
              marginTop: '1rem', color: '#6b7280',
              fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
            }}>
              Scrollujte dolů pro odhalení ↓
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
