import type { Metadata } from "next";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileLayout from "@/components/profile/ProfileLayout";
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
    </ProfileLayout>
  );
}
