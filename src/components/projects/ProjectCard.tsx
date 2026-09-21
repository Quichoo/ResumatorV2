import type { ReactNode } from "react";
import { Anchor, Badge, Group, Text } from "@mantine/core";
import RecordCard from "@/components/ui/RecordCard";
import type { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
  actions?: ReactNode;
};

export default function ProjectCard({ project, actions }: ProjectCardProps) {
  return (
    <RecordCard title={project.projectName} actions={actions}>
      {project.description && (
        <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
          {project.description}
        </Text>
      )}

      {project.technologies.length > 0 && (
        <Group gap="xs">
          {project.technologies.map((technology) => (
            <Badge
              key={technology}
              color="blue"
              variant="light"
              maw="100%"
              title={technology}
            >
              {technology}
            </Badge>
          ))}
        </Group>
      )}

      {project.bulletPoints.length > 0 && (
        <ul
          style={{
            margin: 0,
            paddingInlineStart: "1.25rem",
            listStyleType: "disc",
          }}
        >
          {project.bulletPoints.map((point, index) => (
            <li key={`${index}-${point}`}>
              <Text component="span" size="sm">
                {point}
              </Text>
            </li>
          ))}
        </ul>
      )}

      {(project.projectUrl || project.repositoryUrl) && (
        <Group gap="md">
          {project.projectUrl && (
            <Anchor
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              c="blue.8"
              aria-label={`View ${project.projectName} (opens in a new tab)`}
            >
              View project
            </Anchor>
          )}

          {project.repositoryUrl && (
            <Anchor
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              c="blue.8"
              aria-label={`View source code for ${project.projectName} (opens in a new tab)`}
            >
              Source code
            </Anchor>
          )}
        </Group>
      )}
    </RecordCard>
  );
}
