import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

const COLORS = {
  primary: '#FF2D2D',
}

function useInView(ref, rootMargin = '0px') {
  const [isIntersecting, setIntersecting] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting), { rootMargin, threshold: 0.1 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, rootMargin])
  return isIntersecting
}

function City() {
  const group = useRef()
  const seeds = useMemo(() => {
    const items = []
    for (let i = 0; i < 28; i++) {
      items.push({
        x: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 20,
        h: 0.5 + Math.random() * 3.5,
      })
    }
    return items
  }, [])
  return (
    <group ref={group} position={[0, -1.2, 0]}> 
      {seeds.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[0.6, b.h, 0.6]} />
          <meshStandardMaterial color={new THREE.Color(0.05, 0.05, 0.06)} roughness={0.8} metalness={0.1} />
        </mesh>
      ))}
    </group>
  )
}

function RouteLines() {
  const lines = useRef([])
  const group = useRef()
  useEffect(() => {
    const makeLine = (points) => {
      const curve = new THREE.CatmullRomCurve3(points)
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100))
      const material = new THREE.LineBasicMaterial({ color: COLORS.primary, transparent: true, opacity: 0.85 })
      const line = new THREE.Line(geometry, material)
      return line
    }
    const g = group.current
    if (!g) return
    const routes = []
    for (let i = 0; i < 4; i++) {
      const p1 = new THREE.Vector3((Math.random() - 0.5) * 10, 0.4 + Math.random() * 1.2, (Math.random() - 0.5) * 10)
      const p2 = new THREE.Vector3((Math.random() - 0.5) * 10, 0.6 + Math.random() * 1.5, (Math.random() - 0.5) * 10)
      const p3 = new THREE.Vector3((Math.random() - 0.5) * 10, 0.4 + Math.random() * 1.2, (Math.random() - 0.5) * 10)
      const line = makeLine([p1, p2, p3])
      g.add(line)
      routes.push(line)
    }
    lines.current = routes
    return () => {
      routes.forEach(l => g.remove(l))
    }
  }, [])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    lines.current.forEach((line, idx) => {
      const opacity = 0.6 + Math.sin(t * 0.8 + idx) * 0.25
      line.material.opacity = Math.max(0.15, Math.min(1, opacity))
    })
  })
  return <group ref={group} />
}

function Particles() {
  const ref = useRef()
  const count = 120
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 14
      arr[i * 3 + 1] = Math.random() * 4
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14
    }
    return arr
  }, [])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += Math.sin(t + i) * 0.0008
    }
    pos.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color={COLORS.primary} transparent opacity={0.4} />
    </points>
  )
}

function Scene({ parallax = { x: 0, y: 0 } }) {
  const rig = useRef()
  useFrame(() => {
    if (rig.current) {
      rig.current.rotation.y = THREE.MathUtils.lerp(rig.current.rotation.y, parallax.x * 0.2, 0.05)
      rig.current.rotation.x = THREE.MathUtils.lerp(rig.current.rotation.x, parallax.y * 0.1, 0.05)
    }
  })
  return (
    <group ref={rig}>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color={COLORS.primary} />
      <City />
      <RouteLines />
      <Particles />
    </group>
  )
}

export default function Hero3D({ onOpenWaitlist, reducedMotion }) {
  const containerRef = useRef(null)
  const inView = useInView(containerRef, '100px')
  const [supportsWebGL, setSupportsWebGL] = useState(true)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setSupportsWebGL(Boolean(gl))
    } catch {
      setSupportsWebGL(false)
    }
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      setParallax({ x, y })
    }
    if (!reducedMotion) window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [reducedMotion])

  return (
    <section ref={containerRef} className="relative isolate min-h-[80vh] sm:min-h-[92vh] overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        {inView && supportsWebGL && !reducedMotion ? (
          <Canvas camera={{ position: [0, 2.2, 6], fov: 55 }}>
            <Suspense fallback={null}>
              <Scene parallax={parallax} />
            </Suspense>
          </Canvas>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0C0B0E] to-black" />
        )}
        <div className="absolute inset-0 opacity-30 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(255,45,45,0.15), transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,45,45,0.1), transparent 40%)' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-20 sm:pt-28">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
            className="text-4xl sm:text-6xl font-bold tracking-tight"
          >
            Commute smarter. Share safer.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.9, 0.2, 1] }}
            className="mt-4 text-lg sm:text-xl text-white/80 max-w-xl"
          >
            College-first ride sharing to find ride mates, split fares, and build trusted campus communities.
          </motion.p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenWaitlist}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF2D2D] px-5 py-3 text-sm sm:text-base font-semibold text-white transition hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D2D] focus-visible:ring-offset-2 focus-visible:ring-offset-black shadow-[0_0_0_1px_rgba(255,45,45,0.3)_inset,0_0_30px_rgba(255,45,45,0.24)]"
              aria-label="Join ORIX waitlist"
            >
              Join Waitlist
            </button>
            <div className="inline-flex items-center gap-3 text-xs sm:text-sm text-white/70">
              <span className="inline-flex items-center gap-1"><ShieldCheck size={16} className="text-[#3CD070]" aria-hidden="true" /> College Verified</span>
              <span>•</span>
              <span>95% safety rating</span>
              <span>•</span>
              <span>500+ on waitlist</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
