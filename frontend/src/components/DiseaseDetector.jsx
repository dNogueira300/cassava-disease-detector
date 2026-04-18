import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ImagePlus, ScanLine, Loader2, CheckCircle, AlertTriangle, AlertCircle, Shield, Leaf } from 'lucide-react'
import axios from 'axios'

const URGENCY_CONFIG = {
  ninguna: { icon: CheckCircle,    color: '#1b4332', bg: '#d8f3dc', label: 'Planta sana'   },
  media:   { icon: AlertCircle,    color: '#7d4e00', bg: '#fff3cd', label: 'Urgencia media' },
  alta:    { icon: AlertTriangle,  color: '#7f2c00', bg: '#fde8d8', label: 'Urgencia alta'  },
  critica: { icon: AlertTriangle,  color: '#7f0000', bg: '#fce4e4', label: 'Urgencia crítica'},
}

export default function DiseaseDetector() {
  const [imagen, setImagen]        = useState(null)
  const [preview, setPreview]      = useState(null)
  const [resultado, setResultado]  = useState(null)
  const [cargando, setCargando]    = useState(false)
  const [error, setError]          = useState(null)
  const [tab, setTab]              = useState('sintomas')
  const [dragging, setDragging]    = useState(false)
  const inputRef                   = useRef()

  const procesarArchivo = (file) => {
    if (!file) return
    setImagen(file)
    setPreview(URL.createObjectURL(file))
    setResultado(null)
    setError(null)
  }

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    procesarArchivo(e.dataTransfer.files[0])
  }

  const analizar = async () => {
    if (!imagen) return
    setCargando(true); setError(null); setResultado(null)
    try {
      const fd = new FormData()
      fd.append('imagen', imagen)
      const { data } = await axios.post('/api/analizar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResultado(data)
      setTab('sintomas')
    } catch {
      setError('No se pudo conectar con el servidor. ¿Está el backend corriendo en puerto 8000?')
    } finally {
      setCargando(false)
    }
  }

  const urgCfg = resultado ? URGENCY_CONFIG[resultado.urgencia] ?? URGENCY_CONFIG.alta : null
  const UrgIcon = urgCfg?.icon

  return (
    <section id="analisis" style={{ padding: '80px 0', background: 'var(--white)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', marginBottom: '8px' }}>
            Análisis de hoja
          </h2>
          <p style={{ color: 'var(--brown-mid)', marginBottom: '40px' }}>
            Sube una fotografía tomada con celular para obtener el diagnóstico.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: '32px', alignItems: 'start' }}>
          {/* Drop zone */}
          <motion.div layout>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current.click()}
              style={{
                border: `2px dashed ${dragging ? 'var(--green-mid)' : 'var(--green-pale)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '40px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragging ? 'rgba(82,183,136,0.06)' : 'var(--cream)',
                transition: 'all var(--transition)',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              {preview ? (
                <img src={preview} alt="preview" style={{ maxHeight: '240px', borderRadius: '10px', objectFit: 'cover', width: '100%' }} />
              ) : (
                <>
                  <ImagePlus size={48} color="var(--green-light)" strokeWidth={1.3} />
                  <p style={{ color: 'var(--green-mid)', fontWeight: 500 }}>Arrastra una imagen o haz clic aquí</p>
                  <p style={{ color: 'var(--brown-mid)', fontSize: '0.85rem' }}>JPG, PNG — fotografía de hoja de yuca</p>
                </>
              )}
              <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => procesarArchivo(e.target.files[0])} />
            </div>

            {preview && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                <motion.button
                  className="btn-primary"
                  onClick={analizar}
                  disabled={cargando}
                  style={{ flex: 1, justifyContent: 'center' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {cargando
                    ? <><Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Analizando…</>
                    : <><ScanLine size={18} /> Analizar hoja</>
                  }
                </motion.button>
                <button
                  onClick={() => { setImagen(null); setPreview(null); setResultado(null); setError(null) }}
                  style={{ padding: '14px 20px', border: '1.5px solid var(--green-pale)', borderRadius: 'var(--radius)', background: 'transparent', cursor: 'pointer', color: 'var(--green-mid)' }}
                >
                  Limpiar
                </button>
              </motion.div>
            )}

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--red-alert)', marginTop: '12px', fontSize: '0.9rem' }}>
                {error}
              </motion.p>
            )}
          </motion.div>

          {/* Result panel */}
          <AnimatePresence>
            {resultado && (
              <motion.div
                key="resultado"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                style={{
                  background: 'var(--cream)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  border: '1px solid var(--cream-dark)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                {/* Status badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ background: urgCfg.bg, borderRadius: '50%', padding: '8px', display: 'flex' }}>
                    <UrgIcon size={22} color={urgCfg.color} />
                  </div>
                  <span className={`badge badge--${resultado.urgencia === 'ninguna' ? 'sano' : resultado.urgencia}`}>
                    {urgCfg.label}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{resultado.nombre_es}</h3>
                {resultado.agente && <p style={{ color: 'var(--brown-mid)', fontSize: '0.85rem', marginBottom: '8px', fontStyle: 'italic' }}>{resultado.agente}</p>}

                {resultado.tipo && (
                  <span style={{ display: 'inline-block', background: 'var(--cream-dark)', padding: '3px 10px', borderRadius: '6px', fontSize: '0.78rem', marginBottom: '16px' }}>
                    Tipo: {resultado.tipo}
                  </span>
                )}

                {/* Confidence */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--brown-mid)' }}>
                    <span>Confianza del modelo</span>
                    <strong>{resultado.confianza}%</strong>
                  </div>
                  <div className="confidence-bar">
                    <div className="confidence-bar__fill" style={{ width: `${resultado.confianza}%` }} />
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', marginBottom: '20px', color: 'var(--gray-text)' }}>{resultado.descripcion}</p>

                {/* Tabs */}
                {resultado.urgencia !== 'ninguna' && (
                  <>
                    <div className="tabs">
                      {['sintomas', 'tratamiento', 'prevencion'].map(t => (
                        <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                    <ul style={{ paddingLeft: '20px', fontSize: '0.87rem', lineHeight: 1.8, color: 'var(--gray-text)' }}>
                      {resultado[tab]?.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </>
                )}

                {resultado.urgencia === 'ninguna' && (
                  <ul style={{ paddingLeft: '20px', fontSize: '0.87rem', lineHeight: 1.8, color: 'var(--gray-text)' }}>
                    {resultado.tratamiento?.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                )}

                <div style={{ marginTop: '16px', padding: '10px 14px', background: 'var(--cream-dark)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--brown-mid)' }}>
                  <Shield size={13} style={{ display: 'inline', marginRight: '6px' }} />
                  {resultado.impacto}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </section>
  )
}
