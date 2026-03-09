import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function Section1Welcome() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.65, 1], [1, 6, 35])
  const opacity = useTransform(scrollYProgress, [0, 0.55, 0.8], [1, 1, 0])
  const filter = useTransform(scrollYProgress, [0.55, 0.8], ['blur(0px)', 'blur(20px)'])

  return (
    <div ref={containerRef} style={{ height: '300vh' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: 'var(--color-offwhite)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          style={{ scale, opacity, filter }}
          className="text-center px-8 select-none"
        >
          <h1
            className="font-serif leading-tight"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              color: 'var(--color-charcoal)',
              letterSpacing: '-0.02em',
            }}
          >
            Všechno nejlepší
            <br />
            k narozeninám,
            <br />
            <em style={{ color: 'var(--color-gold)' }}>dědečku a babičko!</em>
          </h1>
          <motion.p
            style={{ opacity: useTransform(scrollYProgress, [0, 0.05, 0.2], [0, 1, 0]) }}
            className="mt-6 font-sans text-gray-400 text-sm tracking-widest uppercase"
          >
            Scrollujte dolů ↓
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
