'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface FlashDesign {
  id: string
  title: string
  price: number
  size_cm: string | null
  image_path: string
  status: 'available' | 'booked' | 'hidden'
  created_at: string
}

interface FlashManagerProps {
  artistId: string
  initialFlash: FlashDesign[]
}

export function FlashManager({ artistId, initialFlash }: FlashManagerProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [designs, setDesigns] = useState<FlashDesign[]>(initialFlash)
  const [showAddModal, setShowAddModal] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [sizeCm, setSizeCm] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = getSupabaseBrowserClient()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG and WebP images are allowed')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !price || !imageFile) {
      toast.error('Please fill out all required fields and upload an image')
      return
    }

    setSubmitting(true)
    try {
      // 1. Upload to Supabase Storage
      const ext = imageFile.name.split('.').pop() ?? 'jpg'
      const storagePath = `${artistId}/flash/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(storagePath, imageFile, { cacheControl: '31536000', upsert: false, contentType: imageFile.type })

      if (uploadError) throw new Error(uploadError.message)

      const { data: urlData } = supabase.storage.from('portfolio-images').getPublicUrl(storagePath)

      // 2. Save in Database via API
      const res = await fetch('/api/dashboard/flash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          price: parseFloat(price),
          sizeCm: sizeCm || null,
          imagePath: urlData.publicUrl,
        }),
      })

      const json = await res.json() as { error?: string; flash?: FlashDesign }
      if (!res.ok) throw new Error(json.error ?? 'Failed to save design')

      if (json.flash) {
        setDesigns((prev) => [json.flash!, ...prev])
      }

      toast.success('Flash design added successfully!')
      setShowAddModal(false)
      
      // Reset form
      setTitle('')
      setPrice('')
      setSizeCm('')
      setImageFile(null)
      setImagePreview(null)

      startTransition(() => router.refresh())
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this flash design?')) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/dashboard/flash?id=${id}`, {
        method: 'DELETE',
      })

      const json = await res.json() as { error?: string; ok?: boolean }
      if (!res.ok) throw new Error(json.error ?? 'Failed to delete design')

      setDesigns((prev) => prev.filter((d) => d.id !== id))
      toast.success('Flash design deleted')
      startTransition(() => router.refresh())
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Pre-drawn Flash Designs</h2>
          <p className="text-white/40 text-xs mt-0.5">Manage designs clients can view and book instantly.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-white text-black hover:bg-white/90 text-sm font-semibold rounded-lg transition-colors"
        >
          Add Flash Design
        </button>
      </div>

      {designs.length === 0 ? (
        <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center">
          <p className="text-white/40 text-sm">No flash designs uploaded yet.</p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="mt-4 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
          >
            Upload your first design
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {designs.map((design) => (
            <div key={design.id} className="relative group overflow-hidden rounded-xl border border-white/10 bg-white/5 flex flex-col justify-between">
              {/* Image & aspect */}
              <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
                <img
                  src={design.image_path}
                  alt={design.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Status label */}
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${design.status === 'booked' ? 'bg-red-500/80 text-white' : 'bg-emerald-500/80 text-black'}`}>
                  {design.status}
                </span>
              </div>

              {/* Specs & Info */}
              <div className="p-3.5 space-y-2 bg-zinc-900/50">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white truncate max-w-[70%]">{design.title}</h3>
                  <span className="text-sm font-bold text-white/90">£{Number(design.price).toFixed(2)}</span>
                </div>
                
                {design.size_cm && (
                  <p className="text-xs text-white/40 font-medium">Approx. Size: {design.size_cm}</p>
                )}

                <div className="pt-2 border-t border-white/5 flex justify-end">
                  <button
                    type="button"
                    disabled={deletingId === design.id}
                    onClick={() => handleDelete(design.id)}
                    className="text-xs font-bold text-red-400/80 hover:text-red-400 transition-colors disabled:opacity-30"
                  >
                    {deletingId === design.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Flash Design Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity" role="dialog" aria-modal="true" aria-labelledby="add-flash-title">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between">
              <h3 id="add-flash-title" className="text-base font-semibold text-white">Add New Flash Design</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Image upload dropzone */}
              <div className="space-y-1.5">
                <label className="block text-xs text-white/50 uppercase tracking-widest font-semibold">Design Image *</label>
                
                {imagePreview ? (
                  <div className="relative aspect-square w-full max-w-[200px] mx-auto rounded-lg overflow-hidden border border-white/10 bg-zinc-950">
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-white/20 hover:border-white/40 rounded-lg p-6 text-center cursor-pointer bg-white/5 transition-colors"
                  >
                    <p className="text-xs text-white/40">Click to select or drop design image</p>
                    <p className="text-[10px] text-white/25 mt-0.5">JPEG, PNG, WebP up to 10MB</p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </div>

              {/* Title input */}
              <div className="space-y-1.5">
                <label htmlFor="flash-title" className="block text-xs text-white/50 uppercase tracking-widest font-semibold">Title *</label>
                <input
                  id="flash-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/50"
                  placeholder="e.g. Traditional Snake Head"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Price input */}
                <div className="space-y-1.5">
                  <label htmlFor="flash-price" className="block text-xs text-white/50 uppercase tracking-widest font-semibold">Price * (GBP)</label>
                  <input
                    id="flash-price"
                    type="number"
                    min="1"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/50"
                    placeholder="120.00"
                    required
                  />
                </div>

                {/* Size input */}
                <div className="space-y-1.5">
                  <label htmlFor="flash-size" className="block text-xs text-white/50 uppercase tracking-widest font-semibold">Size (e.g. 10x15 cm)</label>
                  <input
                    id="flash-size"
                    type="text"
                    value={sizeCm}
                    onChange={(e) => setSizeCm(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/50"
                    placeholder="10x12 cm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-white hover:bg-white/90 text-black font-semibold rounded-lg text-sm transition-colors mt-2"
              >
                {submitting ? 'Uploading & Creating…' : 'Upload Design'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
