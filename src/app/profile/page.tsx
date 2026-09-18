import type { Metadata } from "next";
import { Suspense } from "react";
import { Divider } from "@mantine/core";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileLayout from "@/components/profile/ProfileLayout";
import Loader from "@/components/ui/Loader";
import WorkExperienceSection from "@/components/work-experience/WorkExperienceSection";
import { getProfilePageData } from "@/lib/queries/profile";

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
      <ProfileForm key={user.id} initialValues={initialValues} />

      <Divider my="xl" />

      <Suspense fallback={<Loader label="Loading work experience…" />}>
        <WorkExperienceSection />
      </Suspense>
    </ProfileLayout>
  );
}
