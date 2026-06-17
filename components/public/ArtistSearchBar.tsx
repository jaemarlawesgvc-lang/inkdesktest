'use client'

import { useState, useEffect, useRef } from 'react'

interface ArtistSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function ArtistSearchBar({
  value,
  onChange,
  placeholder = 'Search by artist name, style, or bio...',
}: ArtistSearchBarProps) {
  const [localValue, setLocalValue] = useState(value)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Sync state if prop changes from outside
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleInputChange = (val: string) => {
    setLocalValue(val)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      onChange(val)
    }, 350)
  }

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Background Glow */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-gold-500/10 via-amber-500/5 to-transparent blur-lg opacity-75 pointer-events-none group-focus-within:opacity-100 transition-opacity duration-300" />
      
      {/* Search Input Container */}
      <div className="relative flex items-center bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden focus-within:border-gold-500/50 focus-within:ring-1 focus-within:ring-gold-500/30 transition-all duration-300">
        <div className="flex items-center justify-center pl-4 text-white/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={localValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 py-4 text-white placeholder-white/30 text-sm focus:outline-none"
        />

        {localValue && (
          <button
            type="button"
            onClick={() => {
              setLocalValue('')
              onChange('')
            }}
            className="flex items-center justify-center pr-4 text-white/40 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
