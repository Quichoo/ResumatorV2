import { SimpleGrid, Stack, Textarea, TextInput } from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconFileText,
  IconLink,
  IconMail,
  IconMapPin,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import type { ProfileFieldErrors, ProfileFormValues } from "@/types/profile";
import classes from "./ProfileLayout.module.css";

type ProfileFieldsProps = {
  values: ProfileFormValues;
  errors?: ProfileFieldErrors;
  disabled?: boolean;
  onValueChange?: (field: keyof ProfileFormValues, value: string) => void;
};

const fields = [
  {
    name: "fullName",
    label: "Full name",
    autoComplete: "name",
    maxLength: 120,
    required: true,
    icon: IconUser,
  },
  {
    name: "contactEmail",
    label: "Contact email",
    type: "email",
    autoComplete: "email",
    maxLength: 254,
    required: true,
    icon: IconMail,
  },
  {
    name: "phone",
    label: "Phone number",
    type: "tel",
    autoComplete: "tel",
    maxLength: 40,
    icon: IconPhone,
  },
  {
    name: "location",
    label: "Location",
    placeholder: "Pampanga, Philippines",
    maxLength: 120,
    icon: IconMapPin,
  },
  {
    name: "portfolioUrl",
    label: "Portfolio website",
    type: "url",
    placeholder: "https://yourwebsite.com",
    maxLength: 2048,
    icon: IconLink,
  },
  {
    name: "linkedinUrl",
    label: "LinkedIn URL",
    type: "url",
    placeholder: "https://www.linkedin.com/in/yourname",
    maxLength: 2048,
    icon: IconBrandLinkedin,
  },
  {
    name: "githubUrl",
    label: "GitHub URL",
    type: "url",
    placeholder: "https://github.com/yourname",
    maxLength: 2048,
    icon: IconBrandGithub,
  },
] as const;

export default function ProfileFields({
  values,
  errors,
  disabled = false,
  onValueChange,
}: ProfileFieldsProps) {
  return (
    <Stack gap={22}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={22}>
        {fields.map(({ icon: Icon, ...field }) => (
          <TextInput
            key={field.name}
            {...field}
            {...(onValueChange
              ? {
                  value: values[field.name] ?? "",
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                    onValueChange(field.name, event.currentTarget.value),
                }
              : {
                  defaultValue: values[field.name] ?? "",
                })}
            error={errors?.[field.name]?.[0]}
            disabled={disabled}
            leftSection={<Icon size={18} stroke={1.7} aria-hidden="true" />}
            leftSectionWidth={42}
            leftSectionPointerEvents="none"
            classNames={{
              root: field.name === "githubUrl" ? classes.fullWidth : undefined,
              input: classes.input,
              label: classes.label,
              section: classes.inputSection,
            }}
          />
        ))}
      </SimpleGrid>

      <Textarea
        name="summary"
        label="Professional summary"
        description="Introduce your experience, strengths, and career focus."
        placeholder="Write a short introduction about yourself."
        {...(onValueChange
          ? {
              value: values.summary ?? "",
              onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) =>
                onValueChange("summary", event.currentTarget.value),
            }
          : {
              defaultValue: values.summary ?? "",
            })}
        error={errors?.summary?.[0]}
        disabled={disabled}
        maxLength={5000}
        autosize
        minRows={4}
        maxRows={12}
        leftSection={<IconFileText size={18} stroke={1.7} aria-hidden="true" />}
        leftSectionWidth={42}
        leftSectionPointerEvents="none"
        classNames={{
          input: `${classes.input} ${classes.summaryInput}`,
          label: classes.label,
          description: classes.description,
          section: classes.summarySection,
        }}
      />
    </Stack>
  );
}
