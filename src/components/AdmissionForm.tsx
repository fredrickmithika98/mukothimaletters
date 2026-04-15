import { useState } from "react";
import { type Grade, type ApplicantData, type AdmissionResult, getAllGrades, evaluateAdmission } from "@/lib/admission-logic";
import { generateAdmissionLetter } from "@/lib/generate-pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const grades = getAllGrades();

export function AdmissionForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    indexNumber: "",
    phoneNumber: "",
    meanGrade: "" as Grade | "",
    biologyGrade: "" as Grade | "",
  });
  const [result, setResult] = useState<AdmissionResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.indexNumber.trim()) errs.indexNumber = "Index number is required";
    if (!formData.phoneNumber.trim()) errs.phoneNumber = "Phone number is required";
    if (!formData.meanGrade) errs.meanGrade = "Mean grade is required";
    if (!formData.biologyGrade) errs.biologyGrade = "Biology grade is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const data: ApplicantData = {
      fullName: formData.fullName.trim(),
      indexNumber: formData.indexNumber.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      meanGrade: formData.meanGrade as Grade,
      biologyGrade: formData.biologyGrade as Grade,
    };
    setResult(evaluateAdmission(data));
  }

  function handleDownload() {
    if (!result?.eligible) return;
    const data: ApplicantData = {
      fullName: formData.fullName.trim(),
      indexNumber: formData.indexNumber.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      meanGrade: formData.meanGrade as Grade,
      biologyGrade: formData.biologyGrade as Grade,
    };
    generateAdmissionLetter(data, result);
  }

  function handleReset() {
    setFormData({ fullName: "", indexNumber: "", phoneNumber: "", meanGrade: "", biologyGrade: "" });
    setResult(null);
    setErrors({});
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-4 py-1.5 mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
          </svg>
          <span className="text-sm font-medium text-primary">Kenya National Polytechnic</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          Admission Letter Generator
        </h1>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
          Enter your details below to check eligibility and generate your official admission letter.
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Form Card */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-foreground">Applicant Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="e.g. John Kamau Mwangi"
                  value={formData.fullName}
                  onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="indexNumber">Index Number</Label>
                  <Input
                    id="indexNumber"
                    placeholder="e.g. 12345678/2024"
                    value={formData.indexNumber}
                    onChange={(e) => setFormData((p) => ({ ...p, indexNumber: e.target.value }))}
                  />
                  {errors.indexNumber && <p className="text-sm text-destructive">{errors.indexNumber}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="e.g. 0712345678"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData((p) => ({ ...p, phoneNumber: e.target.value }))}
                  />
                  {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>KCSE Mean Grade</Label>
                  <Select value={formData.meanGrade} onValueChange={(v) => setFormData((p) => ({ ...p, meanGrade: v as Grade }))}>
                    <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                    <SelectContent>
                      {grades.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.meanGrade && <p className="text-sm text-destructive">{errors.meanGrade}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Biology Grade</Label>
                  <Select value={formData.biologyGrade} onValueChange={(v) => setFormData((p) => ({ ...p, biologyGrade: v as Grade }))}>
                    <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                    <SelectContent>
                      {grades.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.biologyGrade && <p className="text-sm text-destructive">{errors.biologyGrade}</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1">
                  Check Eligibility
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Result Card */}
        {result && (
          <Card className={`border-2 ${result.eligible ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"}`}>
            <CardContent className="pt-6">
              {result.eligible ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">Admission Approved!</h3>
                      <p className="text-sm text-muted-foreground">You are eligible for the following programme</p>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-4 border border-border space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <span className="text-sm font-semibold text-foreground">{result.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Programme</span>
                      <span className="text-sm font-semibold text-foreground">{result.courseName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Faculty</span>
                      <span className="text-sm font-semibold text-foreground text-right max-w-[60%]">{result.faculty}</span>
                    </div>
                  </div>

                  <Button onClick={handleDownload} className="w-full gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download Admission Letter (PDF)
                  </Button>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-destructive/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Not Eligible</h3>
                    <p className="text-sm text-muted-foreground mt-1">{result.reason}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
