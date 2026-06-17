'use client'

import { STYLE_TAG_OPTIONS } from '@/lib/validations/onboarding'

interface ArtistFiltersProps {
  selectedStyle: string
  onStyleChange: (style: string) => void
  selectedPriceTier: string
  onPriceTierChange: (tier: string) => void
}

const PRICE_TIERS = ['£', '££', '£££']

export function ArtistFilters({
  selectedStyle,
  onStyleChange,
  selectedPriceTier,
  onPriceTierChange,
}: ArtistFiltersProps) {
  const hasActiveFilters = selectedStyle || selectedPriceTier

  const handleClearAll = () => {
    onStyleChange('')
    onPriceTierChange('')
  }

  return (
    <div className="w-full space-y-6">
      {/* Clear All action */}
      {hasActiveFilters && (
        <div className="flex justify-end text-xs px-1 -mb-2">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Style filter */}
      <div className="space-y-2.5">
        <div className="text-xs text-white/50 px-1 uppercase tracking-wider font-semibold">
          Filter by Style
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <button
            type="button"
            onClick={() => onStyleChange('')}
            className={[
              'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border',
              !selectedStyle
                ? 'bg-gold-500 text-ink-950 border-gold-500 shadow-sm shadow-gold-500/20'
                : 'bg-white/[0.03] text-parchment-300 border-white/10 hover:border-white/20 hover:bg-white/[0.05]',
            ].join(' ')}
          >
            All Styles
          </button>

          {STYLE_TAG_OPTIONS.map((style) => {
            const isSelected = selectedStyle === style
            return (
              <button
                key={style}
                type="button"
                onClick={() => onStyleChange(style)}
                className={[
                  'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border',
                  isSelected
                    ? 'bg-gold-500 text-ink-950 border-gold-500 shadow-sm shadow-gold-500/20'
                    : 'bg-white/[0.03] text-parchment-300 border-white/10 hover:border-white/20 hover:bg-white/[0.05]',
                ].join(' ')}
              >
                {style}
              </button>
            )
          })}
        </div>
      </div>

      {/* Price tier filter */}
      <div className="space-y-2.5">
        <div className="text-xs text-white/50 px-1 uppercase tracking-wider font-semibold">
          Budget / Price Tier
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onPriceTierChange('')}
            className={[
              'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border',
              !selectedPriceTier
                ? 'bg-gold-500 text-ink-950 border-gold-500 shadow-sm shadow-gold-500/20'
                : 'bg-white/[0.03] text-parchment-300 border-white/10 hover:border-white/20 hover:bg-white/[0.05]',
            ].join(' ')}
          >
            Any Price
          </button>

          {PRICE_TIERS.map((tier) => {
            const isSelected = selectedPriceTier === tier
            return (
              <button
                key={tier}
                type="button"
                onClick={() => onPriceTierChange(tier)}
                className={[
                  'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border min-w-[3.5rem] text-center',
                  isSelected
                    ? 'bg-gold-500 text-ink-950 border-gold-500 shadow-sm shadow-gold-500/20'
                    : 'bg-white/[0.03] text-parchment-300 border-white/10 hover:border-white/20 hover:bg-white/[0.05]',
                ].join(' ')}
              >
                {tier}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
