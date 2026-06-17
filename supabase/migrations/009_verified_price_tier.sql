-- ══════════════════════════════════════════════════════════════════════════════
--  InkDesk — Migration 009: Verified Badges & Price Tiers
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.artists 
  ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;

ALTER TABLE public.artists 
  ADD COLUMN IF NOT EXISTS price_tier text NOT NULL DEFAULT '££' 
  CHECK (price_tier IN ('£', '££', '£££'));
