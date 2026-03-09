import { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Section3ScratchCard({ completed, onEnter, onLeave, onComplete }) {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const [percentage, setPercentage] = useState(0)
  const [isScratching, setIsScratching] = useState(false)
  const lastPos = useRef(null)
  const completionTriggered = useRef(false)
  const animFrameRef = useRef(null)

  // IntersectionObserver: lock/unlock scroll
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

  // Initialize canvas after layout
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const w = canvas.offsetWidth || 600
    const h = canvas.offsetHeight || 300
    canvas.width = w
    canvas.height = h

    const ctx = canvas.getContext('2d')

    // Gold gradient background
    const grad = ctx.createLinearGradient(0, 0, w, h)
    grad.addColorStop(0, '#8B6914')
    grad.addColorStop(0.25, '#D4AF37')
    grad.addColorStop(0.5, '#FFF8DC')
    grad.addColorStop(0.75, '#D4AF37')
    grad.addColorStop(1, '#8B6914')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // Texture dots
    ctx.fillStyle = 'rgba(0,0,0,0.06)'
    for (let i = 0; i < 2000; i++) {
      ctx.beginPath()
      ctx.arc(
        Math.random() * w,
        Math.random() * h,
        Math.random() * 2,
        0,
        Math.PI * 2
      )
      ctx.fill()
    }

    // Instructions text
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.font = `bold ${Math.min(w / 20, 22)}px Inter, sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('✦ Seškrábejte a odhalte svůj dárek! ✦', w / 2, h / 2 - 10)
    ctx.font = `${Math.min(w / 28, 16)}px Inter, sans-serif`
    ctx.fillStyle = 'rgba(0,0,0,0.35)'
    ctx.fillText('(myší nebo prstem)', w / 2, h / 2 + 20)
  }, [])

  const getPos = useCallback((e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  const scratch = useCallback((cx, cy) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'

    if (lastPos.current) {
      ctx.beginPath()
      ctx.moveTo(lastPos.current.x, lastPos.current.y)
      ctx.lineTo(cx, cy)
      ctx.lineWidth = 48
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(cx, cy, 24, 0, Math.PI * 2)
    ctx.fill()

    lastPos.current = { x: cx, y: cy }
  }, [])

  const calculatePercentage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let transparent = 0
    const total = data.length / 4
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) transparent++
    }
    const pct = Math.min(100, Math.round((transparent / total) * 100))
    setPercentage(pct)
    if (pct >= 80 && !completionTriggered.current) {
      completionTriggered.current = true
      setTimeout(() => onComplete?.(), 600)
    }
  }, [onComplete])

  const handleMouseDown = useCallback((e) => {
    if (completed || completionTriggered.current) return
    setIsScratching(true)
    const pos = getPos(e, canvasRef.current)
    scratch(pos.x, pos.y)
  }, [completed, getPos, scratch])

  const handleMouseMove = useCallback((e) => {
    if (!isScratching || completed || completionTriggered.current) return
    const pos = getPos(e, canvasRef.current)
    scratch(pos.x, pos.y)
    // Throttle calculation
    cancelAnimationFrame(animFrameRef.current)
    animFrameRef.current = requestAnimationFrame(calculatePercentage)
  }, [isScratching, completed, getPos, scratch, calculatePercentage])

  const handleMouseUp = useCallback(() => {
    setIsScratching(false)
    lastPos.current = null
    calculatePercentage()
  }, [calculatePercentage])

  const handleTouchStart = useCallback((e) => {
    if (completed || completionTriggered.current) return
    e.preventDefault()
    const pos = getPos(e, canvasRef.current)
    scratch(pos.x, pos.y)
  }, [completed, getPos, scratch])

  const handleTouchMove = useCallback((e) => {
    if (completed || completionTriggered.current) return
    e.preventDefault()
    const pos = getPos(e, canvasRef.current)
    scratch(pos.x, pos.y)
    cancelAnimationFrame(animFrameRef.current)
    animFrameRef.current = requestAnimationFrame(calculatePercentage)
  }, [completed, getPos, scratch, calculatePercentage])

  const handleTouchEnd = useCallback(() => {
    lastPos.current = null
    calculatePercentage()
  }, [calculatePercentage])

  return (
    <div
      ref={sectionRef}
      style={{
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-offwhite)',
        overflow: 'hidden',
      }}
    >
      {/* Background – blurred villa photo */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80"
          alt="Luxusní vila"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(10px)',
            transform: 'scale(1.12)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
      </div>

      {/* Card container */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '640px', padding: '0 1.5rem' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            color: 'white',
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        >
          Tady se skrývá váš dárek&hellip;
        </motion.h2>

        {/* Scratch canvas wrapper */}
        <div
          style={{
            position: 'relative',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            height: '280px',
          }}
        >
          {/* Reveal layer underneath – nature image */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
              alt="Příroda"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                  color: '#D4AF37',
                  textAlign: 'center',
                  padding: '1rem',
                  lineHeight: 1.5,
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
              >
                🎁 Víkend v luxusním<br />domě na Jižní Moravě
              </p>
            </div>
          </div>

          {/* Scratch overlay canvas */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              cursor: isScratching ? 'none' : 'crosshair',
              touchAction: 'none',
              display: completed && percentage >= 80 ? 'none' : 'block',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '1rem' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '9999px',
              height: '6px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              animate={{ width: `${percentage}%` }}
              transition={{ type: 'spring', stiffness: 60 }}
              style={{
                height: '100%',
                background: 'linear-gradient(to right, #D4AF37, #FFD700)',
                borderRadius: '9999px',
              }}
            />
          </div>
          <p
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.8rem',
              textAlign: 'center',
              marginTop: '0.5rem',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {percentage < 80 ? `${percentage}% odhaleno` : '✓ Skvělé! Scrollujte dolů ↓'}
          </p>
        </div>

        <AnimatePresence>
          {completed && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: '#D4AF37',
                textAlign: 'center',
                marginTop: '0.75rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                letterSpacing: '0.05em',
              }}
            >
              ↓ Pokračujte dolů ↓
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
