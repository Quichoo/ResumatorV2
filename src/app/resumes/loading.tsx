import ResumesPageShell from "@/components/resumes/ResumesPageShell";
import ResumeListSkeleton from "@/components/resumes/ResumeListSkeleton";

export default function ResumesLoading() {
  return (
    <ResumesPageShell
      title="My resumes"
      description="Keep your resume versions organized for each opportunity."
    >
      <ResumeListSkeleton />
    </ResumesPageShell>
  );
}
