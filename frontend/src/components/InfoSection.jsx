import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, Zap, Leaf, AlertTriangle, AlertCircle, CheckCircle, X } from 'lucide-react'

const DISEASES = [
  {
    codigo: 'CMD', nombre: 'Mosaico de la yuca', tipo: 'Viral', urgencia: 'alta',
    agente: 'Begomovirus', color: '#e07c3e',
    resumen: 'La enfermedad más extendida. Mosaico amarillo-verde en hojas deformadas.',
    icon: Zap,
  },
  {
    codigo: 'CBB', nombre: 'Bacteriosis de la yuca', tipo: 'Bacteriana', urgencia: 'alta',
    agente: 'Xanthomonas axonopodis', color: '#c9a87c',
    resumen: 'Manchas angulares acuosas con podredumbre de raíces en humedad alta.',
    icon: Bug,
  },
  {
    codigo: 'CBSD', nombre: 'Rayas pardas de la yuca', tipo: 'Viral', urgencia: 'critica',
    agente: 'Cassava brown streak virus', color: '#c1121f',
    resumen: 'Devastadora. Necrosis interna del tubérculo sin síntomas externos evidentes.',
    icon: AlertTriangle,
  },
  {
    codigo: 'CGM', nombre: 'Moteado verde', tipo: 'Viral', urgencia: 'media',
    agente: 'CsGMV Carlavirus', color: '#52b788',
    resumen: 'Moteado verde en hojas jóvenes. Reducción moderada del rendimiento.',
    icon: AlertCircle,
  },
  {
    codigo: 'HEALTHY', nombre: 'Planta sana', tipo: null, urgencia: 'ninguna',
    agente: null, color: '#1a3d2e',
    resumen: 'Sin síntomas visibles. La planta se encuentra en buen estado fitosanitario.',
    icon: CheckCircle,
  },
]

const URGENCY_LABEL = { ninguna: 'Sana', media: 'Media', alta: 'Alta', critica: 'Crítica' }
const URGENCY_CLASS  = { ninguna: 'sano', media: 'media', alta: 'alta', critica: 'critica' }

export default function InfoSection() {
  const [selected, setSelected] = useState(null)

  return (
    <section style={{ padding: '80px 0', background: 'var(--cream)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '48px' }}
        >
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', marginBottom: '8px' }}>
            Enfermedades detectadas
          </h2>
          <p style={{ color: 'var(--brown-mid)' }}>
            El modelo clasifica 5 categorías en hojas de <em>Manihot esculenta</em>.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {DISEASES.map((d, i) => {
            const Icon = d.icon
            return (
              <motion.div
                key={d.codigo}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, boxShadow: 'var(--shadow-md)' }}
                onClick={() => setSelected(d)}
                style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--radius)',
                  padding: '24px 20px',
                  cursor: 'pointer',
                  border: '1px solid var(--cream-dark)',
                  transition: 'all var(--transition)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <Icon size={28} color={d.color} strokeWidth={1.5} />
                  <span className={`badge badge--${URGENCY_CLASS[d.urgencia]}`}>{URGENCY_LABEL[d.urgencia]}</span>
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>{d.nombre}</h3>
                {d.tipo && <p style={{ fontSize: '0.78rem', color: 'var(--brown-mid)', marginBottom: '8px' }}>{d.tipo}</p>}
                <p style={{ fontSize: '0.82rem', color: 'var(--gray-text)', lineHeight: 1.5 }}>{d.resumen}</p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(26,61,46,0.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '24px',
            }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--white)', borderRadius: 'var(--radius-lg)',
                padding: '32px', maxWidth: '520px', width: '100%',
                maxHeight: '80vh', overflowY: 'auto',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span className={`badge badge--${URGENCY_CLASS[selected.urgencia]}`} style={{ marginBottom: '8px', display: 'inline-flex' }}>
                    {URGENCY_LABEL[selected.urgencia]}
                  </span>
                  <h3 style={{ fontSize: '1.4rem' }}>{selected.nombre}</h3>
                  {selected.agente && <p style={{ color: 'var(--brown-mid)', fontSize: '0.82rem', fontStyle: 'italic' }}>{selected.agente}</p>}
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <X size={20} color="var(--brown-mid)" />
                </button>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--gray-text)' }}>{selected.resumen}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
