import { motion } from 'framer-motion'
import { MapPin, Sprout, Sun, Droplets } from 'lucide-react'

const FACTS = [
  { icon: MapPin,   label: 'Región',       value: 'Amazonía Peruana'  },
  { icon: Sprout,   label: 'Nombre',        value: 'Manihot esculenta' },
  { icon: Sun,      label: 'Ciclo',         value: '8–12 meses'        },
  { icon: Droplets, label: 'Precipitación', value: '1,000–2,000 mm/año'},
]

export default function CassavaCultivo() {
  return (
    <section style={{ padding: '100px 0', background: 'var(--white)', overflow: 'hidden' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '72px',
          alignItems: 'center',
        }}>

          {/* ── Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            style={{ position: 'relative' }}
          >
            <div style={{
              position: 'absolute', inset: '-18px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, rgba(82,183,136,0.22) 0%, rgba(201,168,124,0.12) 100%)',
              transform: 'rotate(-2.5deg)',
            }} />
            <div style={{
              position: 'absolute', top: '-28px', right: '-28px',
              width: '90px', height: '90px',
              backgroundImage: 'radial-gradient(circle, var(--green-pale) 1.5px, transparent 1.5px)',
              backgroundSize: '11px 11px',
              opacity: 0.55, zIndex: 0,
            }} />

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.35 }}
              style={{
                position: 'relative', zIndex: 1,
                borderRadius: '20px', overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(26,61,46,0.18)',
                aspectRatio: '4 / 3',
                cursor: 'default',
              }}
            >
              <img
                src="/yuca.png"
                alt="Planta de yuca amazónica"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(10,30,20,0.75))',
                padding: '48px 20px 16px',
              }}>
                <p style={{ color: 'rgba(245,240,232,0.85)', fontSize: '0.80rem', fontStyle: 'italic', letterSpacing: '0.04em', margin: 0 }}>
                  Manihot esculenta · Cuenca amazónica
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Text ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <span style={{
              display: 'inline-block', alignSelf: 'flex-start',
              background: 'var(--green-pale)', color: 'var(--green-deep)',
              padding: '4px 14px', borderRadius: '999px',
              fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              marginBottom: '18px',
            }}>
              Sobre el cultivo
            </span>

            <h2 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)', marginBottom: '20px', lineHeight: 1.2 }}>
              La yuca amazónica:<br />
              <span style={{ color: 'var(--green-mid)' }}>cultivo clave del trópico</span>
            </h2>

            <p style={{ color: 'var(--gray-text)', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: '16px' }}>
              La yuca (<em>Manihot esculenta</em>) es el tercer cultivo de raíces más importante del
              mundo y el principal tubérculo de la Amazonía peruana. Millones de familias rurales
              dependen de su producción para seguridad alimentaria y generación de ingresos.
            </p>
            <p style={{ color: 'var(--brown-mid)', fontSize: '0.93rem', lineHeight: 1.8, marginBottom: '36px' }}>
              Sin embargo, enfermedades virales y bacterianas pueden reducir los rendimientos hasta
              en un <strong style={{ color: 'var(--green-deep)' }}>80%</strong>. La detección temprana
              mediante inteligencia artificial permite intervenir antes de que los daños sean
              irreversibles.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {FACTS.map(({ icon: Icon, label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: '-40px' }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  whileHover={{
                    y: -3,
                    boxShadow: 'var(--shadow-md)',
                    background: 'var(--cream-dark)',
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'var(--cream)', borderRadius: 'var(--radius)',
                    padding: '12px 16px', border: '1px solid var(--cream-dark)',
                    cursor: 'default', transition: 'background 0.25s ease',
                  }}
                >
                  <div style={{ background: 'var(--green-pale)', borderRadius: '8px', padding: '7px', display: 'flex', flexShrink: 0 }}>
                    <Icon size={15} color="var(--green-deep)" strokeWidth={2} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.67rem', color: 'var(--brown-mid)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--green-deep)', fontWeight: 600, marginTop: '1px' }}>{value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
