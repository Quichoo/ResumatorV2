import { useState } from "react";
import WorkExperienceFields from "@/components/work-experience/WorkExperienceFields";
import type {
  WorkExperience,
  WorkExperienceFieldErrors,
} from "@/types/work-experience";

type WorkExperienceEditorFieldsProps = {
  experience?: WorkExperience;
  fieldErrors?: WorkExperienceFieldErrors;
};

export default function WorkExperienceEditorFields({
  experience,
  fieldErrors,
}: WorkExperienceEditorFieldsProps) {
  const [isCurrent, setIsCurrent] = useState(experience?.isCurrent ?? false);

  return (
    <WorkExperienceFields
      experience={experience}
      fieldErrors={fieldErrors}
      isCurrent={isCurrent}
      onIsCurrentChange={setIsCurrent}
    />
  );
}
