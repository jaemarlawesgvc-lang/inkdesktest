import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/server'
import { checkAvailabilitySchema } from '@/lib/validations/booking'
import { getConsultationSlotsForDate } from '@/lib/booking/consultation-slots'
import { CONSULTATION_DURATION_HOURS } from '@/lib/constants'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl

  const parsed = checkAvailabilitySchema.safeParse({
    artistId: searchParams.get('artistId') ?? '',
    date: searchParams.get('date') ?? '',
  })

  if (!parsed.success) {
    return NextResponse.json(
      { slots: [], error: parsed.error.errors[0]?.message ?? 'Invalid input' },
      { status: 400 },
    )
  }

  const supabase = createSupabaseAdminClient()

  const { data: artist } = await supabase
    .from('artists')
    .select('id, onboarding_complete')
    .eq('id', parsed.data.artistId)
    .is('deleted_at', null)
    .single()

  if (!artist || !artist.onboarding_complete) {
    return NextResponse.json({ slots: [], error: 'Artist not found' }, { status: 404 })
  }

  const { slots, reason } = await getConsultationSlotsForDate(
    supabase,
    parsed.data.artistId,
    parsed.data.date,
    CONSULTATION_DURATION_HOURS,
  )

  return NextResponse.json({
    slots,
    durationHours: CONSULTATION_DURATION_HOURS,
    reason,
    availableCount: slots.filter((s) => s.available).length,
  })
}
