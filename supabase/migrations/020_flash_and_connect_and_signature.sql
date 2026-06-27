-- Migration 020: Flash designs, Stripe Connect, and Consent signature drawing

ALTER TABLE public.artists DROP CONSTRAINT IF EXISTS artists_onboarding_step_check;
ALTER TABLE public.artists ADD CONSTRAINT artists_onboarding_step_check CHECK (onboarding_step BETWEEN 1 AND 6);

ALTER TABLE public.consent_form_submissions
  ADD COLUMN IF NOT EXISTS signature_image_data text;

ALTER TABLE public.artists
  ADD COLUMN IF NOT EXISTS stripe_connect_account_id text,
  ADD COLUMN IF NOT EXISTS stripe_connect_status text DEFAULT 'unlinked'
    CHECK (stripe_connect_status IN ('unlinked', 'pending', 'verified'));

CREATE TABLE IF NOT EXISTS public.flash_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  title text NOT NULL,
  price numeric(10,2) NOT NULL,
  size_cm text,
  image_path text NOT NULL,
  status text DEFAULT 'available' CHECK (status IN ('available', 'booked', 'hidden')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS flash_design_id uuid REFERENCES public.flash_designs(id) ON DELETE SET NULL;

-- RLS policies for flash designs
ALTER TABLE public.flash_designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_view_available_flash" ON public.flash_designs
  FOR SELECT USING (status != 'hidden');

CREATE POLICY "artists_manage_own_flash" ON public.flash_designs
  FOR ALL USING (
    artist_id IN (SELECT id FROM public.artists WHERE user_id = auth.uid())
  );

NOTIFY pgrst, 'reload schema';
