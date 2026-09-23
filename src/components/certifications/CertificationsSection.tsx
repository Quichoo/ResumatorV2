import {
  Anchor,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import CertificationEditor from "@/components/certifications/CertificationEditor";
import DeleteCertificationButton from "@/components/certifications/DeleteCertificationButton";
import ErrorMessage from "@/components/ui/ErrorMessage";
import RecordRow from "@/components/ui/RecordRow";
import { getCertifications } from "@/lib/queries/certification";

export default async function CertificationsSection() {
  const result = await getCertifications();

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <Stack gap={4} style={{ flex: 1, minWidth: 240 }}>
          <Title order={2} size="h3">
            Certifications and courses
          </Title>

          <Text size="sm" c="dimmed">
            Add relevant certifications, training, and completed courses.
          </Text>
        </Stack>

        {result.success && <CertificationEditor />}
      </Group>

      {!result.success ? (
        <Stack gap="xs">
          <ErrorMessage
            title="Certifications unavailable"
            message={result.message}
          />

          <Anchor href="/profile" size="sm">
            Try again
          </Anchor>
        </Stack>
      ) : result.certifications.length === 0 ? (
        <Paper withBorder p="lg" radius="md">
          <Text size="sm" c="dimmed">
            Add your first certification or course to get started.
          </Text>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs" verticalSpacing="xs">
          {result.certifications.map((certification) => (
            <RecordRow
              key={certification.id}
              title={certification.name}
              subtitle={[certification.issuer, certification.issueYear]
                .filter((value) => value !== null)
                .join(" · ")}
              actions={
                <>
                  {certification.credentialUrl && (
                    <Anchor
                      href={certification.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View credential for ${certification.name} (opens in a new tab)`}
                      title="View credential"
                      c="blue.8"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 34,
                        height: 34,
                        flexShrink: 0,
                      }}
                    >
                      <IconExternalLink size={18} aria-hidden="true" />
                    </Anchor>
                  )}

                  <CertificationEditor certification={certification} compact />

                  <DeleteCertificationButton
                    certification={certification}
                    compact
                  />
                </>
              }
            />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
