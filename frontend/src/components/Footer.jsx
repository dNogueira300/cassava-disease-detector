import { Leaf, GitBranch } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ position: 'relative' }}>
      {/* Visual separator strip — leaf pattern band */}
      <div style={{
        background: 'linear-gradient(90deg, var(--brown-dark) 0%, #5a3e2b 40%, var(--brown-mid) 60%, #5a3e2b 80%, var(--brown-dark) 100%)',
        height: '4px',
      }} />

      {/* Top accent line */}
      <div style={{
        background: 'var(--brown-dark)',
        borderTop: '1px solid rgba(201,168,124,0.20)',
        padding: '28px 24px 24px',
        textAlign: 'center',
      }}>
        {/* Decorative divider element */}
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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <Leaf size={20} color="var(--green-pale)" />
          <span style={{ color: 'var(--cream)', fontWeight: 600, fontFamily: 'Playfair Display, serif', fontSize: '1.1rem' }}>YucaIA</span>
        </div>
        <p style={{ color: 'rgba(245,240,232,0.50)', fontSize: '0.82rem', marginBottom: '10px' }}>
          Detección de enfermedades en <em>Manihot esculenta</em> · Amazonía Peruana · 2025
        </p>
        <p style={{ color: 'rgba(245,240,232,0.35)', fontSize: '0.78rem', marginBottom: '18px' }}>
          Modelo: EfficientNet-B4 · Dataset: Kaggle Cassava Leaf Disease Classification · CC0
        </p>
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
