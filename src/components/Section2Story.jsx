import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const sentences = [
  'Letos jsme nechtěli dávat nic, co skončí v poličce\u2026',
  'Chtěli jsme vám věnovat to nejcennější\u2026',
  'Klid. Pohodu. A čas strávený s rodinou.',
]

function AnimatedSentence({ text, scrollYProgress, start, peak, end, last }) {
  const opacity = useTransform(
    scrollYProgress,
    [start, peak, last ? end : end, last ? end + 0.01 : end + 0.1],
    [0, 1, last ? 1 : 1, last ? 1 : 0]
  )
  const y = useTransform(scrollYProgress, [start, peak], ['2rem', '0rem'])
  const scale = useTransform(scrollYProgress, [start, peak], [0.95, 1])

  return (
    <motion.p
      style={{
        position: 'absolute',
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 'clamp(1.5rem, 4vw, 3rem)',
        color: 'white',
        textAlign: 'center',
        padding: '0 2rem',
        maxWidth: '56rem',
        lineHeight: 1.4,
        opacity,
        y,
        scale,
      }}
    >
      {text}
    </motion.p>
  )
}

export default function Section2Story() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <div ref={containerRef} style={{ height: '400vh' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          background: '#111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #000 100%)',
          }}
        />

        <AnimatedSentence
          text={sentences[0]}
          scrollYProgress={scrollYProgress}
          start={0.05}
          peak={0.15}
          end={0.3}
        />
        <AnimatedSentence
          text={sentences[1]}
          scrollYProgress={scrollYProgress}
          start={0.38}
          peak={0.48}
          end={0.63}
        />
        <AnimatedSentence
          text={sentences[2]}
          scrollYProgress={scrollYProgress}
          start={0.7}
          peak={0.8}
          end={0.95}
          last={true}
        />

        {/* Gold accent line */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '3rem',
            left: '50%',
            translateX: '-50%',
            width: useTransform(scrollYProgress, [0.85, 1], ['0%', '40%']),
            height: '1px',
            background: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
          }}
        />
      </div>
    </div>
  )
}
