import { Leaf, GitBranch } from 'lucide-react'

const DATASETS = [
  { label: 'Yuca',    desc: 'Kaggle Cassava Leaf Disease Classification · CC0' },
  { label: 'Plátano', desc: 'BananaLSD — Arman et al. (2023) · CC BY 4.0' },
  { label: 'Cacao',   desc: 'Cacao Diseases — Serrano et al. (2022) · Kaggle' },
]

export default function Footer() {
  return (
    <footer style={{ position: 'relative' }}>
      <div style={{
        background: 'linear-gradient(90deg, var(--brown-dark) 0%, #5a3e2b 40%, var(--brown-mid) 60%, #5a3e2b 80%, var(--brown-dark) 100%)',
        height: '4px',
      }} />

      <div style={{
        background: 'var(--brown-dark)',
        borderTop: '1px solid rgba(201,168,124,0.20)',
        padding: '28px 24px 28px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '16px',
          color: 'rgba(201,168,124,0.35)',
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}>
          <div style={{ height: '1px', width: '60px', background: 'rgba(201,168,124,0.25)' }} />
          <Leaf size={16} color="rgba(183,228,199,0.50)" />
          <div style={{ height: '1px', width: '60px', background: 'rgba(201,168,124,0.25)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
          <Leaf size={20} color="var(--green-pale)" />
          <span style={{ color: 'var(--cream)', fontWeight: 600, fontFamily: 'Playfair Display, serif', fontSize: '1.1rem' }}>
            AmazoniaCrop
          </span>
        </div>

        <p style={{ color: 'rgba(245,240,232,0.50)', fontSize: '0.82rem', marginBottom: '6px' }}>
          Detección de enfermedades en <em>Yuca · Plátano · Cacao</em> · Amazonía Peruana · 2025
        </p>

        {/* Datasets */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          marginBottom: '18px',
        }}>
          {DATASETS.map(d => (
            <div key={d.label} style={{ fontSize: '0.74rem', color: 'rgba(245,240,232,0.30)', textAlign: 'left' }}>
              <span style={{ color: 'rgba(183,228,199,0.50)', fontWeight: 600 }}>{d.label}:</span> {d.desc}
            </div>
          ))}
        </div>

        <a
          href="https://github.com/dNogueira300/cassava-disease-detector"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--green-pale)', fontSize: '0.82rem' }}
        >
          <GitBranch size={15} />
          github.com/dNogueira300/cassava-disease-detector
        </a>
      </div>
    </footer>
  )
}
