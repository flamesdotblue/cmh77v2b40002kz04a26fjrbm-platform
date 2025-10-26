import React from 'react'
import { motion } from 'framer-motion'
import { Car, Users, Star } from 'lucide-react'

const steps = [
  {
    title: 'Create a ride',
    desc: 'Post your route and time — campus-only visibility.',
    icon: Car,
  },
  {
    title: 'Find ride mates',
    desc: 'Instantly match with verified students nearby.',
    icon: Users,
  },
  {
    title: 'Split & rate',
    desc: 'Fair fare splits and community ELO reputation.',
    icon: Star,
  },
]

export default function HowItWorks() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-14">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">How it works</h2>
        <p className="mt-2 text-white/70">Fast matching, fair splits, and trusted campus rides.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {steps.map((s, idx) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.2, 0.9, 0.2, 1] }}
            className="group relative rounded-2xl border border-white/10 bg-[#0D0D0F]/80 p-5 backdrop-blur will-change-transform"
            style={{
              transformStyle: 'preserve-3d',
            }}
            onMouseMove={(e) => {
              const el = e.currentTarget
              const rect = el.getBoundingClientRect()
              const x = (e.clientX - rect.left) / rect.width
              const y = (e.clientY - rect.top) / rect.height
              el.style.transform = `rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 6}deg)`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg)'
            }}
          >
            <div className="absolute inset-0 rounded-2xl bg-[rgba(255,45,45,0.06)] opacity-0 group-hover:opacity-100 transition" aria-hidden="true" />
            <div className="relative">
              <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-[rgba(255,45,45,0.16)] ring-1 ring-[rgba(255,45,45,0.4)] p-3">
                <s.icon className="text-[#FF2D2D]" size={20} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-white/70">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
