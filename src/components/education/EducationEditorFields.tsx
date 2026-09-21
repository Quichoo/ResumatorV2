import { useState } from "react";
import EducationFields from "@/components/education/EducationFields";
import type { EducationEntry, EducationFieldErrors } from "@/types/education";

type EducationEditorFieldsProps = {
  entry?: EducationEntry;
  fieldErrors?: EducationFieldErrors;
};

export default function EducationEditorFields({
  entry,
  fieldErrors,
}: EducationEditorFieldsProps) {
  const [isCurrent, setIsCurrent] = useState(entry?.isCurrent ?? false);

  return (
    <EducationFields
      entry={entry}
      fieldErrors={fieldErrors}
      isCurrent={isCurrent}
      onIsCurrentChange={setIsCurrent}
    />
  );
}
