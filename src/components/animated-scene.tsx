"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useState, useEffect } from "react"
import type { Mesh } from "three"
import { OrbitControls, Sphere, Torus } from "@react-three/drei"

function Scene() {
  const torusRef = useRef<Mesh>(null!)
  const sphereRef = useRef<Mesh>(null!)

  useFrame((_state, delta) => {
    if (torusRef.current) {
      torusRef.current.rotation.x += delta * 0.2
      torusRef.current.rotation.y += delta * 0.1
    }
    if (sphereRef.current) {
        sphereRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <Canvas>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
          <Torus ref={torusRef} args={[2.5, 0.1, 16, 100]} >
               <meshStandardMaterial color="#90CAF9" wireframe />
          </Torus>
        <Sphere ref={sphereRef} args={[1, 32, 32]}>
          <meshStandardMaterial color="#FFB74D" wireframe />
        </Sphere>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}


export function AnimatedScene() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient ? <Scene /> : null
}
