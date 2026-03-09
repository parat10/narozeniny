import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Waves, Wine, Thermometer } from 'lucide-react'

const HIDDEN_ITEMS = [
  {
    id: 'swimsuit',
    Icon: Waves,
    label: 'Plavky',
    color: '#4ECDC4',
    style: { left: '22%', top: '45%' },
  },
  {
    id: 'wine',
    Icon: Wine,
    label: 'Víno',
    color: '#D4AF37',
    style: { left: '65%', top: '30%' },
  },
  {
    id: 'sauna',
    Icon: Thermometer,
    label: 'Sauna',
    color: '#E8927C',
    style: { left: '78%', top: '65%' },
  },
]

const RADIUS = 140

export default function Section4Flashlight({ completed, onEnter, onLeave, onComplete }) {
  const sectionRef = useRef(null)
  const [cursorPos, setCursorPos] = useState({ x: -400, y: -400 })
  const [found, setFound] = useState(new Set())
  const completionTriggered = useRef(false)
  const [done, setDone] = useState(false)

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

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  const handleTouchMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    setCursorPos({
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    })
  }, [])

  const handleItemClick = useCallback((id) => {
    if (found.has(id) || completionTriggered.current) return
    const newFound = new Set(found)
    newFound.add(id)
    setFound(newFound)

    if (newFound.size === 3 && !completionTriggered.current) {
      completionTriggered.current = true
      setTimeout(() => {
        setDone(true)
        onComplete?.()
      }, 1200)
    }
  }, [found, onComplete])

  // Build mask: flashlight circle + permanent holes for found items
  const buildMask = () => {
    const masks = []
    // Main flashlight circle
    masks.push(
      `radial-gradient(circle ${RADIUS}px at ${cursorPos.x}px ${cursorPos.y}px, transparent 0%, transparent 100%)`
    )
    // The overall mask: black everywhere except flashlight + found items
    // We use SVG mask instead for multiple holes
    return {
      WebkitMaskImage: `radial-gradient(circle ${RADIUS}px at ${cursorPos.x}px ${cursorPos.y}px, transparent 0%, black 100%)`,
      maskImage: `radial-gradient(circle ${RADIUS}px at ${cursorPos.x}px ${cursorPos.y}px, transparent 0%, black 100%)`,
    }
  }

  return (
    <div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'none',
        background: '#0a0a0a',
      }}
    >
      {/* Background with clickable icons */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {HIDDEN_ITEMS.map((item) => {
          const isFound = found.has(item.id)
          return (
            <motion.button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              whileTap={{ scale: 0.9 }}
              animate={
                isFound
                  ? { scale: [1, 1.3, 1.1], rotate: [0, -5, 5, 0] }
                  : {}
              }
              transition={{ type: 'spring', stiffness: 300 }}
              style={{
                position: 'absolute',
                ...item.style,
                transform: 'translate(-50%, -50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '1rem',
                borderRadius: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: isFound ? item.color + '25' : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${isFound ? item.color : 'rgba(255,255,255,0.15)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                }}
              >
                <item.Icon size={36} color={isFound ? item.color : 'rgba(255,255,255,0.4)'} />
              </div>
              {/* Label always visible after found */}
              <span
                style={{
                  color: item.color,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  opacity: isFound ? 1 : 0,
                  transition: 'opacity 0.3s',
                }}
              >
                {item.label} ✓
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Dark overlay with flashlight hole */}
      <AnimatePresence>
        {!done && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          >
            {/* SVG mask – flashlight circle + permanent holes for found items */}
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <mask id="flashlight-mask">
                  {/* White = visible (dark overlay shows), Black = hidden (dark overlay is cut) */}
                  <rect width="100%" height="100%" fill="white" />
                  {/* Flashlight circle */}
                  <circle cx={cursorPos.x} cy={cursorPos.y} r={RADIUS} fill="black" />
                  {/* Permanent holes for found items */}
                  {HIDDEN_ITEMS.filter(item => found.has(item.id)).map(item => (
                    <circle
                      key={item.id}
                      cx={item.style.left}
                      cy={item.style.top}
                      r="70"
                      fill="black"
                    />
                  ))}
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="black"
                mask="url(#flashlight-mask)"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom cursor dot */}
      {!done && (
        <div
          style={{
            position: 'absolute',
            left: cursorPos.x - 6,
            top: cursorPos.y - 6,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'rgba(255,240,180,0.8)',
            pointerEvents: 'none',
            zIndex: 50,
            boxShadow: '0 0 8px 4px rgba(255,220,120,0.4)',
          }}
        />
      )}

      {/* HUD – instructions + progress */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '2rem',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <motion.h2
          animate={{ opacity: done ? 0 : 1 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.3rem, 3vw, 2rem)',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '0.75rem',
          }}
        >
          Najděte 3 věci, které si musíte sbalit
        </motion.h2>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {HIDDEN_ITEMS.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.85rem',
                color: found.has(item.id) ? item.color : 'rgba(255,255,255,0.35)',
                transition: 'color 0.4s',
              }}
            >
              <span>{found.has(item.id) ? '✓' : '○'}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Completion message */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120, delay: 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
            }}
          >
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎒</p>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                color: 'white',
                marginBottom: '0.5rem',
              }}
            >
              Skvělé! Vše zabaleno.
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif' }}>
              Scrollujte dolů ↓
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
