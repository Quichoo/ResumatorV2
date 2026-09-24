import type { Metadata } from "next";
import { Paper } from "@mantine/core";
import CreateResumeForm from "@/components/resumes/CreateResumeForm";
import ResumesPageShell from "@/components/resumes/ResumesPageShell";
import { requireUser } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Create resume | Resumator",
};

export default async function NewResumePage() {
  await requireUser();

  return (
    <ResumesPageShell
      title="Create a resume"
      description="Start with the opportunity you are applying for."
    >
      <Paper withBorder p={{ base: "md", sm: "xl" }} radius="md">
        <CreateResumeForm />
      </Paper>
    </ResumesPageShell>
  );
}
