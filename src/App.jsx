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
      {/* Footer */}
      <footer className="hidden fixed bottom-0 left-0 w-full py-4 text-center border-t border-zinc-800 bg-black z-50 transition-all">
        <p className="text-sm text-zinc-500">
          © 2025 INKVERSE. All rights reserved.
        </p>
      </footer>
    </>
  )
}

export default App
