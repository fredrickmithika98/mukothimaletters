ALTER TABLE public.admission_downloads
  ADD COLUMN IF NOT EXISTS guardian_name TEXT,
  ADD COLUMN IF NOT EXISTS guardian_phone TEXT;

-- Drop and recreate the insert policy to include guardian field validation (optional fields)
DROP POLICY IF EXISTS "Anyone can log downloads" ON public.admission_downloads;

CREATE POLICY "Anyone can log downloads"
ON public.admission_downloads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(full_name) >= 2 AND char_length(full_name) <= 200
  AND char_length(index_number) >= 2 AND char_length(index_number) <= 50
  AND char_length(phone_number) >= 7 AND char_length(phone_number) <= 20
  AND phone_number ~ '^[0-9+\-\s()]+$'
  AND category = ANY (ARRAY['Diploma'::text, 'Certificate'::text])
  AND (guardian_name IS NULL OR char_length(guardian_name) <= 200)
  AND (guardian_phone IS NULL OR (char_length(guardian_phone) <= 20 AND guardian_phone ~ '^[0-9+\-\s()]+$'))
);