import { Leaf, GitBranch } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--brown-dark)',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
        <Leaf size={20} color="var(--green-pale)" />
        <span style={{ color: 'var(--cream)', fontWeight: 600, fontFamily: 'Playfair Display, serif' }}>YucaIA</span>
      </div>
      <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: '0.82rem', marginBottom: '12px' }}>
        Detección de enfermedades en <em>Manihot esculenta</em> · Amazonía Peruana · 2025
      </p>
      <p style={{ color: 'rgba(245,240,232,0.40)', fontSize: '0.78rem', marginBottom: '16px' }}>
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
    </footer>
  )
}
