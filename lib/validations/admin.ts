/**
 * lib/validations/admin.ts
 *
 * Zod schemas for admin portal API inputs.
 */

import { z } from 'zod'

// ─── User suspension ─────────────────────────────────────────────────────────

export const SuspendUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  suspend: z.boolean(),
})

export type SuspendUserInput = z.infer<typeof SuspendUserSchema>

// ─── Password reset ──────────────────────────────────────────────────────────

export const ResetPasswordSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
})

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>

// ─── Webhook retry ───────────────────────────────────────────────────────────

export const RetryWebhookSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
})

// ─── Artist Verification ──────────────────────────────────────────────────────

export const VerifyArtistSchema = z.object({
  artistId: z.string().uuid('Invalid artist ID'),
  verify: z.boolean(),
})

export type VerifyArtistInput = z.infer<typeof VerifyArtistSchema>

