"use client";

import { useState, type ChangeEvent } from "react";
import {
  SimpleGrid,
  Stack,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import type {
  Project,
  ProjectFieldErrors,
  ProjectReviewEntry,
  ProjectTextField,
} from "@/types/project";

type ProjectFieldsProps = {
  project?: Project;
  fieldErrors?: ProjectFieldErrors;
  disabled?: boolean;
  values?: ProjectReviewEntry;
  onValuesChange?: (patch: Partial<ProjectReviewEntry>) => void;
};

export default function ProjectFields({
  project,
  fieldErrors,
  disabled = false,
  values,
  onValuesChange,
}: ProjectFieldsProps) {
  const [localTechnologies, setLocalTechnologies] = useState<string[]>(
    project?.technologies ?? [],
  );

  const technologies = onValuesChange
    ? (values?.technologies ?? [])
    : localTechnologies;

  function updateTechnologies(nextTechnologies: string[]) {
    if (onValuesChange) {
      onValuesChange({ technologies: nextTechnologies });
    } else {
      setLocalTechnologies(nextTechnologies);
    }
  }

  function inputProps(field: ProjectTextField) {
    if (onValuesChange) {
      return {
        value: values?.[field] ?? "",
        onChange: (
          event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => onValuesChange({ [field]: event.currentTarget.value }),
      };
    }

    return {
      defaultValue:
        field === "bulletPointsText"
          ? (project?.bulletPoints.join("\n") ?? "")
          : (project?.[field] ?? ""),
    };
  }

  return (
    <Stack gap="md">
      <TextInput
        name="projectName"
        label="Project name"
        placeholder="Your project's name"
        {...inputProps("projectName")}
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
        {...inputProps("description")}
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
        onChange={updateTechnologies}
        error={fieldErrors?.technologies?.join(" ")}
        maxTags={30}
        disabled={disabled}
        acceptValueOnBlur
        clearable
      />

      {technologies.map((technology, index) => (
        <input
          key={`${technology}-${index}`}
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
        {...inputProps("bulletPointsText")}
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
          {...inputProps("projectUrl")}
          error={fieldErrors?.projectUrl?.join(" ")}
          maxLength={2048}
          disabled={disabled}
        />

        <TextInput
          name="repositoryUrl"
          type="url"
          label="Repository URL"
          placeholder="https://github.com/username/project"
          {...inputProps("repositoryUrl")}
          error={fieldErrors?.repositoryUrl?.join(" ")}
          maxLength={2048}
          disabled={disabled}
        />
      </SimpleGrid>
    </Stack>
  );
}
