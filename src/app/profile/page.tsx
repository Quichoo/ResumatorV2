import type { Metadata } from "next";
import { Suspense } from "react";
import { Divider } from "@mantine/core";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileLayout from "@/components/profile/ProfileLayout";
import Loader from "@/components/ui/Loader";
import WorkExperienceSection from "@/components/work-experience/WorkExperienceSection";
import { getProfilePageData } from "@/lib/queries/profile";
import EducationSection from "@/components/education/EducationSection";
import ProjectsSection from "@/components/projects/ProjectsSection";
import SkillsSection from "@/components/skills/SkillsSection";
import ResumeImportSection from "@/components/resume-import/ResumeImportSection";

export const metadata: Metadata = {
  title: "Master Profile",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfilePage() {
  const { user, initialValues } = await getProfilePageData();

  return (
    <ProfileLayout user={user}>
      <ResumeImportSection />
      <Divider my="xl" />
      <ProfileForm key={user.id} initialValues={initialValues} />

      <Divider my="xl" />

      <Suspense fallback={<Loader label="Loading work experience…" />}>
        <WorkExperienceSection />
      </Suspense>

      <Divider my="xl" />

      <Suspense fallback={<Loader label="Loading education…" />}>
        <EducationSection />
      </Suspense>

      <Divider my="xl" />

      <Suspense fallback={<Loader label="Loading projects…" />}>
        <ProjectsSection />
      </Suspense>

      <Divider my="xl" />

      <Suspense fallback={<Loader label="Loading skills…" />}>
        <SkillsSection />
      </Suspense>
    </ProfileLayout>
  );
}
