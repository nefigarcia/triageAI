"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"
import type { Mesh } from "three"
import { OrbitControls, Sphere, Torus } from "@react-three/drei"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function AnimatedScene() {
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
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
        <Torus ref={torusRef} args={[2.5, 0.1, 16, 100]} >
             <meshStandardMaterial color="#90CAF9" wireframe />
        </Torus>
      <Sphere ref={sphereRef} args={[1, 32, 32]}>
        <meshStandardMaterial color="#FFB74D" wireframe />
      </Sphere>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  )
}


export default function Home() {
  return (
    <div className="relative w-full h-screen bg-gray-900 text-white">
      <div className="absolute inset-0 z-0">
         <Canvas>
            <AnimatedScene />
        </Canvas>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-orange-300">
          TriageFlow
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl text-gray-300">
          Intelligent ticket analysis and automated routing to streamline your customer support.
        </p>
        <div className="mt-8 flex gap-4">
            <Button asChild size="lg">
                <Link href="/dashboard">Agent Dashboard</Link>
            </Button>
             <Button asChild size="lg" variant="outline" className="bg-transparent border-primary/50 hover:bg-primary/10">
                <Link href="/login">Customer Login</Link>
            </Button>
        </div>
      </div>
    </div>
  )
}
