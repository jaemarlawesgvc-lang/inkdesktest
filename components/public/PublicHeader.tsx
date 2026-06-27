'use client'

import { useState, useEffect } from 'react'

interface PublicHeaderProps {
  artistName: string
  username: string
  accentColor: string
  showAbout: boolean
  showFaq: boolean
}

const NAV_LINK_CLS =
  'block w-full text-left text-base font-medium text-white/70 hover:text-white transition-colors py-3 border-b border-white/5 last:border-0'

export function PublicHeader({
  artistName,
  username,
  accentColor,
  showAbout,
  showFaq,
}: PublicHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-md"
      aria-label="Artist page navigation"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        <a
          href="#top"
          className="font-serif text-base sm:text-lg font-bold text-white truncate min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
          style={{ ['--tw-ring-color' as string]: accentColor }}
        >
          {artistName}
        </a>

        {/* Desktop nav */}
        <nav aria-label="Section links" className="hidden md:flex items-center gap-5 lg:gap-6 shrink-0">
          <a href="#portfolio" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            Portfolio
          </a>
          <a href="#book" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            Appointments
          </a>
          {showAbout && (
            <a href="#about" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              About
            </a>
          )}
          {showFaq && (
            <a href={`/${username}/faq`} className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              FAQ
            </a>
          )}
          <a
            href="#book"
            className="text-sm font-semibold px-3.5 py-1.5 rounded-lg transition-all hover:brightness-110"
            style={{ backgroundColor: accentColor, color: '#0a0a0a' }}
          >
            Book consultation
          </a>
        </nav>

        {/* Mobile: book CTA + menu toggle */}
        <div className="flex items-center gap-2 md:hidden shrink-0">
          <a
            href="#book"
            className="text-xs font-semibold px-3 py-2 rounded-lg transition-all hover:brightness-110 whitespace-nowrap"
            style={{ backgroundColor: accentColor, color: '#0a0a0a' }}
          >
            Book
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 top-14 bg-black/60 backdrop-blur-sm md:hidden z-30"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <nav
            id="mobile-nav"
            className="md:hidden fixed inset-x-0 top-14 z-40 bg-black/95 border-b border-white/10 px-4 py-2 max-h-[calc(100dvh-3.5rem)] overflow-y-auto"
            aria-label="Mobile section links"
          >
            <a href="#portfolio" className={NAV_LINK_CLS} onClick={closeMenu}>
              Portfolio
            </a>
            <a href="#book" className={NAV_LINK_CLS} onClick={closeMenu}>
              Appointments
            </a>
            {showAbout && (
              <a href="#about" className={NAV_LINK_CLS} onClick={closeMenu}>
                About
              </a>
            )}
            {showFaq && (
              <a href={`/${username}/faq`} className={NAV_LINK_CLS} onClick={closeMenu}>
                FAQ
              </a>
            )}
            <a href="#book" className={NAV_LINK_CLS} onClick={closeMenu}>
              Book consultation
            </a>
          </nav>
        </>
      )}
    </header>
  )
}
