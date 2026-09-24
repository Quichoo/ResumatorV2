import { Suspense } from "react";
import type { Metadata } from "next";
import ResumeList from "@/components/resumes/ResumeList";
import ResumesPageShell from "@/components/resumes/ResumesPageShell";
import { AppLinkButton } from "@/components/ui/AppLink";
import Loader from "@/components/ui/Loader";
import { requireUser } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "My resumes | Resumator",
};

export default async function ResumesPage() {
  await requireUser();

  return (
    <ResumesPageShell
      title="My resumes"
      description="Keep your resume versions organized for each opportunity."
      action={<AppLinkButton href="/resumes/new">Create resume</AppLinkButton>}
    >
      <Suspense fallback={<Loader label="Loading your resumes..." />}>
        <ResumeList />
      </Suspense>
    </ResumesPageShell>
  );
}
