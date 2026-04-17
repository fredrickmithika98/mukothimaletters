-- Fix: Restrict courses SELECT to active courses only
DROP POLICY IF EXISTS "Anyone can view active courses" ON public.courses;
CREATE POLICY "Anyone can view active courses"
ON public.courses
FOR SELECT
USING (is_active = true);

-- Admins can still view all courses (including inactive) for management
CREATE POLICY "Admins can view all courses"
ON public.courses
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add length constraints to admission_downloads to prevent abuse
ALTER TABLE public.admission_downloads
  ADD CONSTRAINT admission_downloads_full_name_length CHECK (char_length(full_name) BETWEEN 1 AND 200),
  ADD CONSTRAINT admission_downloads_index_number_length CHECK (char_length(index_number) BETWEEN 1 AND 50),
  ADD CONSTRAINT admission_downloads_phone_length CHECK (char_length(phone_number) BETWEEN 1 AND 20),
  ADD CONSTRAINT admission_downloads_course_length CHECK (char_length(course_name) BETWEEN 1 AND 300),
  ADD CONSTRAINT admission_downloads_faculty_length CHECK (char_length(faculty) BETWEEN 1 AND 200),
  ADD CONSTRAINT admission_downloads_category_check CHECK (category IN ('Diploma', 'Certificate')),
  ADD CONSTRAINT admission_downloads_grade_length CHECK (char_length(mean_grade) BETWEEN 1 AND 10);