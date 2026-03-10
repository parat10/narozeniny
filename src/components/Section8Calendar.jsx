import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MONTHS_CS = [
  'Leden', 'Únor', 'Březen', 'Duben',
  'Květen', 'Červen', 'Červenec', 'Srpen',
  'Září', 'Říjen', 'Listopad', 'Prosinec',
]
const DAYS_CS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']

// April 1, 2026 = Wednesday → index 2 (Mon-based)
const TARGET_MONTH = 3 // April (0-indexed)
const TARGET_YEAR = 2026
const HIGHLIGHT_DAYS = [24, 25, 26]

function getFirstDayOfMonth(year, month) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export default function Section8Calendar() {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [displayMonth, setDisplayMonth] = useState(0)
  const [animated, setAnimated] = useState(false)

  // Use manual IntersectionObserver for reliable detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || animated) return
    setAnimated(true)
    let month = 0
    const interval = setInterval(() => {
      month += 1
      setDisplayMonth(month)
      if (month >= TARGET_MONTH) clearInterval(interval)
    }, 140)
    return () => clearInterval(interval)
  }, [isVisible, animated])

  const isApril = displayMonth === TARGET_MONTH
  const daysInMonth = getDaysInMonth(TARGET_YEAR, displayMonth)
  const firstDay = getFirstDayOfMonth(TARGET_YEAR, displayMonth)

  return (
    <div
      ref={ref}
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-offwhite)',
        padding: '2rem 1rem',
      }}
    >
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        style={{
          fontFamily: 'Inter, sans-serif',
          color: '#9ca3af',
          fontSize: '0.85rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}
      >
        Termín vašeho pobytu
      </motion.p>

      {/* Calendar card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
        style={{
          background: 'white',
          borderRadius: '1.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.05)',
          padding: '2rem',
          width: '100%',
          maxWidth: '360px',
        }}
      >
        {/* Calendar header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#9ca3af',
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
            }}
          >
            {TARGET_YEAR}
          </span>
          <AnimatePresence mode="wait">
            <motion.h2
              key={displayMonth}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.08 }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2rem',
                color: 'var(--color-charcoal)',
                marginTop: '0.25rem',
              }}
            >
              {MONTHS_CS[displayMonth]}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.5rem' }}>
          {DAYS_CS.map((d) => (
            <div
              key={d}
              style={{
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.7rem',
                color: '#9ca3af',
                fontWeight: 600,
                letterSpacing: '0.05em',
                padding: '0.25rem 0',
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.2rem' }}>
          {/* Empty cells */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const isHighlight = isApril && HIGHLIGHT_DAYS.includes(day)
            const isFri = isHighlight && day === 24
            const isSun = isHighlight && day === 26

            return (
              <motion.div
                key={day}
                animate={
                  isHighlight
                    ? {
                        boxShadow: [
                          '0 0 0 0 rgba(212,175,55,0.5)',
                          '0 0 0 6px rgba(212,175,55,0)',
                        ],
                      }
                    : {}
                }
                transition={isHighlight ? { repeat: Infinity, duration: 1.8 } : {}}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: isHighlight ? 700 : 400,
                  color: isHighlight ? 'white' : 'var(--color-charcoal)',
                  background: isHighlight
                    ? 'linear-gradient(135deg, #D4AF37, #F0C040)'
                    : 'transparent',
                  cursor: 'default',
                  position: 'relative',
                }}
              >
                {day}
              </motion.div>
            )
          })}
        </div>

        {/* Date text */}
        <AnimatePresence>
          {isApril && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: 'spring' }}
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid #f3f4f6',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.25rem',
                  color: 'var(--color-charcoal)',
                  marginBottom: '0.3rem',
                  fontWeight: 600,
                }}
              >
                Víkend od 24.4.2026 do 26.4.2026
              </p>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: '#6b7280',
                  fontSize: '0.85rem',
                }}
              >
                Pátek · Sobota · Neděle
              </p>
              <div
                style={{
                  display: 'inline-block',
                  marginTop: '0.75rem',
                  padding: '0.35rem 1.1rem',
                  background: 'linear-gradient(to right, #D4AF37, #F0C040)',
                  borderRadius: '9999px',
                  color: 'white',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                }}
              >
                ✓ Máme to zařízené
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
