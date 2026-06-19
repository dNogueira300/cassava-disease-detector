import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

const CULTIVOS = [
  {
    id:          'yuca',
    nombre:      'Yuca',
    cientifico:  'Manihot esculenta',
    imagen:      '/yuca.png',
    clases:      5,
    precision:   '89.04%',
    modelo:      'EfficientNet-B4 + Swin Ensemble',
    descripcion: 'Cultivo base de la Amazonía peruana — 23 variedades en Loreto y Ucayali',
    color:       '#52b788',
  },
  {
    id:          'platano',
    nombre:      'Plátano / Banano',
    cientifico:  'Musa paradisiaca',
    imagen:      '/platano.png',
    clases:      4,
    precision:   '99.4%',
    modelo:      'MobileNetV2 + TTA×5',
    descripcion: 'Principal cultivo comercial de Ucayali y San Martín',
    color:       '#f4a261',
  },
  {
    id:          'cacao',
    nombre:      'Cacao',
    cientifico:  'Theobroma cacao',
    imagen:      '/cacao.png',
    clases:      2,
    precision:   '95.1%',
    modelo:      'EfficientNet-B0 + TTA×5',
    descripcion: 'Cultivo estratégico para la economía amazónica peruana',
    color:       '#c9a87c',
  },
]

export default function CropSelector({ cultivoSeleccionado, onSeleccionar }) {
  return (
    <section id="selector" style={{
      padding: '80px 0 60px',
      background: 'var(--white)',
    }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-50px' }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '40px' }}
        >
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--green-deep)',
            color: '#b7e4c7',
            padding: '7px 18px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            marginBottom: '14px',
            boxShadow: '0 2px 12px rgba(26,61,46,0.18)',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#52b788', flexShrink: 0 }} />
            Paso 1 — Selecciona el cultivo
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', marginBottom: '6px' }}>
            ¿Qué cultivo deseas analizar?
          </h2>
          <p style={{ color: 'var(--brown-mid)', fontSize: '0.95rem' }}>
            Cada cultivo usa un modelo de IA especializado entrenado con su propio dataset.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
        }}>
          {CULTIVOS.map((c, i) => {
            const activo = cultivoSeleccionado === c.id
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(0,0,0,0.12)' }}
                onClick={() => onSeleccionar(c.id)}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: activo
                    ? `2px solid ${c.color}`
                    : '2px solid var(--cream-dark)',
                  boxShadow: activo
                    ? `0 8px 28px ${c.color}33`
                    : 'var(--shadow-sm)',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                  background: 'var(--white)',
                }}
              >
                {/* Imagen del cultivo */}
                <div style={{
                  height: '160px',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <img
                    src={c.imagen}
                    alt={c.nombre}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: activo
                      ? `linear-gradient(180deg, transparent 40%, ${c.color}44 100%)`
                      : 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.35) 100%)',
                    transition: 'background 0.25s ease',
                  }} />

                  {/* Badge de precisión */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(6px)',
                    borderRadius: '999px',
                    padding: '3px 10px',
                    fontSize: '0.72rem',
                    color: '#fff',
                    fontWeight: 600,
                    border: `1px solid ${c.color}88`,
                  }}>
                    {c.precision}
                  </div>

                  {/* Checkmark de selección */}
                  {activo && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                      }}
                    >
                      <CheckCircle size={24} color={c.color} fill="white" />
                    </motion.div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '16px 18px 18px' }}>
                  <h3 style={{
                    fontSize: '1.05rem',
                    marginBottom: '2px',
                    color: activo ? c.color : 'var(--brown-dark)',
                    transition: 'color 0.25s ease',
                  }}>
                    {c.nombre}
                  </h3>
                  <p style={{
                    fontSize: '0.78rem',
                    fontStyle: 'italic',
                    color: 'var(--brown-mid)',
                    marginBottom: '10px',
                  }}>
                    {c.cientifico}
                  </p>
                  <p style={{
                    fontSize: '0.83rem',
                    color: 'var(--gray-text)',
                    lineHeight: 1.5,
                    marginBottom: '12px',
                  }}>
                    {c.descripcion}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '3px 9px',
                      borderRadius: '6px',
                      background: `${c.color}18`,
                      color: c.color,
                      fontWeight: 600,
                      border: `1px solid ${c.color}30`,
                    }}>
                      {c.clases} clases
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '3px 9px',
                      borderRadius: '6px',
                      background: 'var(--cream)',
                      color: 'var(--brown-mid)',
                      border: '1px solid var(--cream-dark)',
                    }}>
                      {c.modelo}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
