'use client'

import { useRef, useEffect, useState } from 'react'

interface SignatureCanvasProps {
  onChange: (base64DataUrl: string | null) => void
  disabled?: boolean
}

export function SignatureCanvas({ onChange, disabled }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)

  // Retrieve accurate event coordinates
  const getCoordinates = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    
    // Scale client coords to match canvas back buffer resolution
    const clientX = 'touches' in e ? (e.touches[0]?.clientX ?? 0) : e.clientX
    const clientY = 'touches' in e ? (e.touches[0]?.clientY ?? 0) : e.clientY

    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  // Draw operations
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return
    e.preventDefault()
    
    const coords = getCoordinates(e.nativeEvent)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(coords.x, coords.y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return
    e.preventDefault()

    const coords = getCoordinates(e.nativeEvent)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    ctx.lineTo(coords.x, coords.y)
    ctx.stroke()
    setIsEmpty(false)
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    
    // Fire callback with data URL
    const canvas = canvasRef.current
    if (canvas && !isEmpty) {
      onChange(canvas.toDataURL('image/png'))
    }
  }

  // Clear canvas board
  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
    onChange(null)
  }

  // Initialize canvas configurations
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2

    // Stroke styles
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  return (
    <div className="space-y-2">
      <div className="relative h-32 w-full rounded-lg border border-white/20 bg-zinc-950/70 overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
        />
        
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-white/20 uppercase tracking-widest font-semibold">
            Sign here
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={clear}
          disabled={disabled || isEmpty}
          className="text-xs text-white/40 hover:text-white/70 font-semibold px-2 py-1 transition-colors disabled:opacity-30"
        >
          Clear Signature
        </button>
      </div>
    </div>
  )
}
