'use client'

import { useEffect, useRef } from 'react'

/* eslint-disable @next/next/no-img-element */

/**
 * Animated hero backdrop for the marketing homepage.
 *
 * - Full-bleed ornate tattoo, kept semi-transparent (opacity 0.4) so it covers
 *   most of the hero without ever sitting solidly over the text.
 * - Subtle parallax: the art drifts slower than the page as you scroll, plus a
 *   slow ken-burns zoom — "a bit of animation that renders as you scroll".
 * - Honours prefers-reduced-motion (no parallax for users who opt out; the
 *   image is still scaled so no edge is revealed).
 */
export function HeroBackground() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = layerRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      // Drift slower than the page for a parallax feel. The 1.3 scale gives
      // overhang so the downward drift never exposes an edge.
      const offset = window.scrollY * 0.18
      el.style.transform = `translate3d(0, ${offset}px, 0) scale(1.3)`
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Parallax layer (pre-scaled so the drift never reveals an edge) */}
      <div ref={layerRef} className="absolute inset-0 scale-[1.3] will-change-transform">
        <img
          src="/assets/images/portfolio/neo-traditional.png"
          alt=""
          className="h-full w-full object-cover object-center opacity-40 animate-ken-burns"
        />
      </div>

      {/* Warm amber cast over the greyscale ink */}
      <div className="absolute inset-0 bg-gold-700/10 mix-blend-soft-light" />

      {/* Radial vignette — art glows through the centre, edges fall to black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 38%, rgba(8,8,8,0) 0%, rgba(8,8,8,0.45) 55%, rgba(8,8,8,0.92) 100%)',
        }}
      />

      {/* Keep the headline + copy legible without hiding the art (semi-transparent only) */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 via-ink-950/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/55 via-transparent to-ink-950" />
    </div>
  )
}
