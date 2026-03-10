import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Section7Slider() {
  const [value, setValue] = useState(35)

  return (
    <div
      style={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {/* AFTER – relaxation (right side) */}
      <img
        src="/images/dum5.jpg"
        alt="Pohoda"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* BEFORE – stress city (left side, clipped) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: `inset(0 ${100 - value}% 0 0)`,
          transition: 'clip-path 0.02s',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80"
          alt="Stres"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(90%) brightness(0.7)',
          }}
        />
      </div>

      {/* Divider line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${value}%`,
          width: '2px',
          background: 'white',
          boxShadow: '0 0 12px rgba(255,255,255,0.8)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {/* Handle */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
            <path d="M6 7L1 3.5M1 3.5L6 0M1 3.5H19M14 7L19 3.5M19 3.5L14 0M19 3.5H1" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 14L1 10.5M1 10.5L6 7M1 10.5H19M14 14L19 10.5M19 10.5L14 7M19 10.5H1" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <motion.div
        animate={{ opacity: value < 70 ? 1 : 0 }}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          background: 'rgba(0,0,0,0.65)',
          color: 'white',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.85rem',
          fontWeight: 500,
          letterSpacing: '0.05em',
          zIndex: 15,
        }}
      >
        😰 STRES
      </motion.div>

      <motion.div
        animate={{ opacity: value > 30 ? 1 : 0 }}
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          background: 'rgba(38, 166, 154, 0.8)',
          color: 'white',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.85rem',
          fontWeight: 500,
          letterSpacing: '0.05em',
          zIndex: 15,
        }}
      >
        😌 POHODA
      </motion.div>

      {/* Slider control */}
      <div
        style={{
          position: 'absolute',
          bottom: '3rem',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 20,
          padding: '0 2rem',
        }}
      >
        <p
          style={{
            color: 'rgba(255,255,255,0.75)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8rem',
            marginBottom: '0.75rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Přetáhněte slider
        </p>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{
            width: '100%',
            maxWidth: '480px',
            cursor: 'ew-resize',
          }}
        />
      </div>

      {/* Emotional text overlay */}
      <motion.div
        animate={{
          opacity: value > 60 ? 1 : 0,
          y: value > 60 ? 0 : 20,
        }}
        transition={{ type: 'spring', stiffness: 80 }}
        style={{
          position: 'absolute',
          bottom: '8rem',
          right: '5%',
          maxWidth: '260px',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          borderRadius: '1rem',
          padding: '1rem 1.2rem',
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'white',
            fontSize: '1rem',
            lineHeight: 1.6,
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        >
          Tohle čeká na vás ✨
        </p>
      </motion.div>
    </div>
  )
}
