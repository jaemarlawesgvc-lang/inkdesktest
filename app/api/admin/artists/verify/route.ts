import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase/server'
import { VerifyArtistSchema } from '@/lib/validations/admin'

export const runtime = 'nodejs'

export async function POST(request: NextRequest): Promise<NextResponse> {
  // ── 1. Verify admin session ────────────────────────────────────────────────
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // ── 2. Validate input ─────────────────────────────────────────────────────
  const body = await request.json()
  const parsed = VerifyArtistSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { artistId, verify } = parsed.data

  // ── 3. Toggle verification status via Supabase Admin Client ────────────────
  const adminClient = createSupabaseAdminClient()

  const { error: updateError } = await adminClient
    .from('artists')
    .update({ is_verified: verify })
    .eq('id', artistId)

  if (updateError) {
    console.error('[admin] verify artist error:', updateError.message)
    return NextResponse.json({ error: 'Failed to update artist verification status' }, { status: 500 })
  }

  // ── 4. Log audit event ─────────────────────────────────────────────────────
  await adminClient.from('audit_logs').insert({
    user_id: user.id,
    action: verify ? 'artist_verified' : 'artist_unverified',
    resource_type: 'artist',
    resource_id: artistId,
    metadata: { target_artist_id: artistId },
    ip_address: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? null,
  })

  return NextResponse.json({ success: true })
}
