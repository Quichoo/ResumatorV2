import { useState } from "react";
import {
  SimpleGrid,
  Stack,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import type { Project, ProjectFieldErrors } from "@/types/project";

type ProjectFieldsProps = {
  project?: Project;
  fieldErrors?: ProjectFieldErrors;
  disabled?: boolean;
};

export default function ProjectFields({
  project,
  fieldErrors,
  disabled = false,
}: ProjectFieldsProps) {
  const [technologies, setTechnologies] = useState<string[]>(
    project?.technologies ?? [],
  );

  return (
    <Stack gap="md">
      <TextInput
        name="projectName"
        label="Project name"
        placeholder="Your project’s name"
        defaultValue={project?.projectName ?? ""}
        error={fieldErrors?.projectName?.join(" ")}
        maxLength={160}
        disabled={disabled}
        required
        data-autofocus
      />

      <Textarea
        name="description"
        label="Description"
        description="Briefly explain the project and its purpose."
        defaultValue={project?.description ?? ""}
        error={fieldErrors?.description?.join(" ")}
        maxLength={5000}
        minRows={3}
        maxRows={8}
        disabled={disabled}
        autosize
      />

      <TagsInput
        label="Technologies"
        description="Press Enter or comma to add each technology. Up to 30."
        placeholder="Add a technology"
        value={technologies}
        onChange={setTechnologies}
        error={fieldErrors?.technologies?.join(" ")}
        maxTags={30}
        disabled={disabled}
        acceptValueOnBlur
        clearable
      />

      {technologies.map((technology) => (
        <input
          key={technology}
          type="hidden"
          name="technologies"
          value={technology}
          disabled={disabled}
        />
      ))}

      <Textarea
        name="bulletPoints"
        label="Contributions and achievements"
        description="One point per line. Up to 20 points, 500 characters each."
        placeholder="Describe what you built, improved, or contributed."
        defaultValue={project?.bulletPoints.join("\n") ?? ""}
        error={fieldErrors?.bulletPoints?.join(" ")}
        minRows={4}
        maxRows={10}
        disabled={disabled}
        autosize
      />

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput
          name="projectUrl"
          type="url"
          label="Live project URL"
          placeholder="https://example.com"
          defaultValue={project?.projectUrl ?? ""}
          error={fieldErrors?.projectUrl?.join(" ")}
          maxLength={2048}
          disabled={disabled}
        />

        <TextInput
          name="repositoryUrl"
          type="url"
          label="Repository URL"
          placeholder="https://github.com/username/project"
          defaultValue={project?.repositoryUrl ?? ""}
          error={fieldErrors?.repositoryUrl?.join(" ")}
          maxLength={2048}
          disabled={disabled}
        />
      </SimpleGrid>
    </Stack>
  );
}
