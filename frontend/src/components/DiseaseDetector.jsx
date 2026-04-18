import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ImagePlus, ScanLine, CheckCircle, AlertTriangle, AlertCircle, Shield, Leaf } from 'lucide-react'
import axios from 'axios'

const URGENCY_CONFIG = {
  ninguna: { icon: CheckCircle,    color: '#1b4332', bg: '#d8f3dc', label: 'Planta sana'    },
  media:   { icon: AlertCircle,    color: '#7d4e00', bg: '#fff3cd', label: 'Urgencia media'  },
  alta:    { icon: AlertTriangle,  color: '#7f2c00', bg: '#fde8d8', label: 'Urgencia alta'   },
  critica: { icon: AlertTriangle,  color: '#7f0000', bg: '#fce4e4', label: 'Urgencia crítica' },
}

const LOADING_STEPS = [
  { label: 'Preprocesando imagen…',        pct: 15 },
  { label: 'Normalizando canales RGB…',    pct: 35 },
  { label: 'Extrayendo características…', pct: 55 },
  { label: 'Analizando patrones foliares…',pct: 75 },
  { label: 'Generando diagnóstico…',       pct: 92 },
]

function AnalysisLoader({ preview }) {
  const [stepIdx, setStepIdx]   = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timers = []
    LOADING_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => {
        setStepIdx(i)
        setProgress(step.pct)
      }, i * 900))
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  const currentStep = LOADING_STEPS[stepIdx]

  return (
    <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden' }}>
      {/* Preview image base */}
      <img
        src={preview}
        alt="analizando"
        style={{
          width: '100%',
          maxHeight: '260px',
          objectFit: 'cover',
          display: 'block',
          filter: 'brightness(0.55) saturate(0.6)',
        }}
      />

      {/* Scan line sweeping top→bottom */}
      <motion.div
        animate={{ top: ['-4px', '100%'] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, #52b788 20%, #b7e4c7 50%, #52b788 80%, transparent 100%)',
          boxShadow: '0 0 12px 4px rgba(82,183,136,0.55)',
          pointerEvents: 'none',
        }}
      />

      {/* Corner brackets */}
      {[
        { top: '10px', left: '10px', borderTop: '2px solid #52b788', borderLeft: '2px solid #52b788' },
        { top: '10px', right: '10px', borderTop: '2px solid #52b788', borderRight: '2px solid #52b788' },
        { bottom: '10px', left: '10px', borderBottom: '2px solid #52b788', borderLeft: '2px solid #52b788' },
        { bottom: '10px', right: '10px', borderBottom: '2px solid #52b788', borderRight: '2px solid #52b788' },
      ].map((style, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
          style={{
            position: 'absolute',
            width: '18px',
            height: '18px',
            ...style,
          }}
        />
      ))}

      {/* Center pulse ring */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: '2px solid #52b788',
            position: 'absolute',
          }}
        />
        <motion.div
          animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: '1.5px solid rgba(82,183,136,0.50)',
            position: 'absolute',
          }}
        />
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(26,61,46,0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid rgba(82,183,136,0.60)',
        }}>
          <Leaf size={20} color="#b7e4c7" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  )
}

export default function DiseaseDetector() {
  const [imagen, setImagen]        = useState(null)
  const [preview, setPreview]      = useState(null)
  const [resultado, setResultado]  = useState(null)
  const [cargando, setCargando]    = useState(false)
  const [error, setError]          = useState(null)
  const [tab, setTab]              = useState('sintomas')
  const [dragging, setDragging]    = useState(false)
  const [stepIdx, setStepIdx]      = useState(0)
  const [progress, setProgress]    = useState(0)
  const inputRef                   = useRef()
  const stepTimers                 = useRef([])

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

  const startLoadingSteps = () => {
    setStepIdx(0); setProgress(0)
    stepTimers.current.forEach(clearTimeout)
    LOADING_STEPS.forEach((step, i) => {
      stepTimers.current[i] = setTimeout(() => {
        setStepIdx(i)
        setProgress(step.pct)
      }, i * 900)
    })
  }

  const stopLoadingSteps = () => {
    stepTimers.current.forEach(clearTimeout)
  }

  const analizar = async () => {
    if (!imagen) return
    setCargando(true); setError(null); setResultado(null)
    startLoadingSteps()
    try {
      const fd = new FormData()
      fd.append('imagen', imagen)
      const { data } = await axios.post('/api/analizar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      stopLoadingSteps()
      setProgress(100)
      await new Promise(r => setTimeout(r, 380))
      setResultado(data)
      setTab('sintomas')
    } catch {
      stopLoadingSteps()
      setError('No se pudo conectar con el servidor. ¿Está el backend corriendo en puerto 8000?')
    } finally {
      setCargando(false)
      setProgress(0)
    }
  }

  const urgCfg = resultado ? URGENCY_CONFIG[resultado.urgencia] ?? URGENCY_CONFIG.alta : null
  const UrgIcon = urgCfg?.icon

  return (
    <section id="analisis" style={{
      padding: '100px 0 120px',
      background: 'linear-gradient(180deg, var(--green-deep) 0%, #0f2820 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 10% 90%, rgba(82,183,136,0.08) 0%, transparent 50%), radial-gradient(circle at 90% 10%, rgba(201,168,124,0.06) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '52px' }}
        >
          <span style={{
            display: 'inline-block',
            background: 'rgba(82,183,136,0.18)',
            color: '#b7e4c7',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '16px',
            border: '1px solid rgba(183,228,199,0.20)',
          }}>
            Diagnóstico fitosanitario
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', marginBottom: '8px', color: 'var(--cream)' }}>
            Análisis de hoja
          </h2>
          <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: '0.97rem' }}>
            Sube una fotografía tomada con celular para obtener el diagnóstico.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: (preview || resultado) ? '1fr 1fr' : '1fr',
          gap: '32px',
          alignItems: 'start',
        }}>
          {/* Drop zone / loader */}
          <motion.div layout>
            <AnimatePresence mode="wait">
              {cargando && preview ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AnalysisLoader preview={preview} />

                  {/* Progress bar + step label */}
                  <div style={{ marginTop: '16px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={stepIdx}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.25 }}
                          style={{ color: '#b7e4c7', fontSize: '0.82rem', fontWeight: 500 }}
                        >
                          {LOADING_STEPS[stepIdx]?.label}
                        </motion.span>
                      </AnimatePresence>
                      <span style={{ color: 'rgba(245,240,232,0.45)', fontSize: '0.78rem' }}>{progress}%</span>
                    </div>

                    {/* Segmented progress bar */}
                    <div style={{
                      height: '6px',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,0.10)',
                      overflow: 'hidden',
                      position: 'relative',
                    }}>
                      <motion.div
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          borderRadius: '999px',
                          background: 'linear-gradient(90deg, #1a3d2e, #52b788, #b7e4c7)',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Shimmer */}
                        <motion.div
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
                            width: '50%',
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* Step dots */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '12px', justifyContent: 'center' }}>
                      {LOADING_STEPS.map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            background: i <= stepIdx ? '#52b788' : 'rgba(255,255,255,0.15)',
                            scale: i === stepIdx ? 1.3 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="dropzone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => inputRef.current.click()}
                    style={{
                      border: `2px dashed ${dragging ? '#52b788' : 'rgba(183,228,199,0.35)'}`,
                      borderRadius: 'var(--radius-lg)',
                      padding: '40px 24px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: dragging ? 'rgba(82,183,136,0.08)' : 'rgba(255,255,255,0.04)',
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
                        <ImagePlus size={48} color="rgba(183,228,199,0.60)" strokeWidth={1.3} />
                        <p style={{ color: '#b7e4c7', fontWeight: 500 }}>Arrastra una imagen o haz clic aquí</p>
                        <p style={{ color: 'rgba(245,240,232,0.40)', fontSize: '0.85rem' }}>JPG, PNG — fotografía de hoja de yuca</p>
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
                        style={{ flex: 1, justifyContent: 'center', background: 'var(--green-light)', color: 'var(--green-deep)' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <ScanLine size={18} /> Analizar hoja
                      </motion.button>
                      <button
                        onClick={() => { setImagen(null); setPreview(null); setResultado(null); setError(null) }}
                        style={{
                          padding: '14px 20px',
                          border: '1.5px solid rgba(183,228,199,0.30)',
                          borderRadius: 'var(--radius)',
                          background: 'transparent',
                          cursor: 'pointer',
                          color: '#b7e4c7',
                        }}
                      >
                        Limpiar
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#e63946', marginTop: '12px', fontSize: '0.9rem' }}>
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
                transition={{ duration: 0.5 }}
                style={{
                  background: 'var(--cream)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  border: '1px solid var(--cream-dark)',
                  boxShadow: 'var(--shadow-lg)',
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

                {/* Confidence bar */}
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
    </section>
  )
}
