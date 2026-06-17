'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface ArtistCardProps {
  username: string
  displayName: string
  bio: string | null
  styleTags: string[]
  studioName: string | null
  studioAddress: string | null
  portfolioImages: string[]
  rating: number
  reviewCount: number
  depositRequired: boolean
  depositAmount: number | null
  isVerified?: boolean
  priceTier?: string
}

export function ArtistCard({
  username,
  displayName,
  bio,
  styleTags,
  studioName,
  studioAddress,
  portfolioImages,
  rating,
  reviewCount,
  depositRequired,
  depositAmount,
  isVerified = false,
  priceTier = '££',
}: ArtistCardProps) {
  const [saved, setSaved] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const hasImages = portfolioImages.length > 0

  return (
    <div className="group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-white/[0.02]">
      {/* ── Portfolio Preview ── */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
        {hasImages ? (
          <>
            <Image
              src={portfolioImages[activeImage] ?? ''}
              alt={`${displayName}'s work`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Image navigation dots */}
            {portfolioImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {portfolioImages.slice(0, 4).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setActiveImage(i)
                    }}
                    className={[
                      'w-1.5 h-1.5 rounded-full transition-all duration-200',
                      i === activeImage
                        ? 'bg-white w-4'
                        : 'bg-white/40 hover:bg-white/60',
                    ].join(' ')}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>
            )}
            {/* Hover arrows */}
            {portfolioImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setActiveImage((prev) =>
                      prev === 0 ? portfolioImages.length - 1 : prev - 1,
                    )
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setActiveImage((prev) =>
                      prev === portfolioImages.length - 1 ? 0 : prev + 1,
                    )
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-12 h-12 text-white/10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Save button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setSaved(!saved)
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:bg-black/60 z-10"
          aria-label={saved ? 'Unsave artist' : 'Save artist'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={1.5}
            className={[
              'w-4.5 h-4.5 transition-colors duration-200',
              saved ? 'text-rose-400' : 'text-white',
            ].join(' ')}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Badges */}
        {reviewCount > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5 text-amber-400"
              >
                <path
                  fillRule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-[11px] font-bold text-white">
                {rating.toFixed(1)}
              </span>
              <span className="text-[10px] text-white/50">
                ({reviewCount})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Card Content ── */}
      <Link href={`/${username}`} className="block p-4 space-y-3">
        {/* Artist info */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white truncate group-hover:text-white transition-colors flex items-center gap-1">
              {displayName}
              {isVerified && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-gold-500 flex-shrink-0"
                >
                  <title>Verified Artist</title>
                  <path
                    fillRule="evenodd"
                    d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-3.073a.75.75 0 00-1.214-.838L9.277 13.02l-1.8-1.8a.75.75 0 00-1.06 1.06l2.33 2.33a.75.75 0 001.137-.108l3.5-4.925z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </h3>
            {(studioName || studioAddress) && (
              <p className="text-xs text-white/40 mt-0.5 truncate flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3 h-3 flex-shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.274 1.765 11.307 11.307 0 00.757.433c.115.06.211.107.281.14l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {studioName ?? studioAddress}
              </p>
            )}
          </div>

          {/* Availability indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider whitespace-nowrap">
              Available
            </span>
          </div>
        </div>

        {/* Bio preview */}
        {bio && (
          <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
            {bio}
          </p>
        )}

        {/* Style tags */}
        {styleTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {styleTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.06] text-white/50 border border-white/[0.06]"
              >
                {tag}
              </span>
            ))}
            {styleTags.length > 3 && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.04] text-white/30">
                +{styleTags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
          <div className="flex items-center gap-3">
            {depositRequired && depositAmount && (
              <span className="text-xs text-white/40">
                From <span className="text-white/60 font-medium">£{depositAmount}</span> deposit
              </span>
            )}
            {priceTier && (
              <span className="text-xs font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20" title={`Price tier: ${priceTier}`}>
                {priceTier}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 group-hover:text-white transition-colors">
            View Profile
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </Link>
    </div>
  )
}
