import { motion } from 'framer-motion'
import { Leaf, ChevronDown } from 'lucide-react'

export default function Hero() {
  const scrollToAnalysis = () => {
    document.getElementById('analisis')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section style={{
      minHeight: '90vh',
      background: 'linear-gradient(160deg, var(--green-deep) 0%, var(--green-mid) 60%, #1f5c42 100%)',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle texture overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(82,183,136,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(201,168,124,0.10) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            animate={{ rotate: [0, 8, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'inline-block', marginBottom: '20px' }}
          >
            <Leaf size={56} color="var(--green-pale)" strokeWidth={1.5} />
          </motion.div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            color: 'var(--cream)',
            lineHeight: 1.15,
            marginBottom: '20px',
          }}>
            YucaIA
            <br />
            <span style={{ color: 'var(--green-pale)', fontSize: '0.65em', fontWeight: 600 }}>
              Detección de Enfermedades
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{
              color: 'rgba(245,240,232,0.80)',
              fontSize: '1.1rem',
              maxWidth: '520px',
              marginBottom: '16px',
              lineHeight: 1.7,
            }}
          >
            <em>Manihot esculenta</em> · Amazonía Peruana
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            style={{
              color: 'rgba(245,240,232,0.65)',
              fontSize: '0.95rem',
              maxWidth: '520px',
              marginBottom: '48px',
              lineHeight: 1.7,
            }}
          >
            Sube una fotografía de una hoja de yuca y obtén un diagnóstico fitosanitario
            inmediato con recomendaciones de tratamiento y prevención.
          </motion.p>

          <motion.button
            className="btn-primary"
            onClick={scrollToAnalysis}
            style={{
              fontSize: '1.05rem',
              padding: '16px 40px',
              background: 'var(--cream)',
              color: 'var(--green-deep)',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Iniciar diagnóstico
            <ChevronDown size={18} />
          </motion.button>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          style={{
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {[
            { value: '21,367', label: 'imágenes' },
            { value: '5', label: 'clases' },
            { value: '~91%', label: 'precisión' },
          ].map((s) => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 'var(--radius)',
              padding: '12px 20px',
              textAlign: 'center',
              minWidth: '100px',
            }}>
              <div style={{ color: 'var(--cream)', fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>{s.value}</div>
              <div style={{ color: 'rgba(245,240,232,0.60)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
