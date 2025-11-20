import './App.css'
import { Canvas } from '@react-three/fiber'
import { Experience } from './components/Experience'
import { Header } from './components/Header'
import { useState } from 'react';

function App() {
  const [scrollToSection, setScrollToSection] = useState(null);

  return (
    <>
      <Header scrollToSection={scrollToSection} />
      <Canvas camera={{
        fov: 42,
        position: [0, 0, 1.5]
      }}>
        <Experience onScrollToSection={setScrollToSection} />
      </Canvas>
    </>
  )
}

export default App
