import './index.css'
import Hero from './components/Hero'
import InfoSection from './components/InfoSection'
import CassavaCultivo from './components/CassavaCultivo'
import DatasetSection from './components/DatasetSection'
import DiseaseDetector from './components/DiseaseDetector'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Hero />
      <InfoSection />
      <CassavaCultivo />
      <DatasetSection />
      <DiseaseDetector />
      <Footer />
    </>
  )
}
