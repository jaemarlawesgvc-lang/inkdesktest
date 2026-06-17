'use client'

import { useState, useTransition } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArtistRow {
  id: string
  userId: string
  username: string | null
  displayName: string | null
  email: string
  plan: string
  onboardingComplete: boolean
  onboardingStep: number
  createdAt: string
  isVerified: boolean
}

interface ArtistsTableProps {
  initialArtists: ArtistRow[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ArtistsTable({ initialArtists }: ArtistsTableProps) {
  const [artists, setArtists] = useState<ArtistRow[]>(initialArtists)
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [filterOnboarding, setFilterOnboarding] = useState<string>('all')
  const [isPending, startTransition] = useTransition()
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const filtered = artists.filter((a) => {
    if (filterPlan !== 'all' && a.plan !== filterPlan) return false
    if (filterOnboarding === 'complete' && !a.onboardingComplete) return false
    if (filterOnboarding === 'incomplete' && a.onboardingComplete) return false
    return true
  })

  async function handleToggleVerify(artistId: string, verify: boolean) {
    setActionMessage(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/artists/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ artistId, verify }),
        })
        const data = await res.json()
        if (!res.ok) {
          setActionMessage({ type: 'error', text: data.error ?? 'Failed to update verification status' })
          return
        }
        setArtists((prev) =>
          prev.map((a) => (a.id === artistId ? { ...a, isVerified: verify } : a)),
        )
        setActionMessage({
          type: 'success',
          text: verify ? 'Artist marked as verified' : 'Artist verification removed',
        })
      } catch {
        setActionMessage({ type: 'error', text: 'Network error' })
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Action feedback */}
      {actionMessage && (
        <div
          className={`text-sm px-4 py-2 rounded-lg ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-crimson-500/10 text-crimson-400'
          }`}
          role="alert"
        >
          {actionMessage.text}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="rounded-md border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-parchment-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
        >
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="studio">Studio</option>
        </select>

        <select
          value={filterOnboarding}
          onChange={(e) => setFilterOnboarding(e.target.value)}
          className="rounded-md border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-parchment-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
        >
          <option value="all">All Onboarding</option>
          <option value="complete">Complete</option>
          <option value="incomplete">Incomplete</option>
        </select>

        <span className="text-sm text-white/40 tabular-nums">
          {filtered.length} artist{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-white/40 uppercase text-xs tracking-widest">
            <tr>
              <th className="px-4 py-3 font-medium">Username</th>
              <th className="px-4 py-3 font-medium">Display Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Onboarding</th>
              <th className="px-4 py-3 font-medium">Verified</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-white/30">
                  No artists match the current filters.
                </td>
              </tr>
            )}
            {filtered.map((artist) => (
              <tr key={artist.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 text-white font-mono text-xs">
                  {artist.username ?? '—'}
                </td>
                <td className="px-4 py-3 text-white/80">
                  {artist.displayName ?? '—'}
                </td>
                <td className="px-4 py-3 text-white/60 font-mono text-xs">
                  {artist.email}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      artist.plan === 'studio'
                        ? 'bg-violet-500/20 text-violet-400'
                        : artist.plan === 'pro'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {artist.plan}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {artist.onboardingComplete ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                      Complete
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400">
                      Step {artist.onboardingStep}/5
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {artist.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-3.073a.75.75 0 00-1.214-.838L9.277 13.02l-1.8-1.8a.75.75 0 00-1.06 1.06l2.33 2.33a.75.75 0 001.137-.108l3.5-4.925z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/5 text-white/30">
                      No
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-white/40 text-xs tabular-nums">
                  {new Date(artist.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleVerify(artist.id, !artist.isVerified)}
                      disabled={isPending}
                      className="px-2.5 py-1 rounded text-xs font-medium bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {artist.isVerified ? 'Unverify' : 'Verify'}
                    </button>
                    {artist.username && artist.onboardingComplete && (
                      <a
                        href={`/${artist.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded text-xs font-medium bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        Public Page
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
