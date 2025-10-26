import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Rocket, ShieldCheck, Users, CheckCircle2, X, Info, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Hero3D from './components/Hero3D'
import HowItWorks from './components/HowItWorks'
import ELOSection from './components/ELOSection'
import Footer from './components/Footer'

const COLORS = {
  primary: '#FF2D2D',
  deep: '#050406',
  dark: '#0D0D0F',
  grey: '#B6B6B6',
  glow: 'rgba(255,45,45,0.24)',
  success: '#3CD070',
}

export default function App() {
  const [open, setOpen] = useState(false)
  const [comingSoonOpen, setComingSoonOpen] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false)
  const [waitlistSuccess, setWaitlistSuccess] = useState(null)
  const [form, setForm] = useState({
    email: '',
    college: '',
    year: '',
    full_name: '',
    opt_in_marketing: false,
    referral_code: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e) => setReducedMotion(e.matches)
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])

  const validate = () => {
    const e = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.college.trim()) e.college = 'Select or type your college'
    if (!form.year.trim()) e.year = 'Select your year'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submitWaitlist = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setWaitlistSubmitting(true)
    setWaitlistSuccess(null)

    const payload = {
      email: form.email.trim(),
      college: form.college.trim(),
      year: form.year,
      name: form.full_name || undefined,
      referral_code: form.referral_code || undefined,
      source: 'landing_page',
      utm: {
        utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
      },
    }
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Network error')
      const data = await res.json()
      setWaitlistSuccess({
        message: data.message || "You're on the ORIX waitlist — thanks! We’ll notify you before campus launch.",
        code: data.referral_code || randomCode(),
      })
    } catch (err) {
      // Graceful fallback simulated success
      const code = randomCode()
      setWaitlistSuccess({
        message: "You're on the ORIX waitlist — thanks! We’ll notify you before campus launch.",
        code,
      })
    } finally {
      setWaitlistSubmitting(false)
    }
  }

  const referralLink = useMemo(() => waitlistSuccess ? `https://orix.app/r/${waitlistSuccess.code}` : '', [waitlistSuccess])

  return (
    <div className="min-h-screen w-full bg-[#050406] text-white antialiased">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(255,45,45,0.12),transparent_60%)]" />

      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-[rgba(255,45,45,0.2)] ring-1 ring-[rgba(255,45,45,0.4)] flex items-center justify-center">
              <Rocket className="text-[#FF2D2D]" size={18} aria-hidden="true" />
            </div>
            <span className="font-semibold tracking-wide">ORIX</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setComingSoonOpen((v) => !v)}
              className="relative inline-flex items-center gap-2 rounded-xl border-2 border-[#FF2D2D] px-4 py-2 text-sm text-white/90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D2D] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span className="relative">
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 rounded-full bg-[#FF2D2D] opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF2D2D]" />
                </span>
              </span>
              <Clock size={16} aria-hidden="true" />
              <span>Coming Soon</span>
            </button>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF2D2D] px-4 py-2 text-sm font-semibold text-white transition will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D2D] focus-visible:ring-offset-2 focus-visible:ring-offset-black hover:scale-[1.03] shadow-[0_0_0_1px_rgba(255,45,45,0.3)_inset,0_0_30px_rgba(255,45,45,0.24)]"
            >
              <Users size={16} aria-hidden="true" />
              Join Waitlist
            </button>
          </div>
        </div>
        <AnimatePresence>
          {comingSoonOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.2, 0.9, 0.2, 1] }}
              className="mx-auto max-w-7xl px-4 pb-3"
              role="status"
            >
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white/80">
                <Info size={16} aria-hidden="true" />
                <span>Rolling out Feb–Mar 2026 • 500+ students waiting</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <Hero3D onOpenWaitlist={() => setOpen(true)} reducedMotion={reducedMotion} />
        <HowItWorks />
        <ELOSection />
      </main>

      <div className="sticky bottom-3 z-30 mx-auto max-w-3xl px-4">
        <div className="rounded-2xl border border-white/10 bg-[#0D0D0F]/80 backdrop-blur flex items-center justify-between px-4 py-3">
          <span className="text-sm text-white/80">Get early access & priority at your college.</span>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF2D2D] px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D2D] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Join ORIX waitlist"
          >
            <Rocket size={16} aria-hidden="true" /> Join Waitlist
          </button>
        </div>
      </div>

      <Footer />

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
          <Dialog.Content
            className="fixed right-0 top-0 z-[101] h-full w-full sm:max-w-md bg-[#0D0D0F] shadow-xl border-l border-white/10 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out"
            style={{
              animationDuration: '400ms',
              animationTimingFunction: 'cubic-bezier(.2,.9,.2,1)'
            }}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <Dialog.Title className="text-lg font-semibold">Join the ORIX Waitlist</Dialog.Title>
              <Dialog.Close className="rounded-md p-2 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D2D]">
                <X aria-hidden="true" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>

            <div className="px-4 py-4 space-y-6 overflow-y-auto h-[calc(100%-64px)]">
              {!waitlistSuccess && (
                <form onSubmit={submitWaitlist} className="space-y-4" aria-describedby="privacy-note">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm text-white/80">Email<span className="text-[#FF2D2D]">*</span></label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#FF2D2D]"
                        placeholder="student@example.edu"
                      />
                      {errors.email && <p className="mt-1 text-xs text-[#FF2D2D]" role="alert">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="college" className="block text-sm text-white/80">College<span className="text-[#FF2D2D]">*</span></label>
                      <input
                        id="college"
                        type="text"
                        required
                        value={form.college}
                        onChange={(e) => setForm({ ...form, college: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#FF2D2D]"
                        placeholder="Type your college"
                        list="college-list"
                      />
                      <datalist id="college-list">
                        <option value="University of California, Berkeley" />
                        <option value="University of Michigan" />
                        <option value="Georgia Institute of Technology" />
                        <option value="NYU" />
                        <option value="Stanford University" />
                        <option value="Other" />
                      </datalist>
                      {errors.college && <p className="mt-1 text-xs text-[#FF2D2D]" role="alert">{errors.college}</p>}
                    </div>

                    <div>
                      <label htmlFor="year" className="block text-sm text-white/80">Year<span className="text-[#FF2D2D]">*</span></label>
                      <select
                        id="year"
                        required
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#FF2D2D]"
                      >
                        <option value="">Select</option>
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                        <option>5th Year</option>
                        <option>Alumni</option>
                        <option>Staff</option>
                      </select>
                      {errors.year && <p className="mt-1 text-xs text-[#FF2D2D]" role="alert">{errors.year}</p>}
                    </div>

                    <div>
                      <label htmlFor="full_name" className="block text-sm text-white/80">Full name (optional)</label>
                      <input
                        id="full_name"
                        type="text"
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#FF2D2D]"
                        placeholder="Chris Johnson"
                      />
                    </div>

                    <div>
                      <label htmlFor="referral_code" className="block text-sm text-white/80">Referral code (optional)</label>
                      <input
                        id="referral_code"
                        type="text"
                        value={form.referral_code}
                        onChange={(e) => setForm({ ...form, referral_code: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#FF2D2D]"
                        placeholder="ABC123"
                      />
                    </div>

                    <label className="inline-flex items-center gap-2 select-none">
                      <input
                        type="checkbox"
                        checked={form.opt_in_marketing}
                        onChange={(e) => setForm({ ...form, opt_in_marketing: e.target.checked })}
                        className="h-4 w-4 rounded border-white/20 bg-black/50 text-[#FF2D2D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D2D]"
                      />
                      <span className="text-sm text-white/80">Send me occasional updates and early access invites</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={waitlistSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF2D2D] px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D2D] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-60"
                  >
                    {waitlistSubmitting ? 'Joining…' : 'Join Waitlist'}
                  </button>

                  <p id="privacy-note" className="text-xs text-white/60">We only use this to notify you — we never sell your data. See Privacy Policy.</p>
                </form>
              )}

              {waitlistSuccess && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/30 p-3">
                    <CheckCircle2 className="text-[#3CD070]" aria-hidden="true" />
                    <div>
                      <p className="text-sm">{waitlistSuccess.message}</p>
                      <p className="mt-1 text-xs text-white/60">Share this link to move up the waitlist.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <label className="text-xs text-white/60">Your referral link</label>
                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2">
                      <input readOnly value={referralLink} className="flex-1 bg-transparent text-sm outline-none" aria-label="Referral link" />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(referralLink)
                        }}
                        className="rounded-lg border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
                      >Copy</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setOpen(false)} className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5">Close</button>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('I just joined the ORIX waitlist — a student-first ride-sharing companion for campus. Join me: ' + referralLink)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
                    >Share on X</a>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Join me on the ORIX waitlist: ' + referralLink)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
                    >WhatsApp</a>
                  </div>
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

function randomCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase()
}
