-- Replace permissive WITH CHECK (true) with format validation
DROP POLICY IF EXISTS "Anyone can log downloads" ON public.admission_downloads;

CREATE POLICY "Anyone can log downloads"
ON public.admission_downloads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(full_name) BETWEEN 2 AND 200
  AND char_length(index_number) BETWEEN 2 AND 50
  AND char_length(phone_number) BETWEEN 7 AND 20
  AND phone_number ~ '^[0-9+\-\s()]+$'
  AND category IN ('Diploma', 'Certificate')
);