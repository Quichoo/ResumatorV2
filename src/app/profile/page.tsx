import type { Metadata } from "next";
import { Container, Stack, Text, Title } from "@mantine/core";

import ProfileOverview from "@/components/profile/ProfileOverview";

export const metadata: Metadata = {
  title: "Master Profile",
  robots: {
    index: false,
    follow: false,
  },
};

const sampleProfile = {
  fullName: "Alex Santos",
  email: "alex@example.com",
  location: "Pampanga, Philippines",
  summary:
    "Frontend developer with experience building responsive interfaces using React and integrating REST APIs.",
  skills: ["React", "TypeScript", "HTML", "CSS", "Git"],
};

export default function ProfilePage() {
  return (
    <main>
      <Container size="md" py={{ base: "xl", sm: 48 }}>
        <Stack gap="xl">
          <Stack gap="xs">
            <Title order={1}>Master Profile</Title>
            <Text c="dimmed">
              Your experience, projects, and skills form the foundation of your
              tailored resumes.
            </Text>
            <Text size="sm" c="dimmed">
              Sample data for development.
            </Text>
          </Stack>

          <ProfileOverview {...sampleProfile} />
        </Stack>
      </Container>
    </main>
  );
}
