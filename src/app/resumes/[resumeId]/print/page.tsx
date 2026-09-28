import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResumeDocument from "@/components/resumes/ResumeDocument";
import ResumePrintControls from "@/components/resumes/ResumePrintControls";
import classes from "@/components/resumes/ResumePrint.module.css";
import { getLatestGeneratedResume } from "@/lib/queries/generated-resume";

export const metadata: Metadata = {
  title: "Print resume",
  robots: {
    index: false,
    follow: false,
  },
};

type ResumePrintPageProps = {
  params: Promise<{ resumeId: string }>;
};

export default async function ResumePrintPage({
  params,
}: ResumePrintPageProps) {
  const { resumeId } = await params;

  // This query requires authentication and checks resume ownership.
  const resume = await getLatestGeneratedResume(resumeId);

  if (!resume) {
    notFound();
  }

  return (
    <main className={classes.page}>
      <ResumePrintControls resumeId={resumeId} />

      <div className={classes.sheet}>
        <ResumeDocument resume={resume} />
      </div>
    </main>
  );
}
