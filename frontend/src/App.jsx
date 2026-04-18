import './index.css'
import Hero from './components/Hero'
import DiseaseDetector from './components/DiseaseDetector'
import InfoSection from './components/InfoSection'
import DatasetSection from './components/DatasetSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Hero />
      <DiseaseDetector />
      <InfoSection />
      <DatasetSection />
      <Footer />
    </>
  )
}
