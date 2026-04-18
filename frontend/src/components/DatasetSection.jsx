import { motion } from 'framer-motion'
import { Database, GitBranch, ExternalLink, Info } from 'lucide-react'

const LINKS = [
  {
    icon: Database,
    title: 'Dataset · Kaggle 2020',
    desc: '21,367 imágenes etiquetadas · NaCRRI + Makerere AI Lab · CC0',
    href: 'https://www.kaggle.com/c/cassava-leaf-disease-classification',
    meta: '5 clases · JPG · fotografías de celular',
  },
  {
    icon: GitBranch,
    title: 'Top 1% Kaggle — CNN + ViT',
    desc: 'Ensemble EfficientNet + Vision Transformer · 91.06% precisión',
    href: 'https://github.com/kozodoi/Kaggle_Leaf_Disease_Classification',
    meta: 'Puesto 14 de 3,900 equipos',
  },
  {
    icon: GitBranch,
    title: 'EfficientNetB4 Transfer Learning',
    desc: 'Fine-tuning con PyTorch · Pipeline completo documentado',
    href: 'https://github.com/Lwhieldon/Cassava-Leaf-Disease-Classification',
    meta: '~86% validación',
  },
  {
    icon: GitBranch,
    title: 'ResNet-152 + TTA',
    desc: 'Test Time Augmentation · EDA completo · Albumentations',
    href: 'https://github.com/owenpb/Kaggle-Cassava-Leaf-Classification',
    meta: 'PyTorch + torchvision',
  },
]

const METRICS = [
  { label: 'Imágenes de entrenamiento', value: '21,367' },
  { label: 'Clases', value: '5' },
  { label: 'Precisión EfficientNet-B4', value: '~91%' },
  { label: 'Tamaño de entrada', value: '380×380 px' },
  { label: 'Inferencia CPU', value: '~100–300 ms' },
  { label: 'Licencia dataset', value: 'CC0' },
]

export default function DatasetSection() {
  return (
    <section style={{ padding: '80px 0', background: 'var(--green-deep)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '48px' }}
        >
          <h2 style={{ color: 'var(--cream)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', marginBottom: '8px' }}>
            Dataset y recursos
          </h2>
          <p style={{ color: 'rgba(245,240,232,0.65)' }}>
            Fuentes utilizadas para el entrenamiento del modelo.
          </p>
        </motion.div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '48px' }}>
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              style={{
                background: 'rgba(255,255,255,0.07)',
                borderRadius: 'var(--radius)',
                padding: '16px',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <div style={{ color: 'var(--green-pale)', fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>{m.value}</div>
              <div style={{ color: 'rgba(245,240,232,0.55)', fontSize: '0.75rem', marginTop: '4px' }}>{m.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {LINKS.map((l, i) => {
            const Icon = l.icon
            return (
              <motion.a
                key={l.title}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                style={{
                  display: 'block',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 'var(--radius)',
                  padding: '20px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  textDecoration: 'none',
                  transition: 'all var(--transition)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <Icon size={22} color="var(--green-pale)" strokeWidth={1.5} />
                  <ExternalLink size={14} color="rgba(245,240,232,0.4)" />
                </div>
                <div style={{ color: 'var(--cream)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{l.title}</div>
                <div style={{ color: 'rgba(245,240,232,0.60)', fontSize: '0.78rem', marginBottom: '8px' }}>{l.desc}</div>
                <div style={{ color: 'var(--green-pale)', fontSize: '0.72rem' }}>{l.meta}</div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
