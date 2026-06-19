import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, Zap, Leaf, AlertTriangle, AlertCircle, CheckCircle, X, ChevronRight } from 'lucide-react'

const CULTIVOS_DATA = {
  yuca: {
    nombre:     'Yuca',
    cientifico: 'Manihot esculenta Crantz',
    imagen:     '/yuca.png',
    descripcion:'Cultivo base de la Amazonía peruana. El sistema detecta 5 categorías usando un ensemble EfficientNet-B4 + Swin Transformer (89.04%).',
    enfermedades: [
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
    ],
  },
  platano: {
    nombre:     'Plátano / Banano',
    cientifico: 'Musa paradisiaca L.',
    imagen:     '/platano.png',
    descripcion:'Principal cultivo comercial de Ucayali y San Martín. El modelo MobileNetV2 detecta 4 categorías con 99.4% de precisión.',
    enfermedades: [
      {
        codigo: 'SIGATOKA', nombre: 'Sigatoka — Mancha foliar', tipo: 'Fúngica', urgencia: 'alta',
        agente: 'Mycosphaerella fijiensis / M. musicola', color: '#c1121f',
        resumen: 'Enfermedad fúngica más importante del plátano. Destruye el área foliar y reduce el rendimiento 30-50%.',
        icon: AlertTriangle,
      },
      {
        codigo: 'CORDANA', nombre: 'Mancha de Cordana', tipo: 'Fúngica', urgencia: 'media',
        agente: 'Neocordana musae', color: '#e07c3e',
        resumen: 'Manchas ovales de color marrón claro con halo amarillo. Reducción de 10-20% en rendimiento.',
        icon: AlertCircle,
      },
      {
        codigo: 'PESTALOTIOPSIS', nombre: 'Mancha de Pestalotiopsis', tipo: 'Fúngica', urgencia: 'media',
        agente: 'Pestalotiopsis microspora', color: '#c9a87c',
        resumen: 'Oportunista en plantas debilitadas. Manchas irregulares marrón oscuro con bordes amarillos.',
        icon: Bug,
      },
      {
        codigo: 'HEALTHY', nombre: 'Planta sana', tipo: null, urgencia: 'ninguna',
        agente: null, color: '#1a3d2e',
        resumen: 'Sin síntomas visibles. La planta de plátano se encuentra en buen estado fitosanitario.',
        icon: CheckCircle,
      },
    ],
  },
  cacao: {
    nombre:     'Cacao',
    cientifico: 'Theobroma cacao L.',
    imagen:     '/cacao.png',
    descripcion:'Cultivo estratégico de la Amazonía peruana. EfficientNet-B0 detecta 2 categorías en vainas con 95.1% de precisión.',
    enfermedades: [
      {
        codigo: 'BLACK_POD_ROT', nombre: 'Pudrición negra — Fitóftora', tipo: 'Oomyceto', urgencia: 'critica',
        agente: 'Phytophthora palmivora', color: '#c1121f',
        resumen: 'La enfermedad más agresiva del cacao. Puede destruir una vaina completa en 2-3 días.',
        icon: AlertTriangle,
      },
      {
        codigo: 'HEALTHY', nombre: 'Vaina sana', tipo: null, urgencia: 'ninguna',
        agente: null, color: '#1a3d2e',
        resumen: 'Sin síntomas visibles. La vaina de cacao se encuentra en buen estado fitosanitario.',
        icon: CheckCircle,
      },
    ],
  },
}

const URGENCY_LABEL = { ninguna: 'Sana', media: 'Media', alta: 'Alta', critica: 'Crítica' }
const URGENCY_CLASS  = { ninguna: 'sano', media: 'media', alta: 'alta', critica: 'critica' }

const TABS = [
  { id: 'yuca',    label: 'Yuca'    },
  { id: 'platano', label: 'Plátano' },
  { id: 'cacao',   label: 'Cacao'   },
]

function EnfermedadesList({ enfermedades, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {enfermedades.map((d, i) => {
        const Icon = d.icon
        return (
          <motion.div
            key={d.codigo}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            whileHover={{ x: 6, boxShadow: 'var(--shadow-md)', borderColor: d.color + '55' }}
            onClick={() => onSelect(d)}
            style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius)',
              padding: '16px 20px',
              cursor: 'pointer',
              border: '1px solid var(--cream-dark)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'border-color 0.25s ease, background 0.25s ease',
            }}
          >
            <div style={{
              flexShrink: 0,
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: `${d.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1.5px solid ${d.color}28`,
            }}>
              <Icon size={20} color={d.color} strokeWidth={1.6} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '0.95rem', margin: 0 }}>{d.nombre}</h3>
                {d.tipo && <span style={{ fontSize: '0.72rem', color: 'var(--brown-mid)', fontStyle: 'italic' }}>· {d.tipo}</span>}
              </div>
              <p style={{ fontSize: '0.83rem', color: 'var(--gray-text)', lineHeight: 1.5, margin: 0 }}>{d.resumen}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <span className={`badge badge--${URGENCY_CLASS[d.urgencia]}`}>
                {URGENCY_LABEL[d.urgencia]}
              </span>
              <ChevronRight size={14} color="var(--brown-mid)" style={{ opacity: 0.5 }} />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function InfoSection({ cultivo }) {
  const [tabActivo, setTabActivo] = useState('yuca')
  const [selected, setSelected]   = useState(null)

  const datos = CULTIVOS_DATA[tabActivo]

  return (
    <section style={{ padding: '80px 0', background: 'var(--cream)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-50px' }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '36px' }}
        >
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', marginBottom: '6px' }}>
            Enfermedades detectadas
          </h2>
          <p style={{ color: 'var(--brown-mid)', fontSize: '0.95rem' }}>
            Información sobre las categorías que reconoce cada modelo de IA.
          </p>
        </motion.div>

        {/* Tabs de cultivo */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <motion.button
              key={t.id}
              onClick={() => setTabActivo(t.id)}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                border: tabActivo === t.id
                  ? '1.5px solid var(--green-light)'
                  : '1.5px solid var(--cream-dark)',
                background: tabActivo === t.id ? 'var(--green-deep)' : 'var(--white)',
                color: tabActivo === t.id ? 'var(--cream)' : 'var(--brown-mid)',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: tabActivo === t.id ? 600 : 400,
                transition: 'all 0.2s ease',
              }}
            >
              {t.label}
            </motion.button>
          ))}
        </div>

        {/* Contenido del tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tabActivo}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header del cultivo */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '24px',
              padding: '18px 20px',
              background: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--cream-dark)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <img
                src={datos.imagen}
                alt={datos.nombre}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
              <div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '2px' }}>{datos.nombre}</h3>
                <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--brown-mid)', marginBottom: '6px' }}>
                  {datos.cientifico}
                </p>
                <p style={{ fontSize: '0.84rem', color: 'var(--gray-text)', lineHeight: 1.5, margin: 0 }}>
                  {datos.descripcion}
                </p>
              </div>
            </div>

            <EnfermedadesList enfermedades={datos.enfermedades} onSelect={setSelected} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal de detalle */}
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
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
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
                  <h3 style={{ fontSize: '1.3rem' }}>{selected.nombre}</h3>
                  {selected.agente && (
                    <p style={{ color: 'var(--brown-mid)', fontSize: '0.82rem', fontStyle: 'italic' }}>
                      {selected.agente}
                    </p>
                  )}
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
