ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS duration_semesters INTEGER,
  ADD COLUMN IF NOT EXISTS semester_fees JSONB;