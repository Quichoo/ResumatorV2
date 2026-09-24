import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Paper } from "@mantine/core";
import EditResumeForm from "@/components/resumes/EditResumeForm";
import ResumesPageShell from "@/components/resumes/ResumesPageShell";
import { getResumeById } from "@/lib/queries/resume";

export const metadata: Metadata = {
  title: "Edit job details | Resumator",
};

type EditResumePageProps = {
  params: Promise<{ resumeId: string }>;
};

export default async function EditResumePage({ params }: EditResumePageProps) {
  const { resumeId } = await params;
  const resume = await getResumeById(resumeId);

  if (!resume) notFound();

  return (
    <ResumesPageShell
      title="Edit job details"
      description="Update the opportunity this resume version targets."
    >
      <Paper withBorder p={{ base: "md", sm: "xl" }} radius="md">
        <EditResumeForm key={resume.id} resume={resume} />
      </Paper>
    </ResumesPageShell>
  );
}
