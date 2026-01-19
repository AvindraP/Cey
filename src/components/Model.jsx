import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'

export const Model = ({ activeIndex, ...props }) => {
  const { nodes, materials } = useGLTF('/models/model.glb')
  const { viewport, camera } = useThree()
  const ref = useRef()
  const lightRef = useRef()
  const prevIndexRef = useRef(-1)
  const hasEnteredRef = useRef(false)

  const aspect = viewport.aspect
  const isMobile = aspect < 1

  // -----------------------------------------------------------------
  // DATA CONFIGURATION
  // -----------------------------------------------------------------
  const animations = [
    // Index 0 - Initial state
    {
      label: "Initial",
      rotation: { x: 3.141, y: -1.770, z: 2.900 },
      position: isMobile ? { x: 0.337, y: 0, z: 0 } : { x: 1.050, y: 0.000, z: 0.000 },
      camera: { x: 2.300, y: 1.130, z: 1.000 },
      light: { x: 0.100, y: 0.200, z: 0.400 }
    },
    // Index 1 // video
    {
      label: "Video",
      rotation: { x: 3.141, y: -1.680, z: 3.0 },
      position: isMobile ? { x: 0.5, y: -0.78, z: 0.1 } : { x: -0.224, y: 0.375, z: 0.75 },
      camera: { x: 0.15, y: 1.465, z: 1.350 },
      light: { x: -0.7, y: 0.775, z: 0.475 }
    },
    // Index 2 // About us
    {
      label: "About Us",
      rotation: { x: 3.141, y: -1.590, z: 3.11 },
      position: isMobile ? { x: 0.800, y: -0.200, z: 0.000 } : { x: -1.50, y: 0.750, z: 1.50 },
      camera: { x: -2.00, y: 1.8, z: 1.700 },
      light: { x: -1.50, y: 1.350, z: 0.450 }
    },
    // Index 3 // Home visit
    {
      label: "Home Visit",
      rotation: { x: 3.141, y: -1.570, z: 3.141 },
      position: isMobile ? { x: -2.000, y: 0.900, z: 1.700 } : { x: -2.000, y: 0.900, z: 1.700 },
      camera: { x: -2.300, y: 2.000, z: 1.800 },
      light: { x: -2.000, y: 2.500, z: 0.300 }
    },
    // Index 4 // Product display
    {
      label: "Product Display",
      rotation: { x: 3.2905, y: -2.285, z: 3.3455 },
      position: { x: -0.275, y: 1.45, z: 2.7 },
      camera: { x: -0.6, y: 2.5, z: 2.9 },
      light: { x: -1.0, y: 4.75, z: 2.15 }
    },
    // Index 5 // Our Products
    {
      label: "Our Products",
      rotation: { x: 3.440, y: -3.00, z: 3.550 },
      position: isMobile ? { x: 1.450, y: 2.000, z: 3.700 } : { x: 1.450, y: 2.000, z: 3.700 },
      camera: { x: 1.100, y: 3.000, z: 4.000 },
      light: { x: 0.000, y: 7.000, z: 4.000 }
    },
    // Index 6 // Vision
    {
      label: "Vision",
      rotation: { x: 3.540, y: -3.100, z: 3.350 },
      position: isMobile ? { x: 1.300, y: 2.000, z: 3.700 } : { x: 1.300, y: 2.000, z: 3.700 },
      camera: { x: 1.100, y: 3.000, z: 4.000 },
      light: { x: 0.000, y: 7.000, z: 4.000 }
    },
    // Index 7 // Mission
    {
      label: "Mission",
      rotation: { x: 3.640, y: -3.100, z: 3.350 },
      position: isMobile ? { x: 1.325, y: 2.200, z: 3.700 } : { x: 1.325, y: 2.200, z: 3.700 },
      camera: { x: 1.150, y: 3.100, z: 3.950 },
      light: { x: 0.000, y: 8.500, z: 5.500 }
    },
    // Index 8 // Contact Us
    {
      label: "Contact Us",
      rotation: { x: 3.740, y: -3.100, z: 3.375 },
      position: isMobile ? { x: 1.350, y: 2.400, z: 3.700 } : { x: 1.350, y: 2.400, z: 3.700 },
      camera: { x: 1.200, y: 3.200, z: 3.900 },
      light: { x: 0.000, y: 10.000, z: 7.000 }
    },
  ]

  // -----------------------------------------------------------------
  // SCROLL ANIMATION LOGIC
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!ref.current || !lightRef.current) return
    if (!hasEnteredRef.current) return // Wait for entry animation
    if (activeIndex === prevIndexRef.current) return

    const duration = 1
    const targetIndex = Math.max(0, Math.min(activeIndex, animations.length - 1))
    const targetState = animations[targetIndex]

    // 1. Animate Model Rotation
    gsap.to(ref.current.rotation, {
      duration,
      x: targetState.rotation.x,
      y: targetState.rotation.y,
      z: targetState.rotation.z,
      ease: 'power2.inOut'
    })

    // 2. Animate Model Position
    gsap.to(ref.current.position, {
      duration,
      x: targetState.position.x,
      z: targetState.position.z,
      y: targetState.position.y,
      ease: 'power2.inOut'
    })

    // 3. Animate Camera Position
    gsap.to(camera.position, {
      duration,
      x: targetState.camera.x,
      y: targetState.camera.y,
      z: targetState.camera.z,
      ease: 'power2.inOut'
    })

    // 4. Animate Light Position
    const targetLight = targetState.light || { x: 0, y: 0, z: 0 }
    gsap.to(lightRef.current.position, {
      duration,
      x: targetLight.x,
      y: targetLight.y,
      z: targetLight.z,
      ease: 'power2.inOut'
    })

    prevIndexRef.current = activeIndex
  }, [activeIndex, camera, viewport.aspect]) // Re-run if screen resizes to catch new isMobile coords

  // -----------------------------------------------------------------
  // INITIAL ENTRY ANIMATION (COMPLETED)
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!ref.current || !lightRef.current || hasEnteredRef.current) return

    const startData = animations[0]

    // 1. Set Initial "Off-screen" State
    // Position: Dropped down slightly (y - 5) or above (y + 5) to fall in
    ref.current.position.set(startData.position.x, startData.position.y + 5, startData.position.z)

    // Rotation: Start with a slight offset so it spins into place
    ref.current.rotation.set(startData.rotation.x, startData.rotation.y + Math.PI, startData.rotation.z)

    // Camera: Start zoomed out
    camera.position.set(startData.camera.x, startData.camera.y + 2, startData.camera.z + 5)

    // Light: Set to target immediately
    lightRef.current.position.set(startData.light.x, startData.light.y, startData.light.z)

    // 2. Create Entry Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        hasEnteredRef.current = true
        prevIndexRef.current = 0 // Ensure we know we are at index 0
      }
    })

    // Animate Model dropping in
    tl.to(ref.current.position, {
      duration: 2.5,
      x: startData.position.x,
      y: startData.position.y,
      z: startData.position.z,
      ease: "power3.out"
    })

    // Animate Rotation (Spinning in)
    tl.to(ref.current.rotation, {
      duration: 2.5,
      x: startData.rotation.x,
      y: startData.rotation.y,
      z: startData.rotation.z,
      ease: "power3.out"
    }, "<") // Run at start of previous

    // Animate Camera Zooming in
    tl.to(camera.position, {
      duration: 3,
      x: startData.camera.x,
      y: startData.camera.y,
      z: startData.camera.z,
      ease: "power2.out"
    }, "<")

  }, [viewport.aspect]) // Run on mount (and if aspect changes wildly before entry finishes)


  return (
    <group {...props} dispose={null}>
      <directionalLight
        ref={lightRef}
        intensity={1}
        castShadow
        position={[0, 0, 0]} // Initial placeholder, set by JS
      />

      <group ref={ref}>
        <group position={[-0.009, 0.475, 0.06]} rotation={[3.087, -1.57, -1.627]} scale={0.791}>
          <mesh geometry={nodes.geometry_0.geometry} material={materials.geometry_0_material} position={[0.001, 0, 0]} rotation={[0, 0, -0.002]} scale={0.5} />
        </group>
        <group position={[-0.008, 0.496, -0.349]} rotation={[3.087, -1.57, -1.647]} scale={0.167}>
          <mesh geometry={nodes.geometry_0001.geometry} material={materials['geometry_0_material.001']} position={[-0.033, 0.146, 0.014]} rotation={[0, 0, -0.002]} scale={0.544} />
        </group>
        <group position={[0.133, 0.751, 0.021]} rotation={[0.003, -0.03, 0.024]} scale={0.4}>
          <mesh geometry={nodes.geometry_0004.geometry} material={materials['geometry_0_material.004']} position={[-0.849, -0.366, -1.064]} scale={0.461} />
        </group>
        <group position={[-0.098, 0.221, -0.43]} rotation={[0, 0.748, 0]} scale={0.432}>
          <mesh geometry={nodes.geometry_0002.geometry} material={materials['geometry_0_material.002']} position={[-0.003, 0, 0.003]} scale={0.5} />
        </group>
        <group position={[-0.041, 0.568, -0.337]} rotation={[-Math.PI, 0, 0]} scale={[-0.082, 0.082, 0.082]}>
          <mesh geometry={nodes.geometry_0006.geometry} material={materials['geometry_0_material.006']} position={[0.009, -0.218, 0.198]} rotation={[-0.184, 0.512, 0.69]} scale={0.502} />
        </group>
        <group position={[-0.262, 0.174, -0.432]} scale={0.348}>
          <mesh geometry={nodes.geometry_0005.geometry} material={materials['geometry_0_material.007']} position={[0.098, -0.047, 0]} scale={0.455} />
        </group>
        <group position={[-0.04, 0.575, -0.46]} rotation={[3.005, -0.764, 2.946]} scale={[0.211, 0.124, 0.138]}>
          <mesh geometry={nodes.geometry_0007.geometry} material={materials['geometry_0_material.003']} position={[0.015, 0.027, 0.064]} rotation={[-0.03, 0.026, 0.028]} scale={[0.402, 0.54, 0.403]} />
        </group>
        <group position={[-0.052, 0.579, -0.333]} rotation={[2.627, 0.806, -2.131]} scale={0.083}>
          <mesh geometry={nodes.geometry_0008.geometry} material={materials['geometry_0_material.005']} position={[0.049, -0.074, -0.02]} rotation={[-0.069, -0.101, -0.276]} scale={0.5} />
        </group>
        <mesh geometry={nodes['tripo_node_19dd656c-79e0-47a4-90a7-01b25bed6aef'].geometry} material={materials['tripo_material_19dd656c-79e0-47a4-90a7-01b25bed6aef']} position={[-0.001, 0.236, 0.004]} scale={0.479} />
        <group position={[-0.106, 0.781, -0.412]} rotation={[0, -0.129, -0.513]} scale={0.21}>
          <mesh geometry={nodes.Mesh_0005.geometry} material={materials['geometry_0_material.008']} position={[0.095, 0.001, -0.004]} scale={0.451} />
          <mesh geometry={nodes.Mesh_0005_1.geometry} material={materials.Material} position={[0.367, 0.03, 0.004]} scale={0.182} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/model.glb')
