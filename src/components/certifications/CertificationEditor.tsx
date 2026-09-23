"use client";

import { IconPencil, IconPlus } from "@tabler/icons-react";
import CertificationFields from "@/components/certifications/CertificationFields";
import RecordEditor from "@/components/ui/RecordEditor";
import { saveCertification } from "@/lib/actions/certification";
import type {
  Certification,
  CertificationFormValues,
} from "@/types/certification";

type CertificationEditorProps = {
  certification?: Certification;
  compact?: boolean;
};

export default function CertificationEditor({
  certification,
  compact = false,
}: CertificationEditorProps) {
  const TriggerIcon = certification ? IconPencil : IconPlus;

  const saveAction = saveCertification.bind(null, certification?.id ?? null);

  return (
    <RecordEditor<keyof CertificationFormValues>
      title={
        certification
          ? "Edit certification or course"
          : "Add certification or course"
      }
      triggerLabel={certification ? "Edit" : "Add certification"}
      triggerAriaLabel={
        certification
          ? `Edit ${certification.name}`
          : "Add certification or course"
      }
      triggerIcon={<TriggerIcon size={16} aria-hidden="true" />}
      compact={compact}
      submitLabel={certification ? "Save changes" : "Add certification"}
      pendingLabel="Saving certification..."
      errorTitle="Certification not saved"
      errorMessage="Unable to save this certification. Please try again."
      saveAction={saveAction}
      renderFields={(fieldErrors, pending) => (
        <CertificationFields
          certification={certification}
          fieldErrors={fieldErrors}
          disabled={pending}
        />
      )}
    />
  );
}
