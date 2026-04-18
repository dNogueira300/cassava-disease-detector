import { motion } from 'framer-motion'
import { Leaf, ChevronDown } from 'lucide-react'

const STATS = [
  { value: '21,367', label: 'imágenes' },
  { value: '5',      label: 'clases'   },
  { value: '~91%',   label: 'precisión'},
]

export default function Hero() {
  const scrollToAnalysis = () => {
    document.getElementById('analisis')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/amazonia_bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, rgba(8,24,16,0.85) 0%, rgba(20,50,36,0.75) 50%, rgba(10,30,20,0.90) 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.50) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Main content */}
      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '0 24px' }}>

        {/* Row: text block + stats */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '56px',
          flexWrap: 'wrap',
        }}>

          {/* ── Text block ── */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ flex: '1 1 360px' }}
          >
            {/* Leaf — bloque propio para no fluir inline con el badge */}
            <div style={{ marginBottom: '20px' }}>
              <motion.div
                animate={{ rotate: [0, 8, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'inline-block' }}
              >
                <Leaf size={54} color="#b7e4c7" strokeWidth={1.4} />
              </motion.div>
            </div>

            {/* Badge — bloque propio */}
            <div style={{ marginBottom: '18px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(82,183,136,0.18)',
                border: '1px solid rgba(183,228,199,0.28)',
                borderRadius: '999px',
                padding: '5px 14px',
                fontSize: '0.73rem',
                color: '#b7e4c7',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#52b788', flexShrink: 0 }} />
                Inteligencia Artificial · Agricultura de Precisión
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.8rem, 7vw, 5rem)',
              color: '#f5f0e8',
              lineHeight: 1.05,
              marginBottom: '10px',
              textShadow: '0 2px 24px rgba(0,0,0,0.45)',
              display: 'block',
            }}>
              YucaIA
            </h1>
            <p style={{
              fontSize: 'clamp(1.05rem, 2.5vw, 1.5rem)',
              color: '#b7e4c7',
              fontWeight: 600,
              marginBottom: '22px',
              fontFamily: 'Playfair Display, serif',
              textShadow: '0 2px 12px rgba(0,0,0,0.35)',
            }}>
              Detección de Enfermedades Foliares
            </p>
            <p style={{ color: 'rgba(245,240,232,0.70)', fontSize: '0.97rem', maxWidth: '460px', marginBottom: '8px', lineHeight: 1.75 }}>
              <em>Manihot esculenta</em> · Amazonía Peruana
            </p>
            <p style={{ color: 'rgba(245,240,232,0.52)', fontSize: '0.93rem', maxWidth: '460px', marginBottom: '40px', lineHeight: 1.75 }}>
              Sube una fotografía de una hoja de yuca y obtén un diagnóstico
              fitosanitario inmediato con recomendaciones de tratamiento y prevención.
            </p>

            {/* CTA — bloque propio, alineado izquierda */}
            <div>
              <motion.button
                className="btn-primary"
                onClick={scrollToAnalysis}
                style={{
                  fontSize: '1.05rem',
                  padding: '16px 44px',
                  background: 'var(--cream)',
                  color: 'var(--green-deep)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
                }}
                whileHover={{ scale: 1.04, boxShadow: '0 6px 32px rgba(0,0,0,0.45)' }}
                whileTap={{ scale: 0.97 }}
              >
                Iniciar diagnóstico
                <ChevronDown size={18} />
              </motion.button>
            </div>
          </motion.div>

          {/* ── Stats column ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px', flexShrink: 0 }}
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.12, duration: 0.5 }}
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.14)' }}
                style={{
                  background: 'rgba(255,255,255,0.09)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: 'var(--radius)',
                  padding: '16px 28px',
                  textAlign: 'center',
                  minWidth: '120px',
                  cursor: 'default',
                  transition: 'background 0.25s ease',
                }}
              >
                <div style={{ color: '#f5f0e8', fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>{s.value}</div>
                <div style={{ color: 'rgba(245,240,232,0.50)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Scroll arrow — centrado abajo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          color: 'rgba(245,240,232,0.35)',
        }}
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={22} />
        </motion.div>
      </motion.div>
    </section>
  )
}
