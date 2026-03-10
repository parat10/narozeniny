import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const FEATURES = [
  { text: '🏡 Luxusní designový dům jen pro nás.', side: 'left', top: '25%' },
  { text: '🐟 Biotopové jezírko s rybami přímo u terasy.', side: 'right', top: '50%' },
  { text: '🔥 Finská sauna pro dokonalé prohřátí.', side: 'left', top: '72%' },
]

function FeatureLabel({ text, side, top, scrollYProgress, index }) {
  const start = 0.15 + index * 0.22
  const opacity = useTransform(scrollYProgress, [start, start + 0.12], [0, 1])
  const x = useTransform(
    scrollYProgress,
    [start, start + 0.12],
    [side === 'left' ? -80 : 80, 0]
  )

  return (
    <motion.div
      style={{
        position: 'absolute',
        top,
        [side]: '4%',
        maxWidth: '280px',
        opacity,
        x,
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1.25rem',
          padding: '1rem 1.4rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          borderLeft: side === 'left' ? '3px solid #D4AF37' : 'none',
          borderRight: side === 'right' ? '3px solid #26A69A' : 'none',
        }}
      >
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            color: 'var(--color-charcoal)',
            lineHeight: 1.5,
          }}
        >
          {text}
        </p>
      </div>
    </motion.div>
  )
}

export default function Section6Reveal() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0])
  const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -40])

  return (
    <div ref={containerRef} style={{ height: '320vh' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Parallax image */}
        <motion.div style={{ scale: imageScale, position: 'absolute', inset: 0 }}>
          <img
            src="/images/dum2.jpg"
            alt="Luxusní vila"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
            }}
          />
        </motion.div>

        {/* Opening title */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: titleOpacity,
            y: titleY,
            zIndex: 5,
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              color: 'white',
              textAlign: 'center',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              letterSpacing: '0.02em',
            }}
          >
            Odhalení ráje
          </h2>
        </motion.div>

        {/* Feature labels */}
        {FEATURES.map((feature, i) => (
          <FeatureLabel
            key={i}
            {...feature}
            scrollYProgress={scrollYProgress}
            index={i}
          />
        ))}

        {/* Gold bottom bar */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
            opacity: useTransform(scrollYProgress, [0.8, 1], [0, 1]),
          }}
        />
      </div>
    </div>
  )
}
