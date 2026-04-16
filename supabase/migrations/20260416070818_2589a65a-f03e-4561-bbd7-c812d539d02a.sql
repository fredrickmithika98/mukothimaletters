
CREATE TABLE public.letter_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_key text NOT NULL UNIQUE,
  label text NOT NULL,
  content text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.letter_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view templates" ON public.letter_templates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can update templates" ON public.letter_templates FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert templates" ON public.letter_templates FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete templates" ON public.letter_templates FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_letter_templates_updated_at
  BEFORE UPDATE ON public.letter_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default template content
INSERT INTO public.letter_templates (template_key, label, content) VALUES
  ('body_intro', 'Introduction Paragraph', 'Following your completion of form four studies, we are pleased to inform you that you have been offered provisional admission to Tharaka University, Mukothima Center for a {{courseName}} in the {{faculty}}, for the 2026/2027 academic year.'),
  ('semester_info', 'Semester Information', 'The program is designed to take {{semesters}} semesters. All new students will be required to report to the University for registration and commencement of first semester studies on Tuesday 15/09/2026.'),
  ('conditions_heading', 'Conditions Heading', 'Your registration as a student of Tharaka University shall be subject to the following conditions:'),
  ('condition_1', 'Condition 1 - Verification', 'Verification of your qualifications by the University. You must present the originals of: KCSE results slip or certificate, school leaving certificate, and national ID / Birth Certificate at your first registration.'),
  ('condition_2', 'Condition 2 - Declaration', 'To accept, by signing a declaration form, to adhere to all University Rules and Regulations governing Students Conduct after reporting.'),
  ('condition_3', 'Condition 3 - Payment', 'Payment of all fees and charges as set out below:'),
  ('fee_note', 'Fee Note', 'Please note that the University fees and other charges are determined by the University Council. The Council may revise the fees structure at any time it deems necessary.'),
  ('payment_instruction', 'Payment Instruction', 'All students MUST pay the required {{admissionFee}} non-refundable admission fees through Government E-CITIZEN platform:'),
  ('mpesa_line_1', 'M-Pesa Step 1', 'Go to Lipa na M-Pesa'),
  ('mpesa_line_2', 'M-Pesa Step 2', 'Pay Bill 222222'),
  ('mpesa_line_3', 'M-Pesa Step 3', 'Account No. APPF-NAME'),
  ('mpesa_line_4', 'M-Pesa Step 4', 'Amount…….'),
  ('mpesa_line_5', 'M-Pesa Step 5', 'M-Pesa Pin'),
  ('after_payment', 'After Payment Note', 'After payment, print your M-Pesa SMS and attach it to your academic documents for admission number processing.'),
  ('arrangement_note', 'Arrangement Note', 'You will also be required to make your own arrangements during the year to meet catering, exercise books & stationery and accommodation expenses.'),
  ('nb_diploma', 'NB Note (Diploma)', 'NB/ You will be ELIGIBLE FOR GOVERNMENT HELB LOAN and credit transfer that may allow you to complete the degree course in three (3) years after graduating with a diploma.'),
  ('nb_certificate', 'NB Note (Certificate)', 'NB/ You will be ELIGIBLE for Four/Six Semester Diploma after graduating with a Certificate.'),
  ('contact_info', 'Contact Information', 'If you accept the offer under these conditions, contact Mobile No. 0720021155 - Dr. Faustine Muchui to formalize your admission.'),
  ('closing_text', 'Closing Text', 'We look forward to you joining Tharaka University - Mukothima Centre and on behalf of the Vice Chancellor, I wish you success in your future studies at our institution.'),
  ('signatory_name', 'Signatory Name', 'Dr. Daniel Mwangi'),
  ('signatory_title', 'Signatory Title', 'Ag. Registrar (Academic Affairs)'),
  ('diploma_fee_regular_tuition_y1s1', 'Diploma Regular Tuition Y1S1', '35,000'),
  ('diploma_fee_regular_tuition_y1s2', 'Diploma Regular Tuition Y1S2', '35,000'),
  ('diploma_fee_odel_tuition_y1s1', 'Diploma ODeL Tuition Y1S1', '26,000'),
  ('diploma_fee_odel_tuition_y1s2', 'Diploma ODeL Tuition Y1S2', '26,000'),
  ('diploma_fee_odel_tuition_y2s1', 'Diploma ODeL Tuition Y2S1', '26,000'),
  ('diploma_fee_odel_tuition_y2s2', 'Diploma ODeL Tuition Y2S2', '26,000'),
  ('diploma_admission_fee', 'Diploma Admission Fee', '2,000'),
  ('certificate_admission_fee', 'Certificate Admission Fee', '1,000'),
  ('cert_fee_regular_tuition_y1s1', 'Certificate Regular Tuition Y1S1', '30,000'),
  ('cert_fee_regular_tuition_y1s2', 'Certificate Regular Tuition Y1S2', '30,000'),
  ('cert_fee_odel_tuition_y1s1', 'Certificate ODeL Tuition Y1S1', '17,500'),
  ('cert_fee_odel_tuition_y1s2', 'Certificate ODeL Tuition Y1S2', '17,500'),
  ('footer_line_1', 'Footer Line 1', 'Education for Freedom / Elimu ni Uhuru'),
  ('footer_line_2', 'Footer Line 2', 'Tharaka University is ISO 9001:2015 Certified');
