import { useState, useEffect, useRef, useCallback } from 'react'
import Section1Welcome from './components/Section1Welcome'
import Section2Story from './components/Section2Story'
import Section3ScratchCard from './components/Section3ScratchCard'
import Section4Flashlight from './components/Section4Flashlight'
import Section5Quiz from './components/Section5Quiz'
import Section6Reveal from './components/Section6Reveal'
import Section7Slider from './components/Section7Slider'
import Section8Calendar from './components/Section8Calendar'
import Section9Finale from './components/Section9Finale'

export default function App() {
  const [gatesCompleted, setGatesCompleted] = useState({
    scratch: false,
    flashlight: false,
    quiz: false,
  })

  // Use refs so event handlers always have fresh values without re-registering
  const lockedGate = useRef(null)
  const completedRef = useRef({ scratch: false, flashlight: false, quiz: false })

  const lockScroll = useCallback((gate) => {
    if (!completedRef.current[gate]) {
      lockedGate.current = gate
    }
  }, [])

  const unlockScroll = useCallback(() => {
    lockedGate.current = null
  }, [])

  const completeGate = useCallback((gate) => {
    completedRef.current[gate] = true
    lockedGate.current = null
    setGatesCompleted(prev => ({ ...prev, [gate]: true }))
  }, [])

  useEffect(() => {
    const handleWheel = (e) => {
      if (lockedGate.current && e.deltaY > 0) {
        e.preventDefault()
      }
    }

    let touchStartY = 0
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }
    const handleTouchMove = (e) => {
      if (!lockedGate.current) return
      const deltaY = touchStartY - e.touches[0].clientY
      if (deltaY > 0) e.preventDefault()
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <div>
      <Section1Welcome />
      <Section2Story />
      <Section3ScratchCard
        completed={gatesCompleted.scratch}
        onEnter={() => lockScroll('scratch')}
        onLeave={unlockScroll}
        onComplete={() => completeGate('scratch')}
      />
      <Section4Flashlight
        completed={gatesCompleted.flashlight}
        onEnter={() => lockScroll('flashlight')}
        onLeave={unlockScroll}
        onComplete={() => completeGate('flashlight')}
      />
      <Section5Quiz
        completed={gatesCompleted.quiz}
        onEnter={() => lockScroll('quiz')}
        onLeave={unlockScroll}
        onComplete={() => completeGate('quiz')}
      />
      <Section6Reveal />
      <Section7Slider />
      <Section8Calendar />
      <Section9Finale />
    </div>
  )
}
