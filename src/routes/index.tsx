import { createFileRoute } from "@tanstack/react-router";
import { AdmissionForm } from "@/components/AdmissionForm";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <AdmissionForm />;
}
