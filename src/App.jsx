import './App.css'
import { Canvas } from '@react-three/fiber'
import { Experience } from './components/Experience'
import { Header } from './components/Header'

function App() {

  return (
    <>
      <Header />
      <Canvas camera={{
        fov: 42,
        position: [0, 0, 1.5]
      }}>
        <Experience />
      </Canvas>
    </>
  )
}

export default App
