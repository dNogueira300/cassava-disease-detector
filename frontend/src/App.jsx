import { useState } from 'react'
import './index.css'
import Hero from './components/Hero'
import CropSelector from './components/CropSelector'
import InfoSection from './components/InfoSection'
import DiseaseDetector from './components/DiseaseDetector'
import Footer from './components/Footer'

export default function App() {
  const [cultivoSeleccionado, setCultivoSeleccionado] = useState(null)

  return (
    <>
      <Hero />
      <InfoSection cultivo={cultivoSeleccionado} />
      <CropSelector
        cultivoSeleccionado={cultivoSeleccionado}
        onSeleccionar={setCultivoSeleccionado}
      />
      <DiseaseDetector cultivo={cultivoSeleccionado} />
      <Footer />
    </>
  )
}
