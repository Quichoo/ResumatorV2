import { Stack, Text, Textarea } from "@mantine/core";
import type { ResumeTextPreview as ResumeTextPreviewData } from "@/types/resume-import";

type ResumeTextPreviewProps = {
  preview: ResumeTextPreviewData;
};

export default function ResumeTextPreview({ preview }: ResumeTextPreviewProps) {
  return (
    <Stack gap="sm">
      <Text size="sm" c="teal.9" role="status">
        Read {preview.pageCount} {preview.pageCount === 1 ? "page" : "pages"}{" "}
        successfully.
      </Text>

      <Textarea
        label="Extracted resume text"
        description="Check for missing sections or text appearing in the wrong order."
        value={preview.text}
        readOnly
        rows={12}
      />

      <Text size="sm" c="dimmed">
        This is a preview. Your profile has not been updated.
      </Text>
    </Stack>
  );
}
