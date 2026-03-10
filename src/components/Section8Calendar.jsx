import { useRef } from 'react'
import { motion } from 'framer-motion'

const DAYS_CS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']
const HIGHLIGHT_DAYS = [24, 25, 26]

// April 2026: starts on Wednesday (index 2 in Mon-based week), 30 days
const FIRST_DAY = 2
const DAYS_IN_MONTH = 30

export default function Section8Calendar() {
  const ref = useRef(null)

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
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
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
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-10%' }}
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
            2026
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              color: 'var(--color-charcoal)',
              marginTop: '0.25rem',
            }}
          >
            Duben
          </h2>
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

        {/* Calendar grid - April 2026 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.2rem' }}>
          {/* Empty cells for days before April 1 */}
          {Array.from({ length: FIRST_DAY }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {/* Day cells */}
          {Array.from({ length: DAYS_IN_MONTH }).map((_, i) => {
            const day = i + 1
            const isHighlight = HIGHLIGHT_DAYS.includes(day)

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

        {/* Date text - always visible */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
            24.4.2026 – 26.4.2026
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
      </motion.div>
    </div>
  )
}
