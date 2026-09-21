import { Anchor, Group, Paper, Stack, Text, Title } from "@mantine/core";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectEditor from "@/components/projects/ProjectEditor";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { getProjects } from "@/lib/queries/project";

export default async function ProjectsSection() {
  const result = await getProjects();

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <Stack gap={4} style={{ flex: 1, minWidth: 240 }}>
          <Title order={2} size="h3">
            Projects
          </Title>

          <Text size="sm" c="dimmed">
            Highlight projects, technologies, and your contributions.
          </Text>
        </Stack>

        {result.success && <ProjectEditor />}
      </Group>

      {!result.success ? (
        <Stack gap="xs">
          <ErrorMessage title="Projects unavailable" message={result.message} />

          <Anchor href="/profile" size="sm">
            Try again
          </Anchor>
        </Stack>
      ) : result.projects.length === 0 ? (
        <Paper withBorder p="lg" radius="md">
          <Text size="sm" c="dimmed">
            Add your first project to showcase your work.
          </Text>
        </Paper>
      ) : (
        result.projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            actions={
              <>
                <ProjectEditor project={project} />
                <DeleteProjectButton project={project} />
              </>
            }
          />
        ))
      )}
    </Stack>
  );
}
