'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { step5Schema, type Step5Values } from '@/lib/validations/onboarding'
import {
  StepIntro,
  FieldLabel,
  FieldError,
  WizardNav,
  fieldClass,
} from '@/components/onboarding/ui'

interface Step5Props {
  defaultValue: string
  onNext: (data: { zoomLink: string | null }) => Promise<void>
  onBack: () => void
  isSaving: boolean
}

export function Step5Zoom({ defaultValue, onNext, onBack, isSaving }: Step5Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step5Values>({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      zoomLink: defaultValue,
    },
  })

  // Simulated countdown for the Zoom mockup
  const [secondsLeft, setSecondsLeft] = useState(1799) // 29:59
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 1799))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const onSubmit = async (values: Step5Values) => {
    await onNext({ zoomLink: values.zoomLink || null })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <StepIntro
        eyebrow="Integrations"
        title="Set up your Zoom consultations"
        description="Meet clients online face-to-face to discuss design details, sizing, placement, and final pricing before upgrading them to a live booking slot."
      />

      {/* CSS-Animated Zoom Consultation Video Call Mockup */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4 shadow-inner">
        {/* Top bar info */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5 text-[10px] text-white/55">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span>● REC</span>
            <span className="text-white/30">|</span>
            <span>Inkquire Secure Consultation</span>
          </div>
          <div className="font-mono text-white/80 font-semibold bg-white/5 px-2 py-0.5 rounded">
            {formatTimer(secondsLeft)}
          </div>
        </div>

        {/* Video feed boxes */}
        <div className="grid grid-cols-2 gap-3.5 my-4">
          {/* Client box */}
          <div className="relative aspect-video rounded-lg bg-zinc-900 border border-white/5 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-semibold tracking-wider text-white">
              Client: Jaemar Lawes
            </div>
            
            {/* Animated Profile Avatar */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30">
              <span className="absolute -inset-2 rounded-full border border-gold-500/20 animate-ping opacity-60" />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>

            {/* Speaking audio wave indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-1 bg-gold-500 rounded-full animate-[bounce_0.8s_infinite]" />
              <span className="w-0.5 h-2 bg-gold-500 rounded-full animate-[bounce_0.6s_infinite_0.1s]" />
              <span className="w-0.5 h-3 bg-gold-500 rounded-full animate-[bounce_0.7s_infinite_0.2s]" />
              <span className="w-0.5 h-1.5 bg-gold-500 rounded-full animate-[bounce_0.5s_infinite_0.3s]" />
            </div>
          </div>

          {/* Artist box */}
          <div className="relative aspect-video rounded-lg bg-zinc-900 border border-white/5 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-semibold tracking-wider text-white">
              You (Artist)
            </div>

            {/* Simulated webcam placeholder */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/50 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>
            
            <div className="absolute bottom-2 right-2 text-[8px] text-white/35 font-medium tracking-wide">
              Webcam Active
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-center gap-4 pt-2.5 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-white/10 text-white/80 cursor-default">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </span>
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-white/10 text-white/80 cursor-default">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </span>
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-white/10 text-white/80 cursor-default">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6-6m0 0l6 6m-6-6v12m0 3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <span className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-[10px] font-bold text-white tracking-wide uppercase transition-colors select-none cursor-default">
            Leave Room
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Step-by-step Zoom instructions */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 space-y-3 text-sm">
          <h3 className="font-semibold text-white">How to set up video consultations for free</h3>
          <ol className="list-decimal pl-5 space-y-2.5 text-parchment-350 leading-relaxed">
            <li>
              Don&apos;t have a Zoom account? Create a free one in under 2 minutes at{' '}
              <a
                href="https://zoom.us/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-400 hover:text-gold-300 font-medium underline underline-offset-2 transition-colors"
              >
                zoom.us/signup
              </a>.
            </li>
            <li>
              Log in to your Zoom account and open your **Profile** or **Settings**.
            </li>
            <li>
              Locate your **Personal Meeting ID (PMI) Link** (a permanent link like `https://zoom.us/j/1234567890` or `https://zoom.us/my/yourname`).
            </li>
            <li>
              Copy that link and paste it in the field below. Inkquire will automatically add this link to all consultation calendar invites and confirmation emails for your clients.
            </li>
          </ol>

          <div className="pt-2 flex justify-start">
            <a
              href="https://zoom.us/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded bg-gold-500/10 border border-gold-500/20 px-3.5 py-2 text-xs font-semibold text-gold-400 hover:bg-gold-500/20 transition-all active:scale-[0.98]"
            >
              Open Zoom Signup Page ↗
            </a>
          </div>
        </div>

        <div className="space-y-1.5">
          <FieldLabel htmlFor="zoomLink">Personal Zoom Link</FieldLabel>
          <input
            id="zoomLink"
            type="url"
            {...register('zoomLink')}
            className={fieldClass}
            placeholder="e.g. https://zoom.us/j/1234567890"
            disabled={isSaving}
          />
          {errors.zoomLink && <FieldError>{errors.zoomLink.message}</FieldError>}
          <p className="text-xs text-ink-500 leading-normal">
            If you leave this empty, clients will contact you manually to set up a consultation link.
          </p>
        </div>
      </div>

      <WizardNav onBack={onBack} submitLabel="Save & Continue" busy={isSaving} />
    </form>
  )
}
