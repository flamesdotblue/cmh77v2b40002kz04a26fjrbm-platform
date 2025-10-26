import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function ELOSection() {
  const [value, setValue] = useState(4.2)
  const radius = 56
  const stroke = 8
  const normalizedRadius = radius - stroke
  const circumference = normalizedRadius * 2 * Math.PI
  const progress = Math.min(1, Math.max(0, value / 5))
  const strokeDashoffset = circumference - progress * circumference

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold">ELO Safety System</h2>
          <p className="mt-2 text-white/70">Community-driven reputation that makes choosing ride mates simple and safe.</p>
          <div className="mt-5">
            <label htmlFor="elo" className="text-sm text-white/80">Filter by minimum ELO</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                id="elo"
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value))}
                className="w-full accent-[#FF2D2D]"
                aria-valuemin={0}
                aria-valuemax={5}
                aria-valuenow={value}
              />
              <span className="inline-flex min-w-12 justify-end tabular-nums">{value.toFixed(1)}</span>
            </div>
            <p className="mt-2 text-xs text-white/60">Higher ELO means more reliable partners — filter matches by reputation.</p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <motion.svg
            initial={{ rotate: -90 }}
            animate={{ rotate: -90 }}
            width={radius * 2}
            height={radius * 2}
            className="drop-shadow-[0_0_30px_rgba(255,45,45,0.24)]"
            role="img"
            aria-label={`ELO meter showing ${value.toFixed(1)} out of 5`}
          >
            <circle
              stroke="rgba(255,255,255,0.12)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <motion.circle
              stroke="#FF2D2D"
              fill="transparent"
              strokeLinecap="round"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              strokeDasharray={`${circumference} ${circumference}`}
              animate={{ strokeDashoffset }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-white font-semibold text-xl">
              {value.toFixed(1)}
            </text>
          </motion.svg>
        </div>
      </div>
    </section>
  )
}
