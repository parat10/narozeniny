import { motion } from 'framer-motion'
import { MapPin, ExternalLink, Heart } from 'lucide-react'

// Placeholder photos – family photos will be added later
// First image is tagged as family placeholder
const PHOTOS = [
  { src: '/images/rodina.jpg', alt: 'Rodina' },
  { src: '/images/dum6.jpg', alt: 'Exteriér' },
  { src: '/images/dum2.jpg', alt: 'Večeře u jezírka' },
  { src: '/images/dum3.jpg', alt: 'Bazén' },
  { src: '/images/dum4.jpg', alt: 'Sauna' },
  { src: '/images/dum.jpg', alt: 'Obývák' },
]

export default function Section9Finale() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
        background: 'linear-gradient(to bottom, var(--color-offwhite) 0%, #ede8e0 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 80 }}
        style={{ textAlign: 'center', marginBottom: '2.5rem' }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            color: '#9ca3af',
            fontSize: '0.8rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}
        >
          Váš víkendový ráj
        </p>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'var(--color-charcoal)',
            lineHeight: 1.2,
          }}
        >
          Rosice u Brna
        </h2>
        <div
          style={{
            width: '60px',
            height: '2px',
            background: 'linear-gradient(to right, #D4AF37, #26A69A)',
            borderRadius: '1px',
            margin: '1rem auto 0',
          }}
        />
      </motion.div>

      {/* Photo collage */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          maxWidth: '640px',
          width: '100%',
          marginBottom: '2.5rem',
        }}
      >
        {PHOTOS.map((photo, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 120 }}
            style={{
              borderRadius: '0.75rem',
              overflow: 'hidden',
              aspectRatio: '1',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Family photo placeholder notice */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
          background: 'rgba(212,175,55,0.1)',
          border: '1px dashed #D4AF37',
          borderRadius: '0.75rem',
          padding: '0.75rem 1.5rem',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8rem',
            color: '#92712a',
          }}
        >
          📸 Sem přijdou vaše společné fotky!
        </p>
      </motion.div>

      {/* CTA Buttons */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
          maxWidth: '380px',
          marginBottom: '3rem',
        }}
      >
        <motion.a
          href="https://www.booking.com/hotel/cz/luxusni-prazdninovy-dum.cs.html"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #B8860B, #D4AF37, #F0C040)',
            color: 'white',
            borderRadius: '1rem',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '0.95rem',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(212,175,55,0.35)',
            letterSpacing: '0.02em',
          }}
        >
          <ExternalLink size={18} />
          Podívat se na naše útočiště
        </motion.a>

        <motion.a
          href="https://maps.google.com/?q=Rosice+u+Brna,+Czech+Republic"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #1a9e96, #26A69A)',
            color: 'white',
            borderRadius: '1rem',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '0.95rem',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(38,166,154,0.3)',
            letterSpacing: '0.02em',
          }}
        >
          <MapPin size={18} />
          Kudy tam?
        </motion.a>
      </div>

      {/* Final message */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, type: 'spring' }}
        style={{ textAlign: 'center', maxWidth: '520px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Heart size={28} color="#e87c7c" fill="#e87c7c" />
        </div>
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--color-charcoal)',
            lineHeight: 1.7,
            marginBottom: '1rem',
          }}
        >
          Už se nemůžeme dočkat, až spolu strávíme víkend v luxusním prázdninovém domě.
        </p>
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
            color: 'var(--color-charcoal)',
            fontWeight: 700,
          }}
        >
          Máme vás rádi – Kryštof, Marek & Kája
        </p>
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          {['❤️', '🏡', '🍷', '🌿', '🔥'].map((emoji, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 200 }}
              style={{ fontSize: '1.5rem' }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
