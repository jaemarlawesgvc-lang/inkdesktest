'use client'

import { useEffect, useState } from 'react'

interface StickyBookCtaProps {
  accentColor: string
  ctaText: string
  /** Artist name shown beside the button for context. */
  artistName: string
}

/**
 * Mobile-only sticky booking bar. Slides up once the visitor scrolls past the
 * hero, giving a persistent path to the booking form without crowding desktop.
 */
export function StickyBookCta({ accentColor, ctaText, artistName }: StickyBookCtaProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      className={[
        'fixed inset-x-0 bottom-0 z-40 px-4 pt-3 lg:hidden',
        'border-t border-white/10 bg-black/85 backdrop-blur-xl transition-all duration-300',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0',
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{artistName}</p>
          <p className="text-xs text-white/45">Spots are limited</p>
        </div>
        <a
          href="#book"
          className="inline-flex items-center gap-1.5 rounded-xl px-6 py-3 text-sm font-bold shadow-lg active:scale-95"
          style={{ backgroundColor: accentColor, color: '#0a0a0a', boxShadow: `0 8px 28px ${accentColor}45` }}
        >
          {ctaText}
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </a>
      </div>
    </div>
  )
}
