import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/30">
      <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div>
          <div className="text-lg font-semibold">ORIX</div>
          <p className="mt-2 text-sm text-white/70">We only use this to notify you — never sell data.</p>
        </div>
        <nav className="text-sm text-white/80">
          <ul className="space-y-2">
            <li><a className="hover:underline" href="#">Privacy Policy</a></li>
            <li><a className="hover:underline" href="#">Terms of Use</a></li>
            <li><a className="hover:underline" href="#">Safety</a></li>
            <li><a className="hover:underline" href="#">Support</a></li>
          </ul>
        </nav>
        <div className="text-sm text-white/60">
          <div className="mb-2">Partners</div>
          <div className="flex flex-wrap gap-3 opacity-60">
            <div className="h-6 w-20 rounded bg-white/10" aria-hidden="true" />
            <div className="h-6 w-20 rounded bg-white/10" aria-hidden="true" />
            <div className="h-6 w-20 rounded bg-white/10" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">© {new Date().getFullYear()} ORIX. All rights reserved.</div>
    </footer>
  )
}
