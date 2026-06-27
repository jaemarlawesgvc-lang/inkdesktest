'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface FlashDesign {
  id: string
  title: string
  price: number
  size_cm: string | null
  image_path: string
  status: 'available' | 'booked' | 'hidden'
}

interface FlashDesignsSectionProps {
  designs: FlashDesign[]
  accentColor: string
}

export function FlashDesignsSection({ designs, accentColor }: FlashDesignsSectionProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const availableDesigns = designs.filter((d) => d.status === 'available')

  if (availableDesigns.length === 0) return null

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('flash', id)
    router.push(`?${params.toString()}#booking`, { scroll: true })
    
    // Smooth scroll backup
    setTimeout(() => {
      const element = document.getElementById('booking')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  return (
    <section id="flash" className="relative py-20 px-6 max-w-6xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
          Available Flash Designs
        </h2>
        <p className="text-white/60 text-sm max-w-xl mx-auto">
          Pre-drawn, ready-to-ink designs. Each piece is unique and only tattooed once. Select a design to book it instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {availableDesigns.map((design) => (
          <div
            key={design.id}
            className="flex flex-col h-full bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all duration-300"
          >
            {/* Aspect box */}
            <div className="relative aspect-square w-full bg-black overflow-hidden">
              <img
                src={design.image_path}
                alt={design.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold tracking-wide border border-white/10">
                £{Number(design.price).toFixed(0)}
              </span>
            </div>

            {/* Content info */}
            <div className="flex-1 flex flex-col justify-between p-5 space-y-4">
              <div className="space-y-1">
                <h3 className="text-white font-semibold text-base line-clamp-1">
                  {design.title}
                </h3>
                {design.size_cm && (
                  <p className="text-white/40 text-xs">
                    Size: {design.size_cm}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleSelect(design.id)}
                className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{
                  backgroundColor: accentColor,
                  color: '#000',
                  boxShadow: `0 4px 14px -4px ${accentColor}`,
                }}
              >
                Book this design
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
