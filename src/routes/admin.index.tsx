import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

interface Download {
  id: string;
  full_name: string;
  index_number: string;
  phone_number: string;
  course_name: string;
  faculty: string;
  category: string;
  mean_grade: string;
  downloaded_at: string;
}

interface Course {
  id: string;
  name: string;
  faculty: string;
  category: string;
  is_active: boolean;
}

interface LetterTemplate {
  id: string;
  template_key: string;
  label: string;
  content: string;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [templates, setTemplates] = useState<LetterTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<"downloads" | "courses" | "templates">("downloads");
  const [searchTerm, setSearchTerm] = useState("");
  const [savingTemplates, setSavingTemplates] = useState(false);
  const [templateEdits, setTemplateEdits] = useState<Record<string, string>>({});

  // Course form state
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseName, setCourseName] = useState("");
  const [courseFaculty, setCourseFaculty] = useState("");
  const [courseCategory, setCourseCategory] = useState<"Diploma" | "Certificate">("Diploma");

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate({ to: "/admin/login" });
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      await supabase.auth.signOut();
      navigate({ to: "/admin/login" });
      return;
    }

    await Promise.all([fetchDownloads(), fetchCourses(), fetchTemplates()]);
    setLoading(false);
  }

  async function fetchDownloads() {
    const { data } = await supabase
      .from("admission_downloads")
      .select("*")
      .order("downloaded_at", { ascending: false });
    if (data) setDownloads(data);
  }

  async function fetchCourses() {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .order("category", { ascending: true })
      .order("name", { ascending: true });
    if (data) setCourses(data);
  }

  async function fetchTemplates() {
    const { data } = await supabase
      .from("letter_templates")
      .select("*")
      .order("template_key", { ascending: true });
    if (data) {
      setTemplates(data);
      const edits: Record<string, string> = {};
      data.forEach((t) => { edits[t.template_key] = t.content; });
      setTemplateEdits(edits);
    }
  }

  async function handleSaveTemplates() {
    setSavingTemplates(true);
    const updates = templates.map((t) =>
      supabase
        .from("letter_templates")
        .update({ content: templateEdits[t.template_key] ?? t.content })
        .eq("id", t.id)
    );
    await Promise.all(updates);
    await fetchTemplates();
    setSavingTemplates(false);
    alert("All templates saved successfully!");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  function openAddCourse() {
    setEditingCourse(null);
    setCourseName("");
    setCourseFaculty("");
    setCourseCategory("Diploma");
    setCourseDialogOpen(true);
  }

  function openEditCourse(course: Course) {
    setEditingCourse(course);
    setCourseName(course.name);
    setCourseFaculty(course.faculty);
    setCourseCategory(course.category as "Diploma" | "Certificate");
    setCourseDialogOpen(true);
  }

  async function handleSaveCourse() {
    if (!courseName.trim() || !courseFaculty.trim()) return;

    if (editingCourse) {
      await supabase
        .from("courses")
        .update({ name: courseName.trim(), faculty: courseFaculty.trim(), category: courseCategory })
        .eq("id", editingCourse.id);
    } else {
      await supabase
        .from("courses")
        .insert({ name: courseName.trim(), faculty: courseFaculty.trim(), category: courseCategory });
    }

    setCourseDialogOpen(false);
    await fetchCourses();
  }

  async function handleToggleCourse(course: Course) {
    await supabase
      .from("courses")
      .update({ is_active: !course.is_active })
      .eq("id", course.id);
    await fetchCourses();
  }

  async function handleDeleteCourse(id: string) {
    if (!confirm("Are you sure you want to delete this course?")) return;
    await supabase.from("courses").delete().eq("id", id);
    await fetchCourses();
  }

  const filteredDownloads = downloads.filter(
    (d) =>
      d.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.index_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone_number.includes(searchTerm) ||
      d.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Summary stats
  const totalDownloads = downloads.length;
  const diplomaCount = downloads.filter((d) => d.category === "Diploma").length;
  const certificateCount = downloads.filter((d) => d.category === "Certificate").length;
  const uniqueApplicants = new Set(downloads.map((d) => d.index_number)).size;

  // Group templates by category for the editor
  const templateGroups = [
    { title: "Letter Body Text", keys: ["body_intro", "semester_info"] },
    { title: "Conditions", keys: ["conditions_heading", "condition_1", "condition_2", "condition_3"] },
    { title: "Fee Amounts - Diploma", keys: ["diploma_admission_fee", "diploma_fee_regular_tuition_y1s1", "diploma_fee_regular_tuition_y1s2", "diploma_fee_odel_tuition_y1s1", "diploma_fee_odel_tuition_y1s2", "diploma_fee_odel_tuition_y2s1", "diploma_fee_odel_tuition_y2s2"] },
    { title: "Fee Amounts - Certificate", keys: ["certificate_admission_fee", "cert_fee_regular_tuition_y1s1", "cert_fee_regular_tuition_y1s2", "cert_fee_odel_tuition_y1s1", "cert_fee_odel_tuition_y1s2"] },
    { title: "Payment Instructions", keys: ["fee_note", "payment_instruction", "mpesa_line_1", "mpesa_line_2", "mpesa_line_3", "mpesa_line_4", "mpesa_line_5", "after_payment"] },
    { title: "Additional Notes", keys: ["arrangement_note", "nb_diploma", "nb_certificate", "contact_info", "closing_text"] },
    { title: "Signatory & Footer", keys: ["signatory_name", "signatory_title", "footer_line_1", "footer_line_2"] },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">Tharaka University - Mukothima Centre</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Downloads</p>
              <p className="text-3xl font-bold text-foreground">{totalDownloads}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Unique Applicants</p>
              <p className="text-3xl font-bold text-foreground">{uniqueApplicants}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Diploma Letters</p>
              <p className="text-3xl font-bold text-primary">{diplomaCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Certificate Letters</p>
              <p className="text-3xl font-bold text-primary">{certificateCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === "downloads" ? "default" : "outline"}
            onClick={() => setActiveTab("downloads")}
          >
            Download Records
          </Button>
          <Button
            variant={activeTab === "courses" ? "default" : "outline"}
            onClick={() => setActiveTab("courses")}
          >
            Manage Courses
          </Button>
          <Button
            variant={activeTab === "templates" ? "default" : "outline"}
            onClick={() => setActiveTab("templates")}
          >
            ✏️ Edit Letter
          </Button>
        </div>

        {/* Downloads Tab */}
        {activeTab === "downloads" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Downloaded Admission Letters</CardTitle>
              <Input
                placeholder="Search by name, index, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </CardHeader>
            <CardContent>
              {filteredDownloads.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No download records yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Index No.</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Faculty</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDownloads.map((d, i) => (
                        <TableRow key={d.id}>
                          <TableCell className="font-medium">{i + 1}</TableCell>
                          <TableCell>{d.full_name}</TableCell>
                          <TableCell>{d.index_number}</TableCell>
                          <TableCell>{d.phone_number}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{d.course_name}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{d.faculty}</TableCell>
                          <TableCell>
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                              d.category === "Diploma"
                                ? "bg-primary/10 text-primary"
                                : "bg-accent text-accent-foreground"
                            }`}>
                              {d.category}
                            </span>
                          </TableCell>
                          <TableCell>{d.mean_grade}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {new Date(d.downloaded_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Courses & Faculties</CardTitle>
              <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={openAddCourse}>+ Add Course</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Course Name</Label>
                      <Input
                        placeholder="e.g. Diploma in Computer Science"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Faculty</Label>
                      <Input
                        placeholder="e.g. Faculty of Pure & Engineering Technology"
                        value={courseFaculty}
                        onChange={(e) => setCourseFaculty(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={courseCategory} onValueChange={(v) => setCourseCategory(v as "Diploma" | "Certificate")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Diploma">Diploma</SelectItem>
                          <SelectItem value="Certificate">Certificate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSaveCourse} className="w-full">
                      {editingCourse ? "Update Course" : "Add Course"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No courses added yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((c, i) => (
                      <TableRow key={c.id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{c.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{c.faculty}</TableCell>
                        <TableCell>
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            c.category === "Diploma"
                              ? "bg-primary/10 text-primary"
                              : "bg-accent text-accent-foreground"
                          }`}>
                            {c.category}
                          </span>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleToggleCourse(c)}
                            className={`text-xs px-2 py-0.5 rounded ${
                              c.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {c.is_active ? "Active" : "Inactive"}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEditCourse(c)}>
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteCourse(c.id)}>
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Letter Templates Tab */}
        {activeTab === "templates" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Edit Admission Letter</h2>
                <p className="text-sm text-muted-foreground">
                  Edit any section below. Use <code className="bg-muted px-1 rounded text-xs">{"{{courseName}}"}</code>, <code className="bg-muted px-1 rounded text-xs">{"{{faculty}}"}</code>, <code className="bg-muted px-1 rounded text-xs">{"{{semesters}}"}</code>, <code className="bg-muted px-1 rounded text-xs">{"{{admissionFee}}"}</code> as placeholders.
                </p>
              </div>
              <Button onClick={handleSaveTemplates} disabled={savingTemplates}>
                {savingTemplates ? "Saving..." : "💾 Save All Changes"}
              </Button>
            </div>

            {templateGroups.map((group) => (
              <Card key={group.title}>
                <CardHeader>
                  <CardTitle className="text-base">{group.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {group.keys.map((key) => {
                    const tpl = templates.find((t) => t.template_key === key);
                    if (!tpl) return null;
                    const isShort = key.startsWith("mpesa_") || key.startsWith("signatory_") || key.startsWith("footer_") || key.includes("admission_fee") || key.includes("tuition");
                    return (
                      <div key={key} className="space-y-1">
                        <Label className="text-sm font-medium">{tpl.label}</Label>
                        {isShort ? (
                          <Input
                            value={templateEdits[key] ?? tpl.content}
                            onChange={(e) => setTemplateEdits((prev) => ({ ...prev, [key]: e.target.value }))}
                          />
                        ) : (
                          <Textarea
                            value={templateEdits[key] ?? tpl.content}
                            onChange={(e) => setTemplateEdits((prev) => ({ ...prev, [key]: e.target.value }))}
                            rows={3}
                          />
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
